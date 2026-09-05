import { pendingMigrations } from "../../scripts/migration-plan.mjs";
import { join } from "node:path";

/** Which database backend is active. */
export type DbSource = "neon" | "sqlite";

const rawDatabaseUrl =
  typeof process !== "undefined" ? process.env.DATABASE_URL : undefined;
const databaseUrl =
  rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : undefined;

export const dbSource: DbSource = databaseUrl ? "neon" : "sqlite";

export interface Sql {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]>;
}

const globalRef = globalThis as typeof globalThis & {
  __pgSqlPromise__?: Promise<Sql>;
  __sqliteInstance__?: Promise<Sql>;
};

const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;

type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

function toSql(run: Run): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

function createNeonSql(): Promise<Sql> {
  globalRef.__pgSqlPromise__ ??= (async () => {
    const { Pool, types } = await import("pg");
    types.setTypeParser(OID_INT8, Number);
    types.setTypeParser(OID_DATE, identity);
    types.setTypeParser(OID_INTERVAL, identity);
    const pool = new Pool({ connectionString: databaseUrl });
    return toSql(async <T>(text: string, params: unknown[]) => {
      const res = await pool.query(text, params);
      return res.rows as T[];
    });
  })().catch((err) => {
    globalRef.__pgSqlPromise__ = undefined;
    throw err;
  });
  return globalRef.__pgSqlPromise__;
}

async function createSqliteSql(): Promise<Sql> {
  globalRef.__sqliteInstance__ ??= (async () => {
    const Database = (await import("better-sqlite3")).default;
    const db = new Database(join(process.cwd(), "parada.sqlite"));
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    const normalize = (value: unknown): unknown => {
      if (value === undefined) return null;
      if (typeof value === "boolean") return value ? 1 : 0;
      return value;
    };
    const run = async <T = Record<string, unknown>>(
      sqlText: string,
      params: unknown[] = [],
    ): Promise<T[]> => {
      const normalized = sqlText.replace(/\$\d+/g, "?").trim();
      const stmt = db.prepare(normalized);
      const normalizedParams = params.map(normalize);
      if (/^SELECT\b/i.test(normalized)) {
        return stmt.all(...normalizedParams) as T[];
      }
      const result = stmt.run(...normalizedParams);
      return [];
    };
    db.exec(
      "create table if not exists _migrations (name text primary key, applied_at text not null default (datetime('now')))",
    );
    const migrations = import.meta.glob("/migrations/*.sql", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const doneRows = await run<{ name: string }>("select name from _migrations");
    const done = doneRows.map((r) => r.name);
    for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) {
      const tx = db.transaction(() => {
        db.exec(migrations[path]);
        run("insert into _migrations (name) values (?)", [name]);
      });
      tx();
    }
    return toSql(run);
  })().catch((err) => {
    globalRef.__sqliteInstance__ = undefined;
    throw err;
  });
  return globalRef.__sqliteInstance__;
}

let sqlPromise: Promise<Sql> | null = null;

async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") {
    throw new Error(
      "@/lib/db is server-only — call getSql() from a createServerFn handler " +
        "or a server route loader, never from client code.",
    );
  }
  return dbSource === "neon" ? createNeonSql() : createSqliteSql();
}

export function getSql(): Promise<Sql> {
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null;
    throw err;
  });
  return sqlPromise;
}

export async function getPglite(): Promise<never> {
  throw new Error("PGLite is not available when using SQLite fallback");
}

export function ensureDbReady(): Promise<void> {
  return Promise.resolve();
}
