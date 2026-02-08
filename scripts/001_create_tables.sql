-- =============================================
-- CRM Restaurante - Database Schema
-- Tables: customers, calls, call_actions
-- =============================================

-- 1. CUSTOMERS TABLE
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  first_name text,
  last_name text,
  email text,
  eveve_uid text,
  total_calls integer default 0,
  total_reservations integer default 0,
  total_cancellations integer default 0,
  last_call_date timestamptz,
  last_reservation_date timestamptz,
  preferences jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.customers enable row level security;

-- Allow anonymous read access (dashboard reads via anon key)
create policy "customers_select_all" on public.customers
  for select using (true);

-- 2. CALLS TABLE
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  vapi_call_id text unique,
  customer_phone text,
  customer_name text,
  customer_uid text,
  call_type text check (call_type in ('inbound', 'outbound')),
  call_status text check (call_status in ('in-progress', 'completed', 'failed', 'no-answer')),
  start_time timestamptz,
  end_time timestamptz,
  duration_seconds integer,
  call_outcome text,
  assistant_name text,
  recording_url text,
  transcript text,
  summary text,
  created_at timestamptz default now()
);

alter table public.calls enable row level security;

create policy "calls_select_all" on public.calls
  for select using (true);

-- 3. CALL_ACTIONS TABLE
create table if not exists public.call_actions (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references public.calls(id) on delete cascade,
  action_type text check (action_type in ('check_availability', 'create_booking', 'cancel_booking', 'modify_booking')),
  action_timestamp timestamptz default now(),
  action_details jsonb,
  success boolean default false,
  error_message text,
  booking_uid text,
  created_at timestamptz default now()
);

alter table public.call_actions enable row level security;

create policy "call_actions_select_all" on public.call_actions
  for select using (true);

-- 4. INDEXES for performance
create index if not exists idx_calls_start_time on public.calls(start_time desc);
create index if not exists idx_calls_status on public.calls(call_status);
create index if not exists idx_calls_customer_phone on public.calls(customer_phone);
create index if not exists idx_call_actions_call_id on public.call_actions(call_id);
create index if not exists idx_customers_phone on public.customers(phone);
