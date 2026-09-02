import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Person, PersonFormData, Marriage, ActivityEvent, FamilyEvent, FamilyEventFormData } from '@/types';

function findDbPath(): string {
  const possibleDirs = [
    path.join(process.cwd(), 'data'),
    path.join(process.cwd(), 'heritage_app', 'data'),
    path.join(__dirname, '..', '..', 'data'),
  ];
  for (const dir of possibleDirs) {
    const candidate = path.join(dir, 'family_tree.db');
    if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
      return candidate;
    }
  }
  const defaultDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }
  return path.join(defaultDir, 'family_tree.db');
}

function findSeedFile(): string | null {
  const possibleFiles = [
    path.join(process.cwd(), 'data', 'initial_seed.json'),
    path.join(process.cwd(), 'heritage_app', 'data', 'initial_seed.json'),
    path.join(__dirname, '..', '..', 'data', 'initial_seed.json'),
  ];
  for (const file of possibleFiles) {
    if (fs.existsSync(file)) return file;
  }
  return null;
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dbPath = findDbPath();
  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  // Initialize schema
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      maiden_name TEXT,
      gender TEXT NOT NULL CHECK(gender IN ('M', 'F')),
      birth_date TEXT,
      birth_place TEXT,
      death_date TEXT,
      death_place TEXT,
      father_id INTEGER REFERENCES persons(id) ON DELETE SET NULL,
      mother_id INTEGER REFERENCES persons(id) ON DELETE SET NULL,
      spouse_of_id INTEGER REFERENCES persons(id) ON DELETE SET NULL,
      biography TEXT,
      accomplishments TEXT,
      profession TEXT,
      education TEXT,
      photo TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS marriages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spouse1_id INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
      spouse2_id INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
      marriage_date TEXT,
      marriage_place TEXT,
      divorce_date TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      user TEXT NOT NULL DEFAULT 'Admin',
      person_id INTEGER REFERENCES persons(id) ON DELETE SET NULL,
      person_name TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
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
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Safe migration if photos column didn't exist
  try {
    dbInstance.exec(`ALTER TABLE family_events ADD COLUMN photos TEXT;`);
  } catch {
    // Column already exists
  }

  // Seed persons if table is empty
  const personsCount = (dbInstance.prepare('SELECT COUNT(*) as count FROM persons').get() as { count: number }).count;
  if (personsCount === 0) {
    const seedPath = findSeedFile();
    if (seedPath) {
      try {
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
        const seedPersons = seedData.persons || [];
        const insertPerson = dbInstance.prepare(`
          INSERT INTO persons (
            id, first_name, last_name, maiden_name, gender, birth_date, birth_place,
            death_date, death_place, father_id, mother_id, spouse_of_id,
            biography, accomplishments, profession, education, photo, created_at, updated_at
          ) VALUES (
            @id, @first_name, @last_name, @maiden_name, @gender, @birth_date, @birth_place,
            @death_date, @death_place, @father_id, @mother_id, @spouse_of_id,
            @biography, @accomplishments, @profession, @education, @photo, datetime('now'), datetime('now')
          )
        `);

        const insertAllPersons = dbInstance.transaction((personsList: any[]) => {
          for (const p of personsList) {
            let photo = p.photo || null;
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

        insertAllPersons(seedPersons);
      } catch (err) {
        console.error('Error auto-seeding persons:', err);
      }
    }
  }

  return dbInstance;
}

// Person Queries
export function getAllPersons(): Person[] {
  const db = getDb();
  return db.prepare('SELECT * FROM persons ORDER BY birth_date ASC, id ASC').all() as Person[];
}

export function getPersonById(id: number): Person | null {
  const db = getDb();
  const person = db.prepare('SELECT * FROM persons WHERE id = ?').get(id) as Person | undefined;
  return person || null;
}

export function createPerson(data: PersonFormData): Person {
  const db = getDb();
  let photo = data.photo || null;
  if (photo && !photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('data:')) {
    photo = `/media/${photo}`;
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
    data.first_name,
    data.last_name,
    data.maiden_name || null,
    data.gender,
    data.birth_date || null,
    data.birth_place || null,
    data.death_date || null,
    data.death_place || null,
    data.father_id || null,
    data.mother_id || null,
    data.spouse_of_id || null,
    data.biography || null,
    data.accomplishments || null,
    data.profession || null,
    data.education || null,
    photo
  );

  const newId = Number(info.lastInsertRowid);
  const fullName = `${data.first_name} ${data.last_name}`;

  logActivity('addition', `Ajout de ${fullName} à l'arbre généalogique`, newId, fullName);

  return getPersonById(newId)!;
}

export function updatePerson(id: number, data: Partial<PersonFormData>): Person | null {
  const db = getDb();
  const existing = getPersonById(id);
  if (!existing) return null;

  let photo = data.photo !== undefined ? data.photo : existing.photo;
  if (photo && !photo.startsWith('/') && !photo.startsWith('http') && !photo.startsWith('data:')) {
    photo = `/media/${photo}`;
  }

  const stmt = db.prepare(`
    UPDATE persons SET
      first_name = ?,
      last_name = ?,
      maiden_name = ?,
      gender = ?,
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
    data.maiden_name !== undefined ? (data.maiden_name || null) : existing.maiden_name,
    data.gender ?? existing.gender,
    data.birth_date !== undefined ? (data.birth_date || null) : existing.birth_date,
    data.birth_place !== undefined ? (data.birth_place || null) : existing.birth_place,
    data.death_date !== undefined ? (data.death_date || null) : existing.death_date,
    data.death_place !== undefined ? (data.death_place || null) : existing.death_place,
    data.father_id !== undefined ? (data.father_id || null) : existing.father_id,
    data.mother_id !== undefined ? (data.mother_id || null) : existing.mother_id,
    data.spouse_of_id !== undefined ? (data.spouse_of_id || null) : existing.spouse_of_id,
    data.biography !== undefined ? (data.biography || null) : existing.biography,
    data.accomplishments !== undefined ? (data.accomplishments || null) : existing.accomplishments,
    data.profession !== undefined ? (data.profession || null) : existing.profession,
    data.education !== undefined ? (data.education || null) : existing.education,
    photo || null,
    id
  );

  const updated = getPersonById(id)!;
  const fullName = `${updated.first_name} ${updated.last_name}`;

  logActivity('edit', `Mise à jour des informations de ${fullName}`, id, fullName);

  return updated;
}

export function deletePerson(id: number): boolean {
  const db = getDb();
  const person = getPersonById(id);
  if (!person) return false;

  const fullName = `${person.first_name} ${person.last_name}`;
  db.prepare('DELETE FROM persons WHERE id = ?').run(id);

  logActivity('edit', `Suppression de ${fullName} de l'arbre`, undefined, fullName);
  return true;
}

export function searchPersons(query: string, limit = 20): Person[] {
  const db = getDb();
  if (!query || query.trim().length === 0) {
    return db.prepare('SELECT * FROM persons ORDER BY birth_date ASC LIMIT ?').all(limit) as Person[];
  }

  const searchTerm = `%${query.trim()}%`;
  return db.prepare(`
    SELECT * FROM persons
    WHERE first_name LIKE ?
       OR last_name LIKE ?
       OR maiden_name LIKE ?
       OR profession LIKE ?
       OR birth_place LIKE ?
    ORDER BY birth_date ASC
    LIMIT ?
  `).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit) as Person[];
}

export function getActivityLogs(limit = 15): ActivityEvent[] {
  const db = getDb();
  return db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT ?').all(limit) as ActivityEvent[];
}

export function logActivity(type: ActivityEvent['type'], description: string, personId?: number, personName?: string, user = 'Admin') {
  const db = getDb();
  const id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  db.prepare(`
    INSERT INTO activity_logs (id, type, description, user, person_id, person_name, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(id, type, description, user, personId || null, personName || null);
}

// ==========================================
// Family Events Queries with Multi-Photo Gallery Support
// ==========================================

function formatEventRow(row: any): FamilyEvent {
  let relatedIds: number[] = [];
  if (row.related_person_ids) {
    try {
      relatedIds = JSON.parse(row.related_person_ids);
    } catch {
      relatedIds = [];
    }
  }

  let photosList: string[] = [];
  if (row.photos) {
    try {
      photosList = JSON.parse(row.photos);
    } catch {
      photosList = [];
    }
  }

  if (photosList.length === 0 && row.photo) {
    photosList = [row.photo];
  }

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

export function getAllEvents(): FamilyEvent[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM family_events ORDER BY event_date ASC').all();
  return rows.map(formatEventRow);
}

export function getEventById(id: number): FamilyEvent | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM family_events WHERE id = ?').get(id);
  if (!row) return null;
  return formatEventRow(row);
}

export function createEvent(data: FamilyEventFormData): FamilyEvent {
  const db = getDb();

  let photosList = data.photos || [];
  if (photosList.length === 0 && data.photo) {
    photosList = [data.photo];
  }

  // Normalize photo paths
  photosList = photosList.map((p) => {
    if (p && !p.startsWith('/') && !p.startsWith('http') && !p.startsWith('data:')) {
      return `/media/${p}`;
    }
    return p;
  });

  const mainPhoto = photosList.length > 0 ? photosList[0] : null;

  const relatedJson = data.related_person_ids && data.related_person_ids.length > 0
    ? JSON.stringify(data.related_person_ids)
    : null;

  const photosJson = photosList.length > 0 ? JSON.stringify(photosList) : null;

  const stmt = db.prepare(`
    INSERT INTO family_events (title, description, event_date, category, location, photo, photos, related_person_ids, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const info = stmt.run(
    data.title,
    data.description,
    data.event_date,
    data.category || 'reunion',
    data.location || null,
    mainPhoto,
    photosJson,
    relatedJson
  );

  const newId = Number(info.lastInsertRowid);
  logActivity('addition', `Création de l'événement familial : ${data.title}`);

  return getEventById(newId)!;
}

export function updateEvent(id: number, data: Partial<FamilyEventFormData>): FamilyEvent | null {
  const db = getDb();
  const existing = getEventById(id);
  if (!existing) return null;

  let photosList = data.photos !== undefined ? data.photos : (existing.photos || []);
  if (photosList.length === 0 && data.photo) {
    photosList = [data.photo];
  }

  photosList = photosList.map((p) => {
    if (p && !p.startsWith('/') && !p.startsWith('http') && !p.startsWith('data:')) {
      return `/media/${p}`;
    }
    return p;
  });

  const mainPhoto = photosList.length > 0 ? photosList[0] : (data.photo !== undefined ? data.photo : existing.photo);

  const relatedJson = data.related_person_ids !== undefined
    ? (data.related_person_ids.length > 0 ? JSON.stringify(data.related_person_ids) : null)
    : (existing.related_person_ids && existing.related_person_ids.length > 0 ? JSON.stringify(existing.related_person_ids) : null);

  const photosJson = photosList.length > 0 ? JSON.stringify(photosList) : null;

  const stmt = db.prepare(`
    UPDATE family_events SET
      title = ?,
      description = ?,
      event_date = ?,
      category = ?,
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
    data.location !== undefined ? (data.location || null) : existing.location,
    mainPhoto || null,
    photosJson,
    relatedJson,
    id
  );

  logActivity('edit', `Mise à jour de l'événement : ${data.title ?? existing.title}`);
  return getEventById(id);
}

export function deleteEvent(id: number): boolean {
  const db = getDb();
  const existing = getEventById(id);
  if (!existing) return false;

  db.prepare('DELETE FROM family_events WHERE id = ?').run(id);
  logActivity('edit', `Suppression de l'événement : ${existing.title}`);
  return true;
}
