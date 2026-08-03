#!/usr/bin/env python3
"""Dispara um e-mail para a waitlist do Oração Diária.

Lê a lista no Supabase (service_role) e envia pelo Resend, que cuida de
SPF/DKIM e reputação — o Python só orquestra.

Uso:
    python3 scripts/send_campaign.py --assunto "O app saiu" \
        --html campanhas/lancamento.html --teste voce@email.com
    python3 scripts/send_campaign.py --assunto "O app saiu" \
        --html campanhas/lancamento.html --confirmar

Sem --confirmar, roda em modo seco: mostra quantos receberiam e para.
"""

import argparse
import os
import sys
import time
from urllib import error, parse, request

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
FROM = os.environ.get("MAIL_FROM", "Oração Diária <ola@oracaodiaria.app>")

# O Resend aceita até 100 destinatários por chamada em lote.
LOTE = 100
# Pausa entre lotes: mantém folga no limite de 2 req/s do plano free.
PAUSA = 1.0


def _json(req: request.Request):
    with request.urlopen(req, timeout=30) as res:
        import json

        body = res.read().decode()
        return json.loads(body) if body else {}


def buscar_emails() -> list[str]:
    """Todo mundo que entrou na lista e não pediu descadastro."""
    query = parse.urlencode(
        {"select": "email", "unsubscribed_at": "is.null", "order": "created_at.asc"}
    )
    req = request.Request(
        f"{SUPABASE_URL}/rest/v1/waitlist?{query}",
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        },
    )
    return [linha["email"] for linha in _json(req)]


def enviar(destinatarios: list[str], assunto: str, html: str) -> None:
    """Um e-mail por destinatário, em lote — ninguém vê a lista dos outros."""
    import json

    payload = [
        {"from": FROM, "to": [email], "subject": assunto, "html": html}
        for email in destinatarios
    ]
    req = request.Request(
        "https://api.resend.com/emails/batch",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    _json(req)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--assunto", required=True)
    p.add_argument("--html", required=True, help="arquivo HTML do e-mail")
    p.add_argument("--teste", help="envia só pra este endereço e sai")
    p.add_argument("--confirmar", action="store_true", help="envia de verdade")
    args = p.parse_args()

    faltando = [
        nome
        for nome, valor in [
            ("SUPABASE_URL", SUPABASE_URL),
            ("SUPABASE_SERVICE_KEY", SUPABASE_SERVICE_KEY),
            ("RESEND_API_KEY", RESEND_API_KEY),
        ]
        if not valor
    ]
    if faltando:
        print(f"Faltam variáveis de ambiente: {', '.join(faltando)}", file=sys.stderr)
        return 1

    with open(args.html, encoding="utf-8") as f:
        html = f.read()

    if args.teste:
        enviar([args.teste], args.assunto, html)
        print(f"Teste enviado para {args.teste}.")
        return 0

    try:
        emails = buscar_emails()
    except error.HTTPError as e:
        print(f"Erro lendo a waitlist: {e.code} {e.read().decode()}", file=sys.stderr)
        return 1

    print(f"{len(emails)} destinatários na lista.")
    if not args.confirmar:
        print("Modo seco. Nada foi enviado — rode com --confirmar para valer.")
        return 0

    enviados = 0
    for i in range(0, len(emails), LOTE):
        lote = emails[i : i + LOTE]
        try:
            enviar(lote, args.assunto, html)
            enviados += len(lote)
            print(f"  {enviados}/{len(emails)}")
        except error.HTTPError as e:
            print(f"Lote {i // LOTE + 1} falhou: {e.code} {e.read().decode()}", file=sys.stderr)
        time.sleep(PAUSA)

    print(f"Pronto: {enviados} e-mails enviados.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
