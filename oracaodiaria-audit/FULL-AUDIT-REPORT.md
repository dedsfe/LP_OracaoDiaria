# Auditoria SEO — oracaodiaria.space

**Data:** 20/08/2026
**Ferramenta:** claude-seo v2.2.4 (runtime local)
**Escopo:** https://www.oracaodiaria.space/ (site de 1 página + /termos + /privacidade)
**SEO Health Score: 38/100**

> Atenção: a produção está servindo uma versão **anterior** da landing (os H2/H3 capturados
> não batem com o `index.html` local). O deploy pendente não muda o diagnóstico técnico.

---

## Resumo executivo

| Categoria | Peso | Score | Situação |
|---|---|---|---|
| Technical SEO | 22% | 35 | Sem robots.txt, sem sitemap, sem canonical |
| Content Quality | 23% | 40 | 461 palavras no site inteiro, densidade 0.18 |
| On-Page SEO | 20% | 55 | Title/description bons, zero links internos |
| Schema | 10% | 0 | Nenhum JSON-LD na página |
| Performance | 10% | 60 (estimado) | PSI sem API key; assets pesados no repo |
| AI Search (GEO) | 10% | 25 | Sem llms.txt, sem FAQPage, sem entidade definida |
| Imagens | 5% | 40 | 2 de 3 imagens sem alt, sem lazy, PNG pesado |

**Os 5 problemas críticos**

1. **Sem `robots.txt`** (404) — nada orienta o rastreamento, e o IndexNow/Bing fica cego.
2. **Sem `sitemap.xml`** (404) — com páginas novas chegando, é o que acelera indexação.
3. **Sem `<link rel="canonical">`** — o site responde em `oracaodiaria.space` **e** `www.oracaodiaria.space`; hoje são duas URLs equivalentes sem canonical declarada.
4. **Zero structured data** — nenhuma chance de rich result; o FAQ da página é o alvo óbvio (FAQPage).
5. **Zero Open Graph / Twitter Card** — todo compartilhamento em WhatsApp/Instagram sai sem imagem e sem título controlado. Para um produto que **depende de convite por WhatsApp**, isso é perda direta.

**Os 5 ganhos rápidos** (todos < 1 hora)

1. `robots.txt` + `sitemap.xml` estáticos.
2. `og:title`, `og:description`, `og:image` (1200×630) e `twitter:card`.
3. `<link rel="canonical">` apontando para a versão com `www`.
4. JSON-LD: `SoftwareApplication` (o app) + `FAQPage` (as 5 perguntas) + `Organization`.
5. `alt` nas imagens do rodapé/statement e `loading="lazy"` nos vídeos abaixo da dobra.

---

## Technical SEO — 35/100

| Item | Resultado |
|---|---|
| `robots.txt` | **404** |
| `sitemap.xml` | **404** |
| `llms.txt` | **404** |
| `site.webmanifest` | 404 |
| HTTPS | OK (HTTP/2, Vercel) |
| HSTS | OK (`max-age=63072000`) |
| `X-Content-Type-Options` | Ausente |
| `X-Frame-Options` / CSP | Ausente |
| `cache-control` | `public, max-age=0, must-revalidate` — sem cache para assets estáticos |
| Canonical | Ausente |
| `meta robots` | Ausente (default `index,follow`, aceitável) |
| Redirect apex → www | Ativo (301) |

O `cache-control` sem `max-age` para vídeos e imagens é desperdício de banda: os três MP4s
(~700 KB cada) são rebaixados toda visita.

## Content Quality — 40/100

- **461 palavras** no site inteiro. Uma página de conversão sozinha não sustenta busca orgânica.
- Densidade informacional 0.18 (flag `low-density` do analisador) — muito espaço, pouco texto indexável.
- Sem página "sobre", sem autor, sem data: **E-E-A-T próximo de zero** para um tema YMYL-adjacente (fé/bem-estar).
- Nenhuma página responde a uma busca real ("oração da manhã", "como criar o hábito de orar"). O site só responde a quem **já conhece a marca**.

## On-Page SEO — 55/100

| Elemento | Valor | Avaliação |
|---|---|---|
| `<title>` | "Oração Diária — comece o dia com Deus" (37 car.) | Bom tamanho, **sem keyword de busca** |
| `meta description` | 118 car. | Boa, poderia usar "bloquear apps" |
| H1 | "Seu celular só abre depois da oração." | Único e claro |
| H2 | 5 | Hierarquia correta |
| Links internos | **0** | Nenhum caminho de navegação para o Google seguir |
| Links externos | 0 | Nenhuma citação de fonte (o dado "3h32" não linka a fonte) |

## Schema — 0/100

Nenhum bloco `application/ld+json`. Oportunidades imediatas, em ordem de valor:

1. `SoftwareApplication` — nome, plataforma iOS, preço, categoria. É o que qualifica o site como "app".
2. `FAQPage` — as 5 perguntas já existem em `<dl>`, é só marcar.
3. `Organization` + `WebSite` — entidade da marca, base para Knowledge Panel.

## Performance — 60/100 (estimado)

PSI recusou a medição (rate limit da API pública sem key). Sinais do repositório:

- `app-screen.png` 1.3 MB e `modal-bg.jpg` 962 KB versionados e servidos sem `srcset`.
- 3 vídeos MP4 na seção "como funciona" (~700 KB cada) — já com `preload="none"` e play condicionado ao viewport, o que é o comportamento correto.
- Nenhuma imagem em WebP/AVIF.

## AI Search / GEO — 25/100

- Sem `llms.txt`.
- Sem schema, então nenhum fato da página é extraível de forma estruturada.
- O conteúdo é persuasivo, não citável: não há bloco de resposta objetiva que um LLM possa citar
  (ex.: "quanto tempo o brasileiro passa em redes sociais" — o dado está lá, mas sem fonte e sem marcação).

## Imagens — 40/100

- 3 `<img>` na home: 1 com alt descritivo, 2 com `alt=""`.
- Nenhuma com `loading="lazy"`.
- Nenhuma imagem OG existe no site (perda direta no compartilhamento por WhatsApp).

---

## O que já está bom

- HTML semântico e limpo (`<main>`, `<section>`, `<dl>`, headings em ordem).
- `lang="pt-BR"` correto.
- Title e meta description escritos por humano, sem keyword stuffing.
- Mobile-first real (viewport correto, layout responsivo).
- Vídeos com carregamento sob demanda.
- HTTPS + HSTS + HTTP/2 via Vercel.
