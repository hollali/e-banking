import { drizzle } from 'drizzle-orm/neon-http';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import * as schema from './schema';

let _sql: NeonQueryFunction<false, false> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(process.env.DATABASE_URL);
    _db = drizzle(_sql, { schema });
  }
  return _db;
}

export { getDb };
export type DbType = ReturnType<typeof drizzle>;
