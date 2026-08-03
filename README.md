# Oração Diária — Landing Page de waitlist

Página estática (HTML + CSS, sem build) que captura e-mails no Supabase.
O disparo das campanhas sai por um script Python usando o Resend.

- `index.html` / `styles.css` — a página
- `DESIGN.md` — o sistema visual (leia antes de mexer no layout)
- `COPY-RESEARCH.md` — research de conversão que embasa a copy
- `supabase/waitlist.sql` — tabela + RLS
- `waitlist.js` / `config.js` — captura no client
- `scripts/send_campaign.py` — disparo em massa

## 1. Banco (uma vez)

No painel do Supabase → SQL Editor, rode `supabase/waitlist.sql`.
Ele cria a tabela e liga o RLS: **anônimo só insere**, nunca lê. Isso importa —
a anon key fica visível no navegador, e sem essa política qualquer visitante
baixaria a lista inteira de e-mails.

## 2. Página (uma vez)

Em `config.js`, cole a **anon key** (Settings → API). Ela é pública por
natureza; quem protege é o RLS.

Rodar local:

```bash
python3 -m http.server 4321
```

## 3. Enviar uma campanha

Variáveis de ambiente (nunca commitadas):

```bash
export SUPABASE_URL="https://zopgzckurfpvzwzbwudi.supabase.co"
export SUPABASE_SERVICE_KEY="..."   # service_role, só no seu terminal
export RESEND_API_KEY="re_..."
export MAIL_FROM="Oração Diária <ola@seudominio.com>"
```

Sempre nesta ordem:

```bash
python3 scripts/send_campaign.py --assunto "Assunto" --html campanha.html --teste voce@email.com
```

```bash
python3 scripts/send_campaign.py --assunto "Assunto" --html campanha.html
```

O segundo comando roda em **modo seco**: conta os destinatários e para.
Para enviar de verdade, acrescente `--confirmar`.

## Antes do primeiro envio real

- **Verifique seu domínio no Resend** (SPF + DKIM). Sem isso, Gmail e Outlook
  mandam pra spam ou recusam.
- **Inclua link de descadastro** no HTML da campanha. É exigência da LGPD e
  dos provedores. A coluna `unsubscribed_at` já existe e o script respeita.
