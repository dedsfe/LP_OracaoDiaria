# Prompt — criar as 7 páginas faltantes do hub /oracoes

> Copie tudo abaixo da linha e cole como prompt inicial do agente/pessoa que vai executar.

---

## Tarefa

No projeto em `/Users/andrefelipe/Programação/Lading Page - Oração Diária` (site estático em HTML puro, deploy na Vercel, domínio `https://www.oracaodiaria.space`), o hub `/oracoes/index.html` linka para **7 páginas que não existem**. Todas retornam 404 hoje. Sua tarefa é criar as 7 páginas, com conteúdo real e SEO completo.

**Não altere** o hub `/oracoes/index.html`, a home `index.html`, o CSS ou o JS. Os links já estão corretos — o que falta são os arquivos.

## As 7 páginas

Crie cada uma como `oracoes/<slug>/index.html`. Os títulos e ângulos abaixo vieram dos cards do hub — respeite-os, porque o card e a página precisam bater.

| Slug | H1 / foco | Categoria (badge) | Keyword principal |
|---|---|---|---|
| `oracao-da-noite` | Oração da Noite: Oração para Dormir em Paz | Descanso & Sono | oração da noite |
| `oracao-da-madrugada` | Oração da Madrugada: Como Buscar a Deus no Silêncio | Intimidade & Silêncio | oração da madrugada |
| `oracao-de-gratidao` | Oração de Gratidão: Reconhecendo as Bênçãos | Gratidão Diária | oração de gratidão |
| `oracao-para-cura-e-saude` | Oração para Cura e Saúde: Restauração Física e Espiritual | Saúde & Cura | oração para cura |
| `salmo-23` | Salmo 23: O Senhor é Meu Pastor e Nada Me Faltará | Provisão & Confiança | salmo 23 |
| `oracao-do-pai-nosso` | Oração do Pai Nosso: Como Orar como Jesus Ensinou | A Oração Modelo | pai nosso |
| `jejum-de-redes-sociais` | Jejum de Redes Sociais: Limpando a Mente para Deus | Desintoxicação Digital | jejum de redes sociais |

## Como fazer

**Use `oracoes/oracao-para-ansiedade/index.html` como template.** Copie a estrutura inteira e troque o conteúdo. A ordem dos blocos é: `site-nav` → `breadcrumbs` → `article-header` → `scripture-box` → `prayer-card` → `article-content` (com `app-bridge-card` no meio) → `related-spokes` → `site-footer` → scripts.

Não invente classes CSS novas — só existe o que está em `oracoes/oracoes.css`. Se um bloco não tem classe pronta, reuse uma existente.

### SEO obrigatório em cada página

- `<title>` de 50–70 caracteres terminando em `— Oração Diária`
- `<meta name="description">` de 140–160 caracteres, com a keyword principal e um verbo de ação
- `<link rel="canonical">` absoluto para `https://www.oracaodiaria.space/oracoes/<slug>`
- Open Graph completo (`og:type=article`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` = `https://www.oracaodiaria.space/og.jpg`, `og:locale=pt_BR`)
- Twitter Card (`summary_large_image`) com title/description/image
- JSON-LD com `@graph` contendo **Article** (headline, description, author = Organization "Equipe Oração Diária", publisher com logo, `datePublished`/`dateModified` = data de hoje em ISO, `mainEntityOfPage`, `inLanguage: pt-BR`) e **BreadcrumbList** de 3 níveis (Início → Orações → página)
- Breadcrumbs em HTML visível, batendo com o JSON-LD
- **Não** adicione schema `FAQPage` — foi removido de propósito num commit anterior
- Um único `<h1>`, hierarquia `h2`/`h3` sem pular nível

### Conteúdo

- **Mínimo 1.200 palavras** de texto real por página. As 4 páginas existentes têm 450–700 e são rasas demais para ranquear — não repita esse erro.
- Uma oração completa e original dentro do `prayer-card` (o botão "Copiar Oração" já funciona via `id="prayer-text"` — mantenha o id).
- Um `blockquote.scripture-box` com um versículo âncora + referência.
- Pelo menos 3 versículos citados no corpo, com referência bíblica correta (use João Ferreira de Almeida / ARC).
- `salmo-23`: inclua o **texto bíblico completo** dos 6 versículos e depois a meditação versículo por versículo.
- `oracao-do-pai-nosso`: inclua o texto de Mateus 6:9-13 e destrinche cada petição.
- Faça a ponte com o app em pelo menos uma seção — o gancho do produto é: bloquear os apps de manhã até a pessoa orar, sem depender de força de vontade.
- `related-spokes` com 3 links para páginas que **realmente existem** ou que você está criando neste lote.

### Regras de escrita (importante)

- Português do Brasil, tom evangélico.
- **Use "orar", "oração", "louvor", "buscar a Deus". NUNCA use "rezar", "reza", "terço", "Ave Maria" ou vocabulário católico.** O público é evangélico e essa troca de palavra queima a página.
- Nada de "Estudos comprovam..." sem fonte. Se citar dado, cite a fonte ou reescreva como observação.
- Escreva para quem está com o problema agora (não consegue dormir, está doente, está viciado no feed), não para quem está estudando teologia.

## Também atualize

`sitemap.xml`: adicione as 7 novas URLs no mesmo padrão das existentes (`changefreq: monthly`, `priority: 0.8`, `lastmod` de hoje).

## Critério de aceite

1. Os 7 arquivos existem e abrem sem erro no navegador.
2. `grep -o 'href="/oracoes/[^"]*"' oracoes/index.html` — todo destino tem um `index.html` correspondente no disco.
3. Cada página passa no [Rich Results Test](https://search.google.com/test/rich-results) para Article e Breadcrumb.
4. Nenhuma página tem menos de 1.200 palavras.
5. `grep -riE "rezar|reza |terço|ave maria" oracoes/` não retorna nada.
6. Depois do deploy, todas as 7 URLs retornam HTTP 200.

Não faça commit nem push — deixe as mudanças no working tree para revisão.
