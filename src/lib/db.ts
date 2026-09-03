import fs from 'fs';
import path from 'path';
import { Person, PersonFormData, Marriage, ActivityEvent, FamilyEvent, FamilyEventFormData } from '@/types';
import initialSeedData from '../../data/initial_seed.json';

// ============================================================================
// Database Strategy:
// 1. If DATABASE_URL / POSTGRES_URL is provided -> PostgreSQL (Neon Serverless)
// 2. Otherwise (Local dev) -> Local SQLite (better-sqlite3) with in-memory fallback
// ============================================================================

function checkIsPostgres(): boolean {
  return Boolean(
    (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) ||
    (process.env.POSTGRES_URL && process.env.POSTGRES_URL.trim().length > 0)
  );
}

// Neon / PostgreSQL client setup
let pgClient: any = null;

function getPg() {
  if (!pgClient) {
    const connectionString = (process.env.DATABASE_URL || process.env.POSTGRES_URL || '').trim();
    const { neon } = require('@neondatabase/serverless');
    pgClient = neon(connectionString);
  }
  return pgClient;
}

// SQLite client setup
let sqliteDbInstance: any = null;
let inMemoryPersonsCache: Person[] | null = null;
let inMemoryEventsCache: FamilyEvent[] | null = null;

function getSqliteDb() {
  if (sqliteDbInstance) return sqliteDbInstance;
  try {
    const Database = require('better-sqlite3');
    const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const dbDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
    const dbPath = path.join(dbDir, 'family_tree.db');
    if (!fs.existsSync(dbDir)) {
      try { fs.mkdirSync(dbDir, { recursive: true }); } catch {}
    }
    sqliteDbInstance = new Database(dbPath);
    sqliteDbInstance.pragma('journal_mode = WAL');
    sqliteDbInstance.pragma('foreign_keys = ON');
    initSqliteSchema(sqliteDbInstance);
    return sqliteDbInstance;
  } catch (err) {
    console.warn('SQLite initialization note (fallback to bundled memory dataset):', err);
    return null;
  }
}

function initSqliteSchema(db: any) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        maiden_name TEXT,
        gender TEXT NOT NULL,
        birth_date TEXT,
        birth_place TEXT,
        death_date TEXT,
        death_place TEXT,
        father_id INTEGER,
        mother_id INTEGER,
        spouse_of_id INTEGER,
        biography TEXT,
        accomplishments TEXT,
        profession TEXT,
        education TEXT,
        photo TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS marriages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spouse1_id INTEGER NOT NULL,
        spouse2_id INTEGER NOT NULL,
        marriage_date TEXT,
        marriage_place TEXT,
        divorce_date TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS family_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        event_date TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'reunion',
        location TEXT,
        photo TEXT,
        photos TEXT,
        related_person_ids TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        person_id INTEGER,
        person_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const count = db.prepare('SELECT COUNT(*) as count FROM persons').get().count;
    if (count === 0) {
      seedSqlite(db);
    }
  } catch (e) {
    console.error('Error initializing SQLite schema:', e);
  }
}

