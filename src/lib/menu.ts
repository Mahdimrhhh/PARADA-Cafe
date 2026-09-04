import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getSql } from "@/lib/db";
import type { CafeSettings, MenuCategory, MenuItem, MenuPayload } from "@/lib/types";

type CategoryRow = {
  id: number;
  slug: string;
  name_fa: string;
  name_en: string;
  sort_order: number;
  icon_key: string;
};

type ItemRow = {
  id: number;
  category_id: number;
  name_fa: string;
  name_en: string;
  description_fa: string;
  price_toman: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_new: boolean;
  sort_order: number;
};

function mapItem(row: ItemRow): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    nameFa: row.name_fa,
    nameEn: row.name_en,
    descriptionFa: row.description_fa,
    priceToman: row.price_toman,
    imageUrl: row.image_url,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    isNew: row.is_new,
    sortOrder: row.sort_order,
  };
}

function mapCategory(row: CategoryRow, items: MenuItem[]): MenuCategory {
  return {
    id: row.id,
    slug: row.slug,
    nameFa: row.name_fa,
    nameEn: row.name_en,
    sortOrder: row.sort_order,
    iconKey: row.icon_key,
    items,
  };
}

async function seedIfEmpty() {
  const sql = await getSql();
  const counts = await sql<{ c: number }>`select count(*)::int as c from categories`;
  if ((counts[0]?.c ?? 0) > 0) {
    await ensurePinHashed(sql);
    return;
  }
  const { seedMenu } = await import("./seed.server");
  await seedMenu(sql);
  await ensurePinHashed(sql);
}

async function ensurePinHashed(sql: Awaited<ReturnType<typeof getSql>>) {
  const rows = await sql<{ key: string; value: string }>`
    select key, value from cafe_settings where key = 'admin_pin' limit 1
  `;
  const row = rows[0];
  if (!row || row.value.startsWith("$2")) return;
  const next = await bcrypt.hash("parada", 12);
  await sql`
    update cafe_settings set value = ${next} where key = 'admin_pin'
  `;
}

async function readSettings(): Promise<CafeSettings> {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`
    select key, value from cafe_settings
    where key in ('cafe_name', 'tagline_fa', 'tagline_en')
  `;
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return {
    cafeName: map.cafe_name ?? "PARADA",
    taglineFa: map.tagline_fa ?? "توقفگاه",
    taglineEn: map.tagline_en ?? "a place to pause",
  };
}

async function readMenu(): Promise<MenuPayload> {
  await seedIfEmpty();
  const sql = await getSql();
  const categories = await sql<CategoryRow>`
    select id, slug, name_fa, name_en, sort_order, icon_key
    from categories
    order by sort_order asc, id asc
  `;
  const items = await sql<ItemRow>`
    select
      id, category_id, name_fa, name_en, description_fa,
      price_toman, image_url, is_available, is_featured, is_new, sort_order
    from items
    order by sort_order asc, id asc
  `;
  const byCategory = new Map<number, MenuItem[]>();
  for (const item of items) {
    const list = byCategory.get(item.category_id) ?? [];
    list.push(mapItem(item));
    byCategory.set(item.category_id, list);
  }
  const settings = await readSettings();
  return {
    settings,
    categories: categories.map((row) => mapCategory(row, byCategory.get(row.id) ?? [])),
  };
}

async function logActivity(
  sql: Awaited<ReturnType<typeof getSql>>,
  action: string,
  targetType: string,
  targetId?: number,
  targetLabel?: string,
  changes?: Record<string, unknown>,
) {
  await sql`
    insert into admin_activity_log (action, target_type, target_id, target_label, changes)
    values (${action}, ${targetType}, ${targetId ?? null}, ${targetLabel ?? null}, ${changes ? JSON.stringify(changes) : null})
  `;
}

