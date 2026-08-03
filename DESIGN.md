# DESIGN.md — Landing Page Oração Diária

Sistema visual da LP de waitlist. **Regra de ouro: quando estiver em dúvida, tire algo.**
Inspiração: apple.com — fundo branco, respiro absurdo, pouca variação, tipografia grande e calma.

---

## 1. Princípios (não negociáveis)

1. **Fundo branco puro.** `#FFFFFF` em tudo. Sem gradiente, sem seção colorida, sem dark mode.
2. **Só 3 cores de texto.** Preto, cinza, cinza claro. Nada mais.
3. **Uma cor de destaque só**, e só em botão. Nunca em texto corrido.
4. **Emoji nativo da Apple é a única ilustração.** Zero ícones SVG, zero ilustrações, zero fotos, zero logos de terceiros.
5. **Raio fixo.** Um valor de raio para tudo que tem canto. Não existe "esse card é mais quadrado".
6. **Escala de fonte fechada.** 6 tamanhos. Se precisar de um sétimo, você errou a hierarquia.
7. **Espaço branco é conteúdo.** Se a seção parece vazia, está certa.
8. **Sem sombra.** Separação é feita com espaço, não com elevação. (Exceção única: botão flutuante mobile.)

---

## 2. Cor

```css
--white:      #FFFFFF;  /* fundo, sempre */
--ink:        #1D1D1F;  /* títulos e texto forte (preto Apple, não #000) */
--gray:       #6E6E73;  /* texto de apoio, subtítulos, parágrafos secundários */
--gray-light: #D2D2D7;  /* bordas, divisores, placeholder */
--gray-bg:    #F5F5F7;  /* fundo de input e de card — o ÚNICO cinza de fundo */
--accent:     #1D1D1F;  /* botão primário = preto. Simples e caro. */
```

**Uso:**
- Título → `--ink`
- Qualquer texto de apoio → `--gray`
- Borda / linha → `--gray-light`
- Card e input → fundo `--gray-bg`, **sem borda**
- Botão primário → fundo `--ink`, texto branco

**Proibido:** azul de link padrão, verde de sucesso, vermelho de erro saturado. Erro = texto `--ink` + emoji. Sucesso = texto `--ink` + emoji.

---

## 3. Tipografia

