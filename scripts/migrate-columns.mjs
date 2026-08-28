/**
 * Additive column migrations.
 *
 * schema.sql is idempotent because every statement is CREATE ... IF NOT EXISTS,
 * but sqlite has no ADD COLUMN IF NOT EXISTS. Each column is therefore checked
 * against PRAGMA table_info first, so this is safe to run against a database
 * that already holds live data.
 */
export function addColumns(db) {
  const wanted = [
    ['users', 'email_verified_at', 'TEXT'],
    ['users', 'password_changed_at', 'TEXT'],
  ];

  const added = [];
  for (const [table, column, type] of wanted) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
    if (!cols.includes(column)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
      added.push(`${table}.${column}`);
    }
  }
  return added;
}
