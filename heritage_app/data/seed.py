import sqlite3
import json
import os

db_path = os.path.join(os.path.dirname(__file__), 'family_tree.db')
seed_file = os.path.join(os.path.dirname(__file__), 'initial_seed.json')

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Ensure tables exist
cur.executescript("""
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
""")

with open(seed_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

persons = data.get('persons', [])

cur.execute("DELETE FROM persons")

for p in persons:
    photo = p.get('photo')
    if photo and not photo.startswith('/') and not photo.startswith('http'):
        photo = f"/media/{photo}"
    
    cur.execute("""
        INSERT INTO persons (
            id, first_name, last_name, maiden_name, gender, birth_date, birth_place,
            death_date, death_place, father_id, mother_id, spouse_of_id,
            biography, accomplishments, profession, education, photo, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        p['id'],
        p['first_name'],
        p['last_name'],
        p.get('maiden_name') or None,
        p['gender'],
        p.get('birth_date') or None,
        p.get('birth_place') or None,
        p.get('death_date') or None,
        p.get('death_place') or None,
        p.get('father_id'),
        p.get('mother_id'),
        p.get('spouse_of_id'),
        p.get('biography') or None,
        p.get('accomplishments') or None,
        p.get('profession') or None,
        p.get('education') or None,
        photo or None,
        p.get('created_at'),
        p.get('updated_at')
    ))

cur.execute("DELETE FROM activity_logs")
cur.execute("""
    INSERT INTO activity_logs (id, type, description, user, timestamp)
    VALUES (?, ?, ?, ?, datetime('now'))
""", ('init-seed', 'addition', f"Initialisation de l'arbre avec {len(persons)} membres de la famille LISSANON.", 'Système'))

conn.commit()

count = cur.execute("SELECT count(*) FROM persons").fetchone()[0]
print(f"Database successfully seeded with {count} persons.")
conn.close()
