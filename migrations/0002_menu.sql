-- PARADA cafe menu. Unowned rows (auth off): world-readable/writable via server fns.
create table if not exists categories (
  id integer primary key autoincrement,
  slug text not null unique,
  name_fa text not null,
  name_en text not null,
  sort_order integer not null default 0,
  icon_key text not null default 'cup'
);

create table if not exists items (
  id integer primary key autoincrement,
  category_id integer not null references categories(id) on delete restrict,
  name_fa text not null,
  name_en text not null,
  description_fa text not null default '',
  price_toman integer not null,
  image_url text,
  is_available integer not null default 1,
  is_featured integer not null default 0,
  is_new integer not null default 0,
  sort_order integer not null default 0
);

create index if not exists items_category_id_idx on items (category_id);
create index if not exists items_sort_idx on items (category_id, sort_order, id);

create table if not exists cafe_settings (
  key text primary key,
  value text not null
);

insert into cafe_settings (key, value) values
  ('admin_pin', 'parada'),
  ('cafe_name', 'PARADA'),
  ('tagline_fa', 'توقفگاه'),
  ('tagline_en', 'a place to pause')
on conflict (key) do nothing;
