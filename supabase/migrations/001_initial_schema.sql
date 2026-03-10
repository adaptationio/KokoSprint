-- Training Sessions
create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  week_number int not null check (week_number between 1 and 3),
  session_type text not null check (session_type in ('home', 'oval')),
  completed boolean default false,
  session_rating text check (session_rating in ('easy', 'good', 'tough', 'crushed_it')),
  notes text,
  created_at timestamptz default now(),
  unique(session_date)
);

-- Exercise Logs
create table if not exists exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  exercise_id text not null,
  completed boolean default false,
  created_at timestamptz default now(),
  unique(session_date, exercise_id)
);

-- Progress Logs
create table if not exists progress_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null,
  metric_type text not null check (metric_type in ('30m_time', '60m_time', 'broad_jump', 'plank_hold')),
  value numeric not null,
  is_pb boolean default false,
  created_at timestamptz default now()
);

-- Achievements
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id text not null unique,
  unlocked_at timestamptz default now()
);

-- Enable RLS
alter table training_sessions enable row level security;
alter table exercise_logs enable row level security;
alter table progress_logs enable row level security;
alter table achievements enable row level security;

-- RLS Policies: allow anon SELECT, INSERT, UPDATE (no DELETE)
create policy "anon_select" on training_sessions for select using (true);
create policy "anon_insert" on training_sessions for insert with check (true);
create policy "anon_update" on training_sessions for update using (true);

create policy "anon_select" on exercise_logs for select using (true);
create policy "anon_insert" on exercise_logs for insert with check (true);
create policy "anon_update" on exercise_logs for update using (true);

create policy "anon_select" on progress_logs for select using (true);
create policy "anon_insert" on progress_logs for insert with check (true);
create policy "anon_update" on progress_logs for update using (true);

create policy "anon_select" on achievements for select using (true);
create policy "anon_insert" on achievements for insert with check (true);

-- Trigger: auto-detect PB on progress_logs insert
create or replace function check_pb()
returns trigger as $$
declare
  current_best numeric;
  is_lower_better boolean;
begin
  is_lower_better := NEW.metric_type in ('30m_time', '60m_time');

  select case
    when is_lower_better then min(value)
    else max(value)
  end into current_best
  from progress_logs
  where metric_type = NEW.metric_type
    and id != NEW.id;

  if current_best is null then
    NEW.is_pb := true;
  elsif is_lower_better and NEW.value < current_best then
    NEW.is_pb := true;
  elsif not is_lower_better and NEW.value > current_best then
    NEW.is_pb := true;
  else
    NEW.is_pb := false;
  end if;

  return NEW;
end;
$$ language plpgsql;

create trigger set_pb_flag
  before insert on progress_logs
  for each row
  execute function check_pb();