function seedSqlite(db: any) {
  const { persons, marriages } = initialSeedData as any;
  const insertPerson = db.prepare(`
    INSERT INTO persons (
      id, first_name, last_name, maiden_name, gender, birth_date, birth_place,
      death_date, death_place, father_id, mother_id, spouse_of_id,
      biography, accomplishments, profession, education, photo
    ) VALUES (
      @id, @first_name, @last_name, @maiden_name, @gender, @birth_date, @birth_place,
      @death_date, @death_place, @father_id, @mother_id, @spouse_of_id,
      @biography, @accomplishments, @profession, @education, @photo
    )
  `);

  const insertMany = db.transaction((list: any[]) => {
    for (const p of list) {
      let photo = p.photo || p.photo_url || null;
      if (photo && !photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('data:')) {
        photo = `/media/${photo}`;
      }
      insertPerson.run({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        maiden_name: p.maiden_name || null,
        gender: p.gender,
        birth_date: p.birth_date || null,
        birth_place: p.birth_place || null,
        death_date: p.death_date || null,
        death_place: p.death_place || null,
        father_id: p.father_id || null,
        mother_id: p.mother_id || null,
        spouse_of_id: p.spouse_of_id || null,
        biography: p.biography || null,
        accomplishments: p.accomplishments || null,
        profession: p.profession || null,
        education: p.education || null,
        photo,
      });
    }
  });

  insertMany(persons);

  const insertMarriage = db.prepare(`
    INSERT INTO marriages (id, spouse1_id, spouse2_id, marriage_date, marriage_place, divorce_date, notes)
    VALUES (@id, @spouse1_id, @spouse2_id, @marriage_date, @marriage_place, @divorce_date, @notes)
  `);

  const insertMarriagesTx = db.transaction((list: any[]) => {
    for (const m of list) {
      insertMarriage.run({
        id: m.id,
        spouse1_id: m.spouse1_id,
        spouse2_id: m.spouse2_id,
        marriage_date: m.marriage_date || null,
        marriage_place: m.marriage_place || null,
        divorce_date: m.divorce_date || null,
        notes: m.notes || null,
      });
    }
  });

  insertMarriagesTx(marriages);
}

// Ensure Postgres tables and seeds
let pgInitialized = false;

