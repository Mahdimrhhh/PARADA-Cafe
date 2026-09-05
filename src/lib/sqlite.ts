import Database from "better-sqlite3";
import { join } from "node:path";
import type { Sql } from "./db";

const DB_PATH = join(process.cwd(), "parada.sqlite");

function convertPlaceholders(sql: string): string {
  return sql.replace(/\$\d+/g, "?");
}

function toSql(db: Database.Database): Sql {
  const run = async <T = Record<string, unknown>>(
    sqlText: string,
    params: unknown[] = [],
  ): Promise<T[]> => {
    const stmt = db.prepare(convertPlaceholders(sqlText));
    const rows = stmt.all(...params) as T[];
    return rows;
  };
  const sql = run as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

export async function createSqliteSql(): Promise<Sql> {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return toSql(db);
}
