-- Activity log for admin actions (audit trail).
create table if not exists admin_activity_log (
  id integer primary key autoincrement,
  action text not null,
  target_type text not null,
  target_id integer,
  target_label text,
  changes text,
  created_at text not null default (datetime('now'))
);

create index if not exists admin_activity_log_created_at_idx
  on admin_activity_log (created_at desc);