async function ensurePgSchema() {
  if (pgInitialized) return;
  const sql = getPg();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS persons (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        maiden_name TEXT,
        gender VARCHAR(10) NOT NULL,
        birth_date TEXT,
        birth_place TEXT,
        death_date TEXT,
        death_place TEXT,
        father_id INTEGER,
        mother_id INTEGER,
        spouse_of_id INTEGER,
        biography TEXT,
        accomplishments TEXT,
        profession TEXT,
        education TEXT,
        photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS marriages (
        id SERIAL PRIMARY KEY,
        spouse1_id INTEGER NOT NULL,
        spouse2_id INTEGER NOT NULL,
        marriage_date TEXT,
        marriage_place TEXT,
        divorce_date TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS family_events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        event_date TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'reunion',
        location TEXT,
        photo TEXT,
        photos TEXT,
        related_person_ids TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        person_id INTEGER,
        person_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if persons table is empty in Postgres
    const countResult = await sql`SELECT COUNT(*)::int as count FROM persons`;
    const count = Number(countResult[0]?.count || 0);

    if (count === 0) {
      const { persons, marriages } = initialSeedData as any;
      for (const p of persons) {
        let photo = p.photo || p.photo_url || null;
        if (photo && !photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('data:')) {
          photo = `/media/${photo}`;
        }
        await sql`
          INSERT INTO persons (
            id, first_name, last_name, maiden_name, gender, birth_date, birth_place,
            death_date, death_place, father_id, mother_id, spouse_of_id,
            biography, accomplishments, profession, education, photo
          ) VALUES (
            ${p.id}, ${p.first_name}, ${p.last_name}, ${p.maiden_name || null}, ${p.gender},
            ${p.birth_date || null}, ${p.birth_place || null}, ${p.death_date || null}, ${p.death_place || null},
            ${p.father_id || null}, ${p.mother_id || null}, ${p.spouse_of_id || null},
            ${p.biography || null}, ${p.accomplishments || null}, ${p.profession || null},
            ${p.education || null}, ${photo}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }

      for (const m of marriages) {
        await sql`
          INSERT INTO marriages (id, spouse1_id, spouse2_id, marriage_date, marriage_place, divorce_date, notes)
          VALUES (${m.id}, ${m.spouse1_id}, ${m.spouse2_id}, ${m.marriage_date || null}, ${m.marriage_place || null}, ${m.divorce_date || null}, ${m.notes || null})
          ON CONFLICT (id) DO NOTHING
        `;
      }

      try {
        await sql`SELECT setval(pg_get_serial_sequence('persons', 'id'), (SELECT COALESCE(MAX(id), 1) FROM persons))`;
        await sql`SELECT setval(pg_get_serial_sequence('marriages', 'id'), (SELECT COALESCE(MAX(id), 1) FROM marriages))`;
      } catch {}
    }

    pgInitialized = true;
  } catch (err) {
    console.error('Error during PostgreSQL schema initialization:', err);
    throw err;
  }
}

// ============================================================================
// Public Database Interface (Transparent Dual SQLite / Postgres Support)
// ============================================================================

export async function getAllPersons(): Promise<Person[]> {
  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`SELECT * FROM persons ORDER BY id ASC`;
    return rows.map(formatPersonRow);
  } else {
    const db = getSqliteDb();
    if (!db) {
      if (!inMemoryPersonsCache) {
        inMemoryPersonsCache = (initialSeedData.persons as any[]).map(formatPersonRow);
      }
      return inMemoryPersonsCache;
    }
    const rows = db.prepare('SELECT * FROM persons ORDER BY id ASC').all();
    return rows.map(formatPersonRow);
  }
}

export async function getPersonById(id: number): Promise<Person | null> {
  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`SELECT * FROM persons WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return null;
    return formatPersonRow(rows[0]);
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllPersons();
      return all.find((p) => p.id === id) || null;
    }
    const row = db.prepare('SELECT * FROM persons WHERE id = ?').get(id);
    if (!row) return null;
    return formatPersonRow(row);
  }
}

export async function createPerson(data: PersonFormData): Promise<Person> {
  let photo = data.photo || null;
  if (photo && !photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('data:')) {
    photo = `/media/${photo}`;
  }

  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`
      INSERT INTO persons (
        first_name, last_name, maiden_name, gender, birth_date, birth_place,
        death_date, death_place, father_id, mother_id, spouse_of_id,
        biography, accomplishments, profession, education, photo
      ) VALUES (
        ${data.first_name}, ${data.last_name}, ${data.maiden_name || null}, ${data.gender},
        ${data.birth_date || null}, ${data.birth_place || null}, ${data.death_date || null}, ${data.death_place || null},
        ${data.father_id || null}, ${data.mother_id || null}, ${data.spouse_of_id || null},
        ${data.biography || null}, ${data.accomplishments || null}, ${data.profession || null},
        ${data.education || null}, ${photo}
      )
      RETURNING *
    `;
    const created = formatPersonRow(rows[0]);
    if (data.spouse_of_id) {
      await createMarriage({ spouse1_id: created.id, spouse2_id: data.spouse_of_id });
    }
    await logActivity('CREATE', `Ajout de ${data.first_name} ${data.last_name} à l'arbre`, created.id, `${data.first_name} ${data.last_name}`);
    return created;
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllPersons();
      const newId = (all.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;
      const newPerson: Person = {
        id: newId,
        first_name: data.first_name,
        last_name: data.last_name,
        maiden_name: data.maiden_name || null,
        gender: data.gender,
        birth_date: data.birth_date || null,
        birth_place: data.birth_place || null,
        death_date: data.death_date || null,
        death_place: data.death_place || null,
        father_id: data.father_id || null,
        mother_id: data.mother_id || null,
        spouse_of_id: data.spouse_of_id || null,
        biography: data.biography || null,
        accomplishments: data.accomplishments || null,
        profession: data.profession || null,
        education: data.education || null,
        photo,
      };
      inMemoryPersonsCache = [...all, newPerson];
      return newPerson;
    }
    const stmt = db.prepare(`
      INSERT INTO persons (
        first_name, last_name, maiden_name, gender, birth_date, birth_place,
        death_date, death_place, father_id, mother_id, spouse_of_id,
        biography, accomplishments, profession, education, photo, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, datetime('now'), datetime('now')
      )
    `);
    const info = stmt.run(
      data.first_name, data.last_name, data.maiden_name || null, data.gender,
      data.birth_date || null, data.birth_place || null, data.death_date || null, data.death_place || null,
      data.father_id || null, data.mother_id || null, data.spouse_of_id || null,
      data.biography || null, data.accomplishments || null, data.profession || null,
      data.education || null, photo
    );
    const newId = Number(info.lastInsertRowid);
    if (data.spouse_of_id) {
      await createMarriage({ spouse1_id: newId, spouse2_id: data.spouse_of_id });
    }
    await logActivity('CREATE', `Ajout de ${data.first_name} ${data.last_name} à l'arbre`, newId, `${data.first_name} ${data.last_name}`);
    return (await getPersonById(newId))!;
  }
}

export async function updatePerson(id: number, data: Partial<PersonFormData>): Promise<Person | null> {
  const existing = await getPersonById(id);
  if (!existing) return null;

  let photo = data.photo !== undefined ? data.photo : existing.photo;
  if (photo && !photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('data:')) {
    photo = `/media/${photo}`;
  }

  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`
      UPDATE persons SET
        first_name = COALESCE(${data.first_name ?? null}, first_name),
        last_name = COALESCE(${data.last_name ?? null}, last_name),
        maiden_name = ${data.maiden_name !== undefined ? data.maiden_name : existing.maiden_name},
        gender = COALESCE(${data.gender ?? null}, gender),
        birth_date = ${data.birth_date !== undefined ? data.birth_date : existing.birth_date},
        birth_place = ${data.birth_place !== undefined ? data.birth_place : existing.birth_place},
        death_date = ${data.death_date !== undefined ? data.death_date : existing.death_date},
        death_place = ${data.death_place !== undefined ? data.death_place : existing.death_place},
        father_id = ${data.father_id !== undefined ? data.father_id : existing.father_id},
        mother_id = ${data.mother_id !== undefined ? data.mother_id : existing.mother_id},
        spouse_of_id = ${data.spouse_of_id !== undefined ? data.spouse_of_id : existing.spouse_of_id},
        biography = ${data.biography !== undefined ? data.biography : existing.biography},
        accomplishments = ${data.accomplishments !== undefined ? data.accomplishments : existing.accomplishments},
        profession = ${data.profession !== undefined ? data.profession : existing.profession},
        education = ${data.education !== undefined ? data.education : existing.education},
        photo = ${photo},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    const updatedName = `${data.first_name || existing.first_name} ${data.last_name || existing.last_name}`;
    await logActivity('UPDATE', `Mise à jour des informations de ${updatedName}`, id, updatedName);
    return formatPersonRow(rows[0]);
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllPersons();
      const updated: Person = {
        ...existing,
        ...data,
        photo,
      };
      inMemoryPersonsCache = all.map((p) => (p.id === id ? updated : p));
      return updated;
    }
    const stmt = db.prepare(`
      UPDATE persons SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        maiden_name = ?,
        gender = COALESCE(?, gender),
        birth_date = ?,
        birth_place = ?,
        death_date = ?,
        death_place = ?,
        father_id = ?,
        mother_id = ?,
        spouse_of_id = ?,
        biography = ?,
        accomplishments = ?,
        profession = ?,
        education = ?,
        photo = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(
      data.first_name ?? existing.first_name,
      data.last_name ?? existing.last_name,
      data.maiden_name !== undefined ? data.maiden_name : existing.maiden_name,
      data.gender ?? existing.gender,
      data.birth_date !== undefined ? data.birth_date : existing.birth_date,
      data.birth_place !== undefined ? data.birth_place : existing.birth_place,
      data.death_date !== undefined ? data.death_date : existing.death_date,
      data.death_place !== undefined ? data.death_place : existing.death_place,
      data.father_id !== undefined ? data.father_id : existing.father_id,
      data.mother_id !== undefined ? data.mother_id : existing.mother_id,
      data.spouse_of_id !== undefined ? data.spouse_of_id : existing.spouse_of_id,
      data.biography !== undefined ? data.biography : existing.biography,
      data.accomplishments !== undefined ? data.accomplishments : existing.accomplishments,
      data.profession !== undefined ? data.profession : existing.profession,
      data.education !== undefined ? data.education : existing.education,
      photo,
      id
    );
    const updatedName = `${data.first_name || existing.first_name} ${data.last_name || existing.last_name}`;
    await logActivity('UPDATE', `Mise à jour des informations de ${updatedName}`, id, updatedName);
    return await getPersonById(id);
  }
}

