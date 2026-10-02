-- Execute este arquivo no SQL Editor do seu projeto Supabase.
-- O frontend nunca recebe a service role key; somente as rotas server-side usam essa chave.

create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  reservation_date date not null,
  reservation_time time not null,
  guests integer not null check (guests between 1 and 8),
  amount_cents integer not null check (amount_cents > 0),
  slot_capacity integer not null default 30 check (slot_capacity > 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'failed', 'cancelled', 'expired', 'refunded')),
  hold_expires_at timestamptz not null,
  mercado_pago_order_id text unique,
  mercado_pago_checkout_url text,
  mercado_pago_status text,
  mercado_pago_status_detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_slot_idx
  on public.reservations (reservation_date, reservation_time);

create index if not exists reservations_status_idx
  on public.reservations (status, hold_expires_at);

alter table public.reservations enable row level security;

-- Nenhuma policy pública é criada de propósito.
-- O backend usa SUPABASE_SERVICE_ROLE_KEY e o navegador não acessa a tabela diretamente.

create or replace function public.set_reservations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservations_updated_at on public.reservations;
create trigger reservations_updated_at
before update on public.reservations
for each row execute function public.set_reservations_updated_at();

create or replace function public.enforce_reservation_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  used_guests integer;
  lock_key bigint;
begin
  if new.status not in ('pending', 'processing', 'paid') then
    return new;
  end if;

  lock_key := hashtextextended(
    new.reservation_date::text || '|' || new.reservation_time::text,
    0
  );
  perform pg_advisory_xact_lock(lock_key);

  select coalesce(sum(r.guests), 0)
    into used_guests
  from public.reservations r
  where r.reservation_date = new.reservation_date
    and r.reservation_time = new.reservation_time
    and r.id <> new.id
    and (
      r.status = 'paid'
      or (
        r.status in ('pending', 'processing')
        and r.hold_expires_at > now()
      )
    );

  if used_guests + new.guests > new.slot_capacity then
    raise exception 'slot_capacity_exceeded'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists reservations_capacity_guard on public.reservations;
create trigger reservations_capacity_guard
before insert or update of reservation_date, reservation_time, guests, status
on public.reservations
for each row execute function public.enforce_reservation_capacity();