async function clientIp(): Promise<string> {
  try {
    const req = getRequest();
    if (!req) return "unknown";
    return (
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

async function checkRateLimit(sql: Awaited<ReturnType<typeof getSql>>, key: string): Promise<boolean> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS);
  const rows = await sql<{ count: number; reset_at: string }>`
    select count, reset_at from admin_rate_limits where key = ${key}
  `;
  const row = rows[0];
  if (!row) {
    await sql`
      insert into admin_rate_limits (key, count, reset_at) values (${key}, 1, ${resetAt.toISOString()})
    `;
    return true;
  }
  const currentReset = new Date(row.reset_at);
  if (now > currentReset) {
    await sql`
      update admin_rate_limits set count = 1, reset_at = ${resetAt.toISOString()} where key = ${key}
    `;
    return true;
  }
  if (row.count >= RATE_LIMIT_MAX) {
    return false;
  }
  await sql`
    update admin_rate_limits set count = count + 1 where key = ${key}
  `;
  return true;
}

const itemInput = z.object({
  categoryId: z.number().int().positive(),
  nameFa: z.string().trim().min(1).max(80),
  nameEn: z.string().trim().max(80),
  descriptionFa: z.string().trim().max(400),
  priceToman: z.number().int().min(0).max(20_000_000),
  imageUrl: z.string().max(750_000).nullable(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  sortOrder: z.number().int().min(0).max(10_000),
});

const categoryInput = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9-]+$/),
  nameFa: z.string().trim().min(1).max(40),
  nameEn: z.string().trim().max(40),
  iconKey: z.string().trim().min(1).max(30),
  sortOrder: z.number().int().min(0).max(1000),
});

export type PinResult = { ok: true } | { ok: false; error: string };

export const getMenu = createServerFn({ method: "GET" }).handler(async () => {
  return readMenu();
});

export const verifyPin = createServerFn({ method: "POST" })
  .validator(z.object({ pin: z.string().min(1).max(40) }))
  .handler(async ({ data }): Promise<PinResult> => {
    const sql = await getSql();
    await seedIfEmpty();

    const ip = await clientIp();
    const key = `pin:${ip}`;
    const allowed = await checkRateLimit(sql, key);
    if (!allowed) {
      return { ok: false as const, error: "تعداد تلاش‌ها بیش از حد مجاز است. کمی صبر کنید." };
    }

    const rows = await sql<{ value: string }>`
      select value from cafe_settings where key = 'admin_pin' limit 1
    `;
    const expectedHash = rows[0]?.value ?? await bcrypt.hash("parada", 12);
    if (await bcrypt.compare(data.pin, expectedHash)) {
      return { ok: true as const };
    }
    return { ok: false as const, error: "کد ورود نادرست است." };
  });

export const updatePin = createServerFn({ method: "POST" })
  .validator(
    z.object({
      current: z.string().min(1).max(40),
      next: z.string().trim().min(4).max(40),
    }),
  )
  .handler(async ({ data }): Promise<MenuPayload | PinResult> => {
    const sql = await getSql();
    const rows = await sql<{ value: string }>`
      select value from cafe_settings where key = 'admin_pin' limit 1
    `;
    const expectedHash = rows[0]?.value ?? await bcrypt.hash("parada", 12);
    if (!(await bcrypt.compare(data.current, expectedHash))) {
      return { ok: false as const, error: "کد فعلی نادرست است." };
    }
    const nextHash = await bcrypt.hash(data.next, 12);
    await sql`
      insert into cafe_settings (key, value) values ('admin_pin', ${nextHash})
      on conflict (key) do update set value = excluded.value
    `;
    const db = await sql;
    await logActivity(db, "update_pin", "settings", undefined, "admin_pin", { current: "***", next: "***" });
    return readMenu();
  });

export const updateSettings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      cafeName: z.string().trim().min(1).max(40),
      taglineFa: z.string().trim().max(60),
      taglineEn: z.string().trim().max(80),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const pairs: Array<[string, string]> = [
      ["cafe_name", data.cafeName],
      ["tagline_fa", data.taglineFa],
      ["tagline_en", data.taglineEn],
    ];
    const db = await sql;
    for (const [key, value] of pairs) {
      await db`
        insert into cafe_settings (key, value) values (${key}, ${value})
        on conflict (key) do update set value = excluded.value
      `;
    }
    await logActivity(db, "update_settings", "settings", undefined, "cafe_settings", { cafeName: data.cafeName, taglineFa: data.taglineFa, taglineEn: data.taglineEn });
    return readMenu();
  });