export async function deletePerson(id: number): Promise<boolean> {
  const existing = await getPersonById(id);
  if (!existing) return false;

  const name = `${existing.first_name} ${existing.last_name}`;

  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    await sql`DELETE FROM persons WHERE id = ${id}`;
    await sql`DELETE FROM marriages WHERE spouse1_id = ${id} OR spouse2_id = ${id}`;
    await sql`UPDATE persons SET father_id = NULL WHERE father_id = ${id}`;
    await sql`UPDATE persons SET mother_id = NULL WHERE mother_id = ${id}`;
    await sql`UPDATE persons SET spouse_of_id = NULL WHERE spouse_of_id = ${id}`;
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllPersons();
      inMemoryPersonsCache = all.filter((p) => p.id !== id);
    } else {
      db.prepare('DELETE FROM persons WHERE id = ?').run(id);
      db.prepare('DELETE FROM marriages WHERE spouse1_id = ? OR spouse2_id = ?').run(id, id);
      db.prepare('UPDATE persons SET father_id = NULL WHERE father_id = ?').run(id);
      db.prepare('UPDATE persons SET mother_id = NULL WHERE mother_id = ?').run(id);
      db.prepare('UPDATE persons SET spouse_of_id = NULL WHERE spouse_of_id = ?').run(id);
    }
  }

  await logActivity('DELETE', `Suppression de ${name} de l'arbre`, id, name);
  return true;
}