**Família:** stack do sistema — é o que a Apple usa e não custa request.

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif;
```

**Escala fechada (6 tamanhos, nada fora disso):**

| Token | Desktop | Mobile | Peso | Line-height | Uso |
|---|---|---|---|---|---|
| `--t-hero` | 64px | 40px | 600 | 1.05 | H1 da hero. Aparece **1 vez** na página |
| `--t-title` | 40px | 30px | 600 | 1.1 | Título de seção |
| `--t-lead` | 21px | 19px | 400 | 1.45 | Subtítulo da hero, parágrafo de destaque |
| `--t-body` | 17px | 17px | 400 | 1.5 | Texto corrido, label, item de lista |
| `--t-small` | 15px | 15px | 400 | 1.4 | Legenda, contador de inscritos |
| `--t-micro` | 12px | 12px | 400 | 1.3 | Rodapé, aviso de privacidade |

**Regras:**
- Só existem 2 pesos: **600** (títulos e botão) e **400** (todo o resto). Sem 500, 700, 800.
- Título tem `letter-spacing: -0.02em`. O resto, `0`.
- Largura máxima de qualquer bloco de texto: **`--t-hero`/`--t-title` → 14ch–20ch** (título quebra em 2 linhas de propósito), **corpo → 60ch**.
- Título **centralizado** na hero e nas seções. Corpo centralizado só quando tem ≤ 2 linhas.

---

## 4. Raio e espaçamento

```css
--radius:      28px;   /* TUDO que tem canto: card, input, imagem, container */
--radius-pill: 999px;  /* só botão */
```

Não existe `12px`, `16px`, `8px` de raio nesta página. Um raio, um pill. Fim.

**Escala de espaço (múltiplos de 8, fechada):**

```css
--s1: 8px;    --s2: 16px;   --s3: 24px;   --s4: 40px;
--s5: 64px;   --s6: 96px;   --s7: 140px;  /* respiro entre seções, desktop */
```

- Padding vertical de seção: `--s7` desktop, `--s5` mobile.
- Distância título → subtítulo: `--s3`.
- Distância subtítulo → formulário/CTA: `--s4`.
- Container máximo: `980px`, com `padding-inline: 24px`.

---

## 5. Emoji (a única "imagem" da página)

- Renderizar como **texto**, não imagem — o Apple Color Emoji sai nativo em iPhone/Mac, que é onde o público está.
- Tamanhos permitidos: **56px** (destaque de seção) e **28px** (inline em item de lista). Só esses dois.
- **Um emoji por bloco.** Nunca dois lado a lado, nunca emoji no meio de uma frase de título.
- Sempre com `line-height: 1` e um `--s2` de respiro abaixo.
- Sugestões de vocabulário (coerentes com o app): 🙏 ⛅️ 🔒 📵 ✨ ⏰ 📖
- Emoji **decora, não informa**. Se remover o emoji e a frase perder sentido, reescreva a frase.

---

## 6. Componentes

### Botão primário
```
fundo: --ink · texto: branco · --t-body peso 600
altura: 52px · padding-inline: 32px · raio: --radius-pill
hover: opacity .85 (transição 200ms ease)
active: scale(.97)
```
Existe **um** botão primário na página inteira: "Quero ser avisado". Repetir o mesmo botão no fim da página é permitido; criar um botão diferente não é.

### Input de e-mail
```
fundo: --gray-bg · sem borda · texto: --ink · placeholder: --gray-light
altura: 52px · padding-inline: 24px · raio: --radius-pill
focus: box-shadow 0 0 0 2px var(--ink) — sem cor, sem glow
```

### Formulário de waitlist
Desktop: input + botão lado a lado, gap `--s1`, largura total 480px, centralizado.
Mobile: empilhado, ambos `width: 100%`.
Abaixo, `--s2` de respiro e o aviso em `--t-micro` cinza: *"Sem spam. Só um aviso quando o app sair."*

### Card
```
fundo: --gray-bg · raio: --radius · padding: --s4 · sem borda · sem sombra
```
Conteúdo do card: emoji 56px → `--s2` → título `--t-body` peso 600 → `--s1` → texto `--t-small` cinza.

### Divisor
`1px` de `--gray-light`, largura total do container. Usar no máximo **1 vez** na página, antes do rodapé.

---

## 7. Movimento

- Uma transição só: `200ms ease`. Vale para hover, focus e opacity.
- Entrada de seção: `fade + translateY(12px)`, `500ms ease-out`, dispara ao entrar na viewport, **uma vez**.
- Sem parallax, sem contador animado, sem carrossel, sem auto-play, sem confete.
- Respeitar `prefers-reduced-motion: reduce` → desliga tudo, mantém o conteúdo visível.

---

## 8. Estrutura da página (ordem)

1. **Hero** — emoji 56px · H1 (`--t-hero`, 2 linhas) · subtítulo (`--t-lead`, cinza, 1–2 linhas) · formulário · aviso micro.
2. **O problema** — título de seção + 1 parágrafo `--t-lead` cinza. Sem card.
3. **Como funciona** — 3 cards em grid (desktop 3 col, mobile 1 col empilhada, gap `--s3`).
4. **Prova / contador** — 1 linha `--t-small`: *"N pessoas já na lista."* Nada mais.
5. **CTA final** — repete o mesmo formulário, com um título `--t-title` curto acima.
6. **Rodapé** — `--t-micro` cinza: nome, ano, link de privacidade. Uma linha.

Máximo de **6 seções**. Se surgir uma sétima, ela vira conteúdo de uma existente ou é cortada.

---

## 9. Checklist antes de considerar pronta

- [ ] A página inteira usa 1 raio + 1 pill?
- [ ] Existem exatamente 6 tamanhos de fonte e 2 pesos?
- [ ] Nenhuma cor além das 6 do token?
- [ ] Nenhuma sombra (fora o CTA flutuante mobile, se existir)?
- [ ] Cada seção tem no máximo 1 emoji de destaque?
- [ ] Dá pra ler tudo em 20 segundos?
- [ ] Existe **um único** botão preto — e ele faz **uma única** coisa?
