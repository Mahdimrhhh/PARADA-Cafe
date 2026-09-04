-- Admin PIN brute-force protection: per-IP rate limit table.
create table if not exists admin_rate_limits (
  key text primary key,
  count integer not null default 1,
  reset_at timestamptz not null default now() + interval '5 minutes'
);

create index if not exists admin_rate_limits_reset_at_idx
  on admin_rate_limits (reset_at desc);

-- Cleanup expired entries periodically.
create or replace function cleanup_admin_rate_limits()
returns trigger
language plpgsql
as $$
begin
  delete from admin_rate_limits where reset_at < now();
  return null;
end;
$$;

-- Run cleanup via a lightweight trigger on a dummy table.
create table if not exists admin_rate_limits_cleanup_trigger (
  id integer primary key check (id = 1)
);

create or replace trigger trigger_cleanup_admin_rate_limits
  after insert on admin_rate_limits_cleanup_trigger
  execute procedure cleanup_admin_rate_limits();

insert into admin_rate_limits_cleanup_trigger (id) values (1)
  on conflict (id) do nothing;