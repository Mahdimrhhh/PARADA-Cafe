-- Activity log for admin actions (audit trail).
create table if not exists admin_activity_log (
  id serial primary key,
  action text not null,
  target_type text not null,
  target_id integer,
  target_label text,
  changes jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_log_created_at_idx
  on admin_activity_log (created_at desc);