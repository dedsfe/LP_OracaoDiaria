# Plano de ação SEO — oracaodiaria.space

Ordenado por impacto ÷ esforço. Cada item tem o arquivo onde mexer.

## Fase 1 — Base técnica (crítico, ~2h no total)

| # | Ação | Arquivo | Esforço |
|---|---|---|---|
| 1 | `robots.txt` com `Sitemap:` e allow geral | novo `robots.txt` | 5 min |
| 2 | `sitemap.xml` (home, termos, privacidade) | novo `sitemap.xml` | 10 min |
| 3 | `<link rel="canonical" href="https://www.oracaodiaria.space/">` | `index.html` | 2 min |
| 4 | Open Graph + Twitter Card + imagem 1200×630 | `index.html` + novo `og.png` | 40 min |
| 5 | JSON-LD `SoftwareApplication` + `Organization` + `WebSite` | `index.html` | 25 min |
| 6 | JSON-LD `FAQPage` com as 5 perguntas do chat | `index.html` | 15 min |
| 7 | `alt` nas 2 imagens sem alt + `loading="lazy"` | `index.html` | 5 min |
| 8 | Cache longo para `/videos/*`, `/icons/*`, `*.png` | novo `vercel.json` | 15 min |

## Fase 2 — Preparar o terreno para as páginas (semana 1)

| # | Ação | Por quê |
|---|---|---|
| 9 | Decidir a estrutura de URL (`/oracoes/<slug>`) | Define tudo que vem depois |
| 10 | Criar o hub `/oracoes` (página pilar) | Recebe link de todas as spokes |
| 11 | Template de página SEO com a identidade da LP | Sem template, cada página vira retrabalho |
| 12 | Bloco de CTA reutilizável (waitlist + app) | O objetivo de toda página é esse |
| 13 | `llms.txt` | Ser citável por ChatGPT/Perplexity |

## Fase 3 — Conteúdo (mês 1–2)

| # | Ação |
|---|---|
| 14 | Pesquisa de palavras-chave (bloco 2 do plano combinado) |
| 15 | 20–30 páginas spoke, priorizadas por volume × intenção |
| 16 | Links internos: toda spoke → hub → app |
| 17 | Página "Sobre" com autor real (E-E-A-T) |

## Fase 4 — Monitoramento (contínuo)

| # | Ação |
|---|---|
| 18 | Google Search Console + envio do sitemap |
| 19 | API key do PageSpeed para medir CWV de verdade |
| 20 | `seo-drift` baseline após o deploy da Fase 1 |

---

## Bloqueio atual

A produção está com uma **versão antiga** da landing. Nada da Fase 1 aparece no Google
enquanto o deploy não sair.