export async function createMarriage(data: { spouse1_id: number; spouse2_id: number; marriage_date?: string; marriage_place?: string }): Promise<Marriage> {
  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`
      INSERT INTO marriages (spouse1_id, spouse2_id, marriage_date, marriage_place)
      VALUES (${data.spouse1_id}, ${data.spouse2_id}, ${data.marriage_date || null}, ${data.marriage_place || null})
      RETURNING *
    `;
    return rows[0] as Marriage;
  } else {
    const db = getSqliteDb();
    if (!db) {
      return {
        id: Date.now(),
        spouse1_id: data.spouse1_id,
        spouse2_id: data.spouse2_id,
        marriage_date: data.marriage_date || null,
        marriage_place: data.marriage_place || null,
      };
    }
    const stmt = db.prepare(`
      INSERT INTO marriages (spouse1_id, spouse2_id, marriage_date, marriage_place)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(data.spouse1_id, data.spouse2_id, data.marriage_date || null, data.marriage_place || null);
    const newId = Number(info.lastInsertRowid);
    return db.prepare('SELECT * FROM marriages WHERE id = ?').get(newId) as Marriage;
  }
}

export async function searchPersons(query: string, limit = 20): Promise<Person[]> {
  const q = `%${query.trim()}%`;
  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`
      SELECT * FROM persons
      WHERE first_name ILIKE ${q}
         OR last_name ILIKE ${q}
         OR maiden_name ILIKE ${q}
         OR profession ILIKE ${q}
         OR birth_place ILIKE ${q}
      ORDER BY last_name ASC, first_name ASC
      LIMIT ${limit}
    `;
    return rows.map(formatPersonRow);
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllPersons();
      const lower = query.trim().toLowerCase();
      return all
        .filter(
          (p) =>
            p.first_name.toLowerCase().includes(lower) ||
            p.last_name.toLowerCase().includes(lower) ||
            (p.profession && p.profession.toLowerCase().includes(lower)) ||
            (p.birth_place && p.birth_place.toLowerCase().includes(lower))
        )
        .slice(0, limit);
    }
    const rows = db.prepare(`
      SELECT * FROM persons
      WHERE first_name LIKE ?
         OR last_name LIKE ?
         OR maiden_name LIKE ?
         OR profession LIKE ?
         OR birth_place LIKE ?
      ORDER BY last_name ASC, first_name ASC
      LIMIT ?
    `).all(q, q, q, q, q, limit);
    return rows.map(formatPersonRow);
  }
}

// ============================================================================
// Events Operations
// ============================================================================

export async function getAllEvents(): Promise<FamilyEvent[]> {
  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`SELECT * FROM family_events ORDER BY event_date ASC`;
    return rows.map(formatEventRow);
  } else {
    const db = getSqliteDb();
    if (!db) {
      return inMemoryEventsCache || [];
    }
    const rows = db.prepare('SELECT * FROM family_events ORDER BY event_date ASC').all();
    return rows.map(formatEventRow);
  }
}

export async function getEventById(id: number): Promise<FamilyEvent | null> {
  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`SELECT * FROM family_events WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return null;
    return formatEventRow(rows[0]);
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllEvents();
      return all.find((e) => e.id === id) || null;
    }
    const row = db.prepare('SELECT * FROM family_events WHERE id = ?').get(id);
    if (!row) return null;
    return formatEventRow(row);
  }
}

export async function createEvent(data: FamilyEventFormData): Promise<FamilyEvent> {
  let photosList = data.photos || [];
  if (photosList.length === 0 && data.photo) {
    photosList = [data.photo];
  }

  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`
      INSERT INTO family_events (
        title, description, event_date, category, location, photo, photos, related_person_ids
      ) VALUES (
        ${data.title}, ${data.description}, ${data.event_date}, ${data.category || 'reunion'},
        ${data.location || null}, ${data.photo || (photosList.length > 0 ? photosList[0] : null)},
        ${JSON.stringify(photosList)}, ${JSON.stringify(data.related_person_ids || [])}
      )
      RETURNING *
    `;
    const created = formatEventRow(rows[0]);
    await logActivity('CREATE', `Création de l'événement familial "${data.title}"`, undefined, data.title);
    return created;
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllEvents();
      const newId = (all.reduce((max, e) => Math.max(max, e.id), 0) || 0) + 1;
      const newEvent: FamilyEvent = {
        id: newId,
        title: data.title,
        description: data.description,
        event_date: data.event_date,
        category: data.category || 'reunion',
        location: data.location || null,
        photo: data.photo || (photosList.length > 0 ? photosList[0] : null),
        photos: photosList,
        related_person_ids: data.related_person_ids || [],
        is_past: new Date(data.event_date) < new Date(),
      };
      inMemoryEventsCache = [...all, newEvent];
      return newEvent;
    }
    const stmt = db.prepare(`
      INSERT INTO family_events (
        title, description, event_date, category, location, photo, photos, related_person_ids
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
    const info = stmt.run(
      data.title, data.description, data.event_date, data.category || 'reunion',
      data.location || null, data.photo || (photosList.length > 0 ? photosList[0] : null),
      JSON.stringify(photosList), JSON.stringify(data.related_person_ids || [])
    );
    const newId = Number(info.lastInsertRowid);
    await logActivity('CREATE', `Création de l'événement familial "${data.title}"`, undefined, data.title);
    return (await getEventById(newId))!;
  }
}

export async function updateEvent(id: number, data: Partial<FamilyEventFormData>): Promise<FamilyEvent | null> {
  const existing = await getEventById(id);
  if (!existing) return null;

  let photosList = data.photos !== undefined ? data.photos : existing.photos;
  let photo = data.photo !== undefined ? data.photo : existing.photo;
  if (!photo && photosList && photosList.length > 0) {
    photo = photosList[0];
  }

  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    const rows = await sql`
      UPDATE family_events SET
        title = COALESCE(${data.title ?? null}, title),
        description = COALESCE(${data.description ?? null}, description),
        event_date = COALESCE(${data.event_date ?? null}, event_date),
        category = COALESCE(${data.category ?? null}, category),
        location = ${data.location !== undefined ? data.location : existing.location},
        photo = ${photo},
        photos = ${JSON.stringify(photosList || [])},
        related_person_ids = ${JSON.stringify(data.related_person_ids !== undefined ? data.related_person_ids : existing.related_person_ids)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    await logActivity('UPDATE', `Mise à jour de l'événement "${data.title || existing.title}"`, undefined, data.title || existing.title);
    return formatEventRow(rows[0]);
  } else {
    const db = getSqliteDb();
    if (!db) {
      const all = await getAllEvents();
      const updated: FamilyEvent = {
        ...existing,
        ...data,
        photo,
        photos: photosList,
      };
      inMemoryEventsCache = all.map((e) => (e.id === id ? updated : e));
      return updated;
    }
    const stmt = db.prepare(`
      UPDATE family_events SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        event_date = COALESCE(?, event_date),
        category = COALESCE(?, category),
        location = ?,
        photo = ?,
        photos = ?,
        related_person_ids = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(
      data.title ?? existing.title,
      data.description ?? existing.description,
      data.event_date ?? existing.event_date,
      data.category ?? existing.category,
      data.location !== undefined ? data.location : existing.location,
      photo,
      JSON.stringify(photosList || []),
      JSON.stringify(data.related_person_ids !== undefined ? data.related_person_ids : existing.related_person_ids),
      id
    );
    await logActivity('UPDATE', `Mise à jour de l'événement "${data.title || existing.title}"`, undefined, data.title || existing.title);
    return await getEventById(id);
  }
}

export async function deleteEvent(id: number): Promise<boolean> {
  const existing = await getEventById(id);
  if (!existing) return false;

  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    await sql`DELETE FROM family_events WHERE id = ${id}`;
  } else {
    const db = getSqliteDb();
    if (db) {
      db.prepare('DELETE FROM family_events WHERE id = ?').run(id);
    } else {
      const all = await getAllEvents();
      inMemoryEventsCache = all.filter((e) => e.id !== id);
    }
  }

  await logActivity('DELETE', `Suppression de l'événement "${existing.title}"`, undefined, existing.title);
  return true;
}

export async function syncEvents(eventsList: FamilyEvent[]): Promise<FamilyEvent[]> {
  if (!eventsList || eventsList.length === 0) return await getAllEvents();

  if (checkIsPostgres()) {
    await ensurePgSchema();
    const sql = getPg();
    for (const ev of eventsList) {
      await sql`
        INSERT INTO family_events (
          id, title, description, event_date, category, location, photo, photos, related_person_ids, updated_at
        ) VALUES (
          ${ev.id}, ${ev.title}, ${ev.description}, ${ev.event_date}, ${ev.category || 'reunion'},
          ${ev.location || null}, ${ev.photo || (ev.photos && ev.photos.length > 0 ? ev.photos[0] : null)},
          ${JSON.stringify(ev.photos || (ev.photo ? [ev.photo] : []))},
          ${JSON.stringify(ev.related_person_ids || [])},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          event_date = EXCLUDED.event_date,
          category = EXCLUDED.category,
          location = EXCLUDED.location,
          photo = EXCLUDED.photo,
          photos = EXCLUDED.photos,
          related_person_ids = EXCLUDED.related_person_ids,
          updated_at = CURRENT_TIMESTAMP
      `;
    }
  } else {
    const db = getSqliteDb();
    if (db) {
      const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO family_events (
          id, title, description, event_date, category, location, photo, photos, related_person_ids, updated_at
        ) VALUES (
          @id, @title, @description, @event_date, @category, @location, @photo, @photos, @related_person_ids, datetime('now')
        )
      `);
      const syncAll = db.transaction((list: FamilyEvent[]) => {
        for (const ev of list) {
          insertStmt.run({
            id: ev.id,
            title: ev.title,
            description: ev.description,
            event_date: ev.event_date,
            category: ev.category || 'reunion',
            location: ev.location || null,
            photo: ev.photo || (ev.photos && ev.photos.length > 0 ? ev.photos[0] : null),
            photos: JSON.stringify(ev.photos || (ev.photo ? [ev.photo] : [])),
            related_person_ids: JSON.stringify(ev.related_person_ids || []),
          });
        }
      });
      syncAll(eventsList);
    }
  }

  return await getAllEvents();
}

// ============================================================================
// Activity Logging
// ============================================================================

export async function logActivity(type: string, description: string, personId?: number, personName?: string) {
  try {
    if (checkIsPostgres()) {
      await ensurePgSchema();
      const sql = getPg();
      await sql`
        INSERT INTO activity_logs (type, description, person_id, person_name)
        VALUES (${type}, ${description}, ${personId || null}, ${personName || null})
      `;
    } else {
      const db = getSqliteDb();
      if (db) {
        db.prepare(`
          INSERT INTO activity_logs (type, description, person_id, person_name)
          VALUES (?, ?, ?, ?)
        `).run(type, description, personId || null, personName || null);
      }
    }
  } catch (e) {
    console.error('Error logging activity:', e);
  }
}

export async function getActivityLogs(limit = 10): Promise<ActivityEvent[]> {
  try {
    if (checkIsPostgres()) {
      await ensurePgSchema();
      const sql = getPg();
      const rows = await sql`SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ${limit}`;
      return rows.map(formatActivityRow);
    } else {
      const db = getSqliteDb();
      if (!db) return [];
      const rows = db.prepare('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?').all(limit);
      return rows.map(formatActivityRow);
    }
  } catch {
    return [];
  }
}

// ============================================================================
// Row Formatters
// ============================================================================

function formatPersonRow(row: any): Person {
  let photo = row.photo || null;
  if (photo && !photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('data:')) {
    photo = `/media/${photo}`;
  }
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    maiden_name: row.maiden_name || null,
    gender: row.gender,
    birth_date: row.birth_date || null,
    birth_place: row.birth_place || null,
    death_date: row.death_date || null,
    death_place: row.death_place || null,
    father_id: row.father_id || null,
    mother_id: row.mother_id || null,
    spouse_of_id: row.spouse_of_id || null,
    biography: row.biography || null,
    accomplishments: row.accomplishments || null,
    profession: row.profession || null,
    education: row.education || null,
    photo,
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function formatEventRow(row: any): FamilyEvent {
  let photosList: string[] = [];
  try {
    if (typeof row.photos === 'string') {
      photosList = JSON.parse(row.photos);
    } else if (Array.isArray(row.photos)) {
      photosList = row.photos;
    }
  } catch {}

  let relatedIds: number[] = [];
  try {
    if (typeof row.related_person_ids === 'string') {
      relatedIds = JSON.parse(row.related_person_ids);
    } else if (Array.isArray(row.related_person_ids)) {
      relatedIds = row.related_person_ids;
    }
  } catch {}

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const eventDate = new Date(row.event_date);
  const isPast = eventDate < now;
  const diffTime = eventDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    ...row,
    photo: row.photo || (photosList.length > 0 ? photosList[0] : null),
    photos: photosList,
    related_person_ids: relatedIds,
    is_past: isPast,
    days_until: daysUntil >= 0 ? daysUntil : undefined,
  };
}

function formatActivityRow(row: any): ActivityEvent {
  let actType: ActivityEvent['type'] = 'addition';
  if (row.type === 'UPDATE') actType = 'edit';
  else if (row.type === 'DELETE') actType = 'edit';
  else if (row.type === 'PHOTO') actType = 'photo';

  return {
    id: String(row.id),
    type: actType,
    user: 'Famille LISSANON',
    timestamp: row.created_at,
    description: row.description,
    person_id: row.person_id || undefined,
    person_name: row.person_name || undefined,
  };
}
