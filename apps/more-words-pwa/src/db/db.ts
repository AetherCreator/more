import initSqlJs, { type Database } from 'sql.js'

const DB_NAME = 'morewords-db'
const DB_STORE = 'databases'
const DB_KEY = 'main'

let db: Database | null = null

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(DB_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function loadFromIndexedDB(): Promise<Uint8Array | null> {
  const idb = await openIndexedDB()
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(DB_STORE, 'readonly')
    const store = tx.objectStore(DB_STORE)
    const req = store.get(DB_KEY)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error)
  })
}

async function saveToIndexedDB(data: Uint8Array): Promise<void> {
  const idb = await openIndexedDB()
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(DB_STORE, 'readwrite')
    const store = tx.objectStore(DB_STORE)
    const req = store.put(data, DB_KEY)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

const MIGRATIONS = `
CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY,
  word TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT,
  definition TEXT NOT NULL,
  etymology TEXT,
  example_1 TEXT,
  example_2 TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  kid_safe INTEGER DEFAULT 1,
  mastery INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  is_kid INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'midnight',
  interests TEXT DEFAULT '',
  streak INTEGER DEFAULT 0,
  last_active TEXT
);

CREATE TABLE IF NOT EXISTS saved_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  saved_at TEXT DEFAULT (datetime('now')),
  mastery INTEGER DEFAULT 0,
  last_reviewed TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`

export async function initDB(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs({
    // Self-host the WASM (Vite copies node_modules/sql.js/dist/sql-wasm.wasm
    // into public/ at build time). Loading from the sql.js public CDN was
    // failing under PWA/COOP rules with 'both async and sync fetching of the
    // wasm failed' — file naming mismatch + cross-origin fetch.
    locateFile: () => '/sql-wasm.wasm',
  })

  const saved = await loadFromIndexedDB()
  db = saved ? new SQL.Database(saved) : new SQL.Database()

  db.run(MIGRATIONS)
  await persist()

  return db
}

export async function persist(): Promise<void> {
  if (!db) return
  const data = db.export()
  await saveToIndexedDB(data)
}

export function getDB(): Database {
  if (!db) throw new Error('Database not initialized. Call initDB() first.')
  return db
}

export function runQuery(sql: string, params?: unknown[]): void {
  getDB().run(sql, params as never)
}

export function selectAll<T>(sql: string, params?: unknown[]): T[] {
  const stmt = getDB().prepare(sql)
  if (params) stmt.bind(params as never)
  const results: T[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return results
}

export function selectOne<T>(sql: string, params?: unknown[]): T | null {
  const results = selectAll<T>(sql, params)
  return results[0] ?? null
}

export async function runAndPersist(sql: string, params?: unknown[]): Promise<void> {
  runQuery(sql, params)
  await persist()
}