export const createItem = createServerFn({ method: "POST" })
  .validator(itemInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const db = await sql;
    await db`
      insert into items (
        category_id, name_fa, name_en, description_fa, price_toman,
        image_url, is_available, is_featured, is_new, sort_order
      )
      values (
        ${data.categoryId}, ${data.nameFa}, ${data.nameEn}, ${data.descriptionFa},
        ${data.priceToman}, ${data.imageUrl}, ${data.isAvailable},
        ${data.isFeatured}, ${data.isNew}, ${data.sortOrder}
      )
    `;
    const row = await db<{ id: number }>`select id from items order by id desc limit 1`;
    await logActivity(db, "create_item", "item", row[0]?.id, data.nameFa, { categoryId: data.categoryId, priceToman: data.priceToman });
    return readMenu();
  });

export const updateItem = createServerFn({ method: "POST" })
  .validator(itemInput.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const db = await sql;
    await db`
      update items set
        category_id = ${data.categoryId},
        name_fa = ${data.nameFa},
        name_en = ${data.nameEn},
        description_fa = ${data.descriptionFa},
        price_toman = ${data.priceToman},
        image_url = ${data.imageUrl},
        is_available = ${data.isAvailable},
        is_featured = ${data.isFeatured},
        is_new = ${data.isNew},
        sort_order = ${data.sortOrder}
      where id = ${data.id}
    `;
    await logActivity(db, "update_item", "item", data.id, data.nameFa, { categoryId: data.categoryId, priceToman: data.priceToman });
    return readMenu();
  });

export const deleteItem = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const db = await sql;
    await db`delete from items where id = ${data.id}`;
    await logActivity(db, "delete_item", "item", data.id, undefined, { id: data.id });
    return readMenu();
  });

export const createCategory = createServerFn({ method: "POST" })
  .validator(categoryInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const db = await sql;
    await db`
      insert into categories (slug, name_fa, name_en, sort_order, icon_key)
      values (${data.slug}, ${data.nameFa}, ${data.nameEn}, ${data.sortOrder}, ${data.iconKey})
    `;
    const row = await db<{ id: number }>`select id from categories order by id desc limit 1`;
    await logActivity(db, "create_category", "category", row[0]?.id, data.nameFa, { slug: data.slug });
    return readMenu();
  });

export const updateCategory = createServerFn({ method: "POST" })
  .validator(categoryInput.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const db = await sql;
    await db`
      update categories set
        slug = ${data.slug},
        name_fa = ${data.nameFa},
        name_en = ${data.nameEn},
        sort_order = ${data.sortOrder},
        icon_key = ${data.iconKey}
      where id = ${data.id}
    `;
    await logActivity(db, "update_category", "category", data.id, data.nameFa, { slug: data.slug });
    return readMenu();
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const counts = await sql<{ c: number }>`
      select count(*)::int as c from items where category_id = ${data.id}
    `;
    if ((counts[0]?.c ?? 0) > 0) {
      return { ok: false as const, error: "ابتدا آیتم‌های این دسته را حذف یا جابه‌جا کنید." };
    }
    const db = await sql;
    await db`delete from categories where id = ${data.id}`;
    await logActivity(db, "delete_category", "category", data.id, undefined, { id: data.id });
    return { ok: true as const, menu: await readMenu() };
  });

export const getActivityLog = createServerFn({ method: "GET" })
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      action: string;
      target_type: string;
      target_id: number | null;
      target_label: string | null;
      changes: string | null;
      created_at: string;
    }>`
      select id, action, target_type, target_id, target_label, changes, created_at
      from admin_activity_log
      order by created_at desc
      limit 200
    `;
    return rows.map((row) => ({
      ...row,
      changes: row.changes ? JSON.parse(row.changes) : null,
    }));
  });