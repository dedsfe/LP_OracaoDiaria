// E-mail de boas-vindas, disparado quando alguém entra na waitlist.
//
// Roda como Edge Function porque a chave do Resend não pode existir no
// navegador — a página é estática e qualquer visitante leria a chave.
// O gatilho é um Database Webhook de INSERT em public.waitlist.
//
// Deploy:
//   supabase functions deploy welcome-email --no-verify-jwt
//   supabase secrets set RESEND_API_KEY=re_... MAIL_FROM="..." WEBHOOK_SECRET=...

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const MAIL_FROM = Deno.env.get("MAIL_FROM") ?? "Oração Diária <contato@oracaodiaria.space>";
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");

const html = (email: string) => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            max-width:480px;margin:0 auto;padding:40px 24px;color:#1d1d1f">
  <p style="font-size:40px;line-height:1;margin:0 0 24px">🙏</p>

  <h1 style="font-size:28px;line-height:1.2;letter-spacing:-0.02em;margin:0 0 16px">
    Sua vaga está garantida.
  </h1>

  <p style="font-size:17px;line-height:1.5;color:#6e6e73;margin:0 0 16px">
    Você entrou na lista do Oração Diária — o app que bloqueia seus apps pela
    manhã até você fazer sua oração.
  </p>

  <p style="font-size:17px;line-height:1.5;color:#6e6e73;margin:0 0 32px">
    Te aviso assim que ele sair na App Store. Um e-mail só, sem enrolação.
  </p>

  <p style="font-size:17px;line-height:1.5;margin:0 0 32px">
    Enquanto isso: quem você chamaria pra começar o dia junto com você?
    Encaminha esse e-mail pra essa pessoa.
  </p>

  <hr style="border:none;border-top:1px solid #d2d2d7;margin:0 0 16px">

  <p style="font-size:12px;line-height:1.4;color:#6e6e73;margin:0">
    Você recebeu isso porque se cadastrou com ${email}.
    <a href="https://oracaodiaria.space/descadastro?email=${encodeURIComponent(email)}"
       style="color:#6e6e73">Sair da lista</a>.
  </p>
</div>`;

Deno.serve(async (req) => {
  // Sem isso, qualquer um dispara e-mails pela sua conta do Resend.
  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("não autorizado", { status: 401 });
  }

  try {
    const payload = await req.json();
    const email = payload?.record?.email;

    if (!email) {
      return new Response("payload sem email", { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [email],
        subject: "Sua vaga está garantida 🙏",
        html: html(email),
      }),
    });

    if (!res.ok) {
      // Logar o corpo importa: o Resend explica por que recusou (domínio não
      // verificado, remetente inválido) e isso não aparece no status sozinho.
      const detalhe = await res.text();
      console.error("Resend recusou:", res.status, detalhe);
      return new Response(detalhe, { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (erro) {
    console.error(erro);
    return new Response("erro interno", { status: 500 });
  }
});
