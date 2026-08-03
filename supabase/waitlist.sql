-- Waitlist da LP do Oração Diária.
-- Rode isto no SQL Editor do projeto Supabase (zopg).

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text default 'lp',
  user_agent  text,
  created_at  timestamptz not null default now(),
  unsubscribed_at timestamptz,
  constraint waitlist_email_unique unique (email),
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

alter table public.waitlist enable row level security;

-- A página é estática e usa a anon key (que é pública por natureza).
-- Por isso: anônimo SÓ insere. Não lê, não atualiza, não apaga —
-- senão qualquer visitante baixaria a lista inteira de e-mails.
drop policy if exists "anon pode entrar na lista" on public.waitlist;
create policy "anon pode entrar na lista"
  on public.waitlist for insert
  to anon
  with check (true);

-- Leitura e disparo só com a service_role key (usada pelo script, no servidor).

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);
