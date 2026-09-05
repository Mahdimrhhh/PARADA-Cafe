-- Admin PIN brute-force protection: per-IP rate limit table.
create table if not exists admin_rate_limits (
  key text primary key,
  count integer not null default 1,
  reset_at text not null default (datetime('now', '+5 minutes'))
);

create index if not exists admin_rate_limits_reset_at_idx
  on admin_rate_limits (reset_at desc);

-- Cleanup expired entries periodically.
create table if not exists admin_rate_limits_cleanup_trigger (
  id integer primary key check (id = 1)
);

create trigger if not exists trigger_cleanup_admin_rate_limits
  after insert on admin_rate_limits_cleanup_trigger
  begin
    delete from admin_rate_limits where reset_at < datetime('now');
  end;

insert into admin_rate_limits_cleanup_trigger (id) values (1)
  on conflict (id) do nothing;
