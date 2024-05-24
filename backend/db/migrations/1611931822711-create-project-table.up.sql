create table counter (
  id uuid primary key default uuid_generate_v4(),
  value bigint default 0,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create trigger counter_moddatetime
  before update on counter
  for each row
  execute procedure moddatetime (updated_at);
