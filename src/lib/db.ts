import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Person, PersonFormData, Marriage, ActivityEvent, FamilyEvent, FamilyEventFormData } from '@/types';

function findSeedFile(): string | null {
  const possibleFiles = [
    path.join(process.cwd(), 'data', 'initial_seed.json'),
    path.join(__dirname, '..', '..', 'data', 'initial_seed.json'),
  ];
  for (const file of possibleFiles) {
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function findDbPath(): string {
  // If running on Vercel or AWS Lambda / Serverless
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    const tmpDir = '/tmp';
    const tmpDb = path.join(tmpDir, 'family_tree.db');
    
    // Copy existing database from data/ to /tmp/ if /tmp/ does not have it
    if (!fs.existsSync(tmpDb) || fs.statSync(tmpDb).size === 0) {
      const candidates = [
        path.join(process.cwd(), 'data', 'family_tree.db'),
        path.join(__dirname, '..', '..', 'data', 'family_tree.db'),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.statSync(cand).size > 0) {
          try {
            fs.copyFileSync(cand, tmpDb);
            break;
          } catch (e) {
            console.warn('Could not copy candidate DB to /tmp:', e);
          }
        }
      }
    }
    return tmpDb;
  }

  const possibleDirs = [
    path.join(process.cwd(), 'data'),
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
    try {
      fs.mkdirSync(defaultDir, { recursive: true });
    } catch {
      return path.join('/tmp', 'family_tree.db');
    }
  }
  return path.join(defaultDir, 'family_tree.db');
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dbPath = findDbPath();
  
  try {
    dbInstance = new Database(dbPath);
  } catch (err) {
    console.error('Failed to open database at:', dbPath, err);
    const fallback = path.join('/tmp', 'family_tree.db');
    dbInstance = new Database(fallback);
  }

  try {
    dbInstance.pragma('journal_mode = DELETE');
  } catch {
    // Ignore journal mode issues on serverless
  }

  try {
    dbInstance.pragma('foreign_keys = ON');
  } catch {
    // Ignore
  }

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

  // Seed persons & marriages if table is empty
  try {
    const personsCount = (dbInstance.prepare('SELECT COUNT(*) as count FROM persons').get() as { count: number }).count;
    if (personsCount === 0) {
      const seedPath = findSeedFile();
      if (seedPath) {
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
        const seedPersons = seedData.persons || [];
        const seedMarriages = seedData.marriages || [];

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

        const insertMarriage = dbInstance.prepare(`
          INSERT INTO marriages (spouse1_id, spouse2_id, marriage_date, marriage_place, divorce_date, notes)
          VALUES (@spouse1_id, @spouse2_id, @marriage_date, @marriage_place, @divorce_date, @notes)
        `);

        const insertAll = dbInstance.transaction((personsList: any[], marriagesList: any[]) => {
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

          for (const m of marriagesList) {
            insertMarriage.run({
              spouse1_id: m.spouse1_id,
              spouse2_id: m.spouse2_id,
              marriage_date: m.marriage_date || null,
              marriage_place: m.marriage_place || null,
              divorce_date: m.divorce_date || null,
              notes: m.notes || null,
            });
          }
        });

        insertAll(seedPersons, seedMarriages);
      }
    }
  } catch (err) {
    console.error('Error auto-seeding DB:', err);
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

  if (data.spouse_of_id) {
    createMarriage({
      spouse1_id: newId,
      spouse2_id: data.spouse_of_id,
    });
  }

  logActivity('CREATE', `Ajout de ${data.first_name} ${data.last_name} à l'arbre`, newId, `${data.first_name} ${data.last_name}`);

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
  logActivity('UPDATE', `Mise à jour des informations de ${updatedName}`, id, updatedName);

  return getPersonById(id);
}

export function deletePerson(id: number): boolean {
  const db = getDb();
  const person = getPersonById(id);
  if (!person) return false;

  const name = `${person.first_name} ${person.last_name}`;

  db.prepare('DELETE FROM persons WHERE id = ?').run(id);

  logActivity('DELETE', `Suppression de ${name} de l'arbre`, undefined, name);

  return true;
}

// Marriage Queries
export function getAllMarriages(): Marriage[] {
  const db = getDb();
  return db.prepare('SELECT * FROM marriages').all() as Marriage[];
}

export function getMarriagesForPerson(personId: number): Marriage[] {
  const db = getDb();
  return db.prepare('SELECT * FROM marriages WHERE spouse1_id = ? OR spouse2_id = ?').all(personId, personId) as Marriage[];
}

export function createMarriage(data: { spouse1_id: number; spouse2_id: number; marriage_date?: string; marriage_place?: string; notes?: string }): Marriage {
  const db = getDb();

  const existing = db.prepare(`
    SELECT * FROM marriages
    WHERE (spouse1_id = ? AND spouse2_id = ?) OR (spouse1_id = ? AND spouse2_id = ?)
  `).get(data.spouse1_id, data.spouse2_id, data.spouse2_id, data.spouse1_id) as Marriage | undefined;

  if (existing) return existing;

  const stmt = db.prepare(`
    INSERT INTO marriages (spouse1_id, spouse2_id, marriage_date, marriage_place, notes)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    data.spouse1_id,
    data.spouse2_id,
    data.marriage_date || null,
    data.marriage_place || null,
    data.notes || null
  );

  return db.prepare('SELECT * FROM marriages WHERE id = ?').get(info.lastInsertRowid) as Marriage;
}

// Activity Log Queries
export function getActivityLogs(limit = 10): ActivityEvent[] {
  const db = getDb();
  return db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT ?').all(limit) as ActivityEvent[];
}

export function logActivity(type: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW', description: string, personId?: number, personName?: string) {
  try {
    const db = getDb();
    const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.prepare(`
      INSERT INTO activity_logs (id, type, description, user, person_id, person_name, timestamp)
      VALUES (?, ?, ?, 'Admin', ?, ?, datetime('now'))
    `).run(id, type, description, personId || null, personName || null);
  } catch (err) {
    console.error('Error logging activity:', err);
  }
}

// Search
export function searchPersons(query: string, limit: number = 50): Person[] {
  const db = getDb();
  const q = `%${query}%`;
  return db.prepare(`
    SELECT * FROM persons
    WHERE first_name LIKE ?
       OR last_name LIKE ?
       OR maiden_name LIKE ?
       OR profession LIKE ?
       OR birth_place LIKE ?
       OR death_place LIKE ?
       OR accomplishments LIKE ?
       OR biography LIKE ?
    ORDER BY birth_date ASC, last_name ASC
    LIMIT ?
  `).all(q, q, q, q, q, q, q, q, limit) as Person[];
}

// Events Queries
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

  const stmt = db.prepare(`
    INSERT INTO family_events (
      title, description, event_date, category, location, photo, photos, related_person_ids
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const info = stmt.run(
    data.title,
    data.description,
    data.event_date,
    data.category,
    data.location || null,
    data.photo || (photosList.length > 0 ? photosList[0] : null),
    JSON.stringify(photosList),
    JSON.stringify(data.related_person_ids || [])
  );

  const newId = Number(info.lastInsertRowid);
  logActivity('CREATE', `Création de l'événement familial "${data.title}"`, undefined, data.title);

  return getEventById(newId)!;
}

export function updateEvent(id: number, data: Partial<FamilyEventFormData>): FamilyEvent | null {
  const db = getDb();
  const existing = getEventById(id);
  if (!existing) return null;

  let photosList = data.photos !== undefined ? data.photos : existing.photos;
  let photo = data.photo !== undefined ? data.photo : existing.photo;
  if (!photo && photosList && photosList.length > 0) {
    photo = photosList[0];
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

  logActivity('UPDATE', `Mise à jour de l'événement "${data.title || existing.title}"`, undefined, data.title || existing.title);

  return getEventById(id);
}

export function deleteEvent(id: number): boolean {
  const db = getDb();
  const existing = getEventById(id);
  if (!existing) return false;

  db.prepare('DELETE FROM family_events WHERE id = ?').run(id);
  logActivity('DELETE', `Suppression de l'événement "${existing.title}"`, undefined, existing.title);

  return true;
}
