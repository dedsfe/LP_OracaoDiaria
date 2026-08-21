/* ============================================================
   Gerador de Plano de Leitura da Bíblia (Oração Diária)
   Sem dependências. Tudo roda no navegador.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Dados: 66 livros, 1189 capítulos ---------- */
  var BOOKS = [
    { n: "Gênesis", c: 50, t: "at" },
    { n: "Êxodo", c: 40, t: "at" },
    { n: "Levítico", c: 27, t: "at" },
    { n: "Números", c: 36, t: "at" },
    { n: "Deuteronômio", c: 34, t: "at" },
    { n: "Josué", c: 24, t: "at" },
    { n: "Juízes", c: 21, t: "at" },
    { n: "Rute", c: 4, t: "at" },
    { n: "1 Samuel", c: 31, t: "at" },
    { n: "2 Samuel", c: 24, t: "at" },
    { n: "1 Reis", c: 22, t: "at" },
    { n: "2 Reis", c: 25, t: "at" },
    { n: "1 Crônicas", c: 29, t: "at" },
    { n: "2 Crônicas", c: 36, t: "at" },
    { n: "Esdras", c: 10, t: "at" },
    { n: "Neemias", c: 13, t: "at" },
    { n: "Ester", c: 10, t: "at" },
    { n: "Jó", c: 42, t: "at" },
    { n: "Salmos", c: 150, t: "at" },
    { n: "Provérbios", c: 31, t: "at" },
    { n: "Eclesiastes", c: 12, t: "at" },
    { n: "Cantares", c: 8, t: "at" },
    { n: "Isaías", c: 66, t: "at" },
    { n: "Jeremias", c: 52, t: "at" },
    { n: "Lamentações", c: 5, t: "at" },
    { n: "Ezequiel", c: 48, t: "at" },
    { n: "Daniel", c: 12, t: "at" },
    { n: "Oseias", c: 14, t: "at" },
    { n: "Joel", c: 3, t: "at" },
    { n: "Amós", c: 9, t: "at" },
    { n: "Obadias", c: 1, t: "at" },
    { n: "Jonas", c: 4, t: "at" },
    { n: "Miqueias", c: 7, t: "at" },
    { n: "Naum", c: 3, t: "at" },
    { n: "Habacuque", c: 3, t: "at" },
    { n: "Sofonias", c: 3, t: "at" },
    { n: "Ageu", c: 2, t: "at" },
    { n: "Zacarias", c: 14, t: "at" },
    { n: "Malaquias", c: 4, t: "at" },
    { n: "Mateus", c: 28, t: "nt" },
    { n: "Marcos", c: 16, t: "nt" },
    { n: "Lucas", c: 24, t: "nt" },
    { n: "João", c: 21, t: "nt" },
    { n: "Atos", c: 28, t: "nt" },
    { n: "Romanos", c: 16, t: "nt" },
    { n: "1 Coríntios", c: 16, t: "nt" },
    { n: "2 Coríntios", c: 13, t: "nt" },
    { n: "Gálatas", c: 6, t: "nt" },
    { n: "Efésios", c: 6, t: "nt" },
    { n: "Filipenses", c: 4, t: "nt" },
    { n: "Colossenses", c: 4, t: "nt" },
    { n: "1 Tessalonicenses", c: 5, t: "nt" },
    { n: "2 Tessalonicenses", c: 3, t: "nt" },
    { n: "1 Timóteo", c: 6, t: "nt" },
    { n: "2 Timóteo", c: 4, t: "nt" },
    { n: "Tito", c: 3, t: "nt" },
    { n: "Filemom", c: 1, t: "nt" },
    { n: "Hebreus", c: 13, t: "nt" },
    { n: "Tiago", c: 5, t: "nt" },
    { n: "1 Pedro", c: 5, t: "nt" },
    { n: "2 Pedro", c: 3, t: "nt" },
    { n: "1 João", c: 5, t: "nt" },
    { n: "2 João", c: 1, t: "nt" },
    { n: "3 João", c: 1, t: "nt" },
    { n: "Judas", c: 1, t: "nt" },
    { n: "Apocalipse", c: 22, t: "nt" }
  ];

  /* Ordem cronológica aproximada, organizada por livro. */
  var CHRONO = [
    "Gênesis", "Jó", "Êxodo", "Levítico", "Números", "Deuteronômio",
    "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Crônicas",
    "Salmos", "Provérbios", "Eclesiastes", "Cantares", "1 Reis",
    "2 Crônicas", "Obadias", "Joel", "Jonas", "Amós", "Oseias",
    "Miqueias", "Isaías", "Naum", "Sofonias", "Habacuque", "Jeremias",
    "Lamentações", "Ezequiel", "2 Reis", "Daniel", "Ageu", "Zacarias",
    "Esdras", "Ester", "Neemias", "Malaquias",
    "Lucas", "Mateus", "Marcos", "João", "Atos", "Tiago", "Gálatas",
    "1 Tessalonicenses", "2 Tessalonicenses", "1 Coríntios", "2 Coríntios",
    "Romanos", "Efésios", "Colossenses", "Filemom", "Filipenses",
    "1 Timóteo", "Tito", "1 Pedro", "Hebreus", "2 Timóteo", "2 Pedro",
    "Judas", "1 João", "2 João", "3 João", "Apocalipse"
  ];

  /* Minutos médios de leitura por capítulo (Bíblia inteira ≈ 49h). */
  var MIN_POR_CAPITULO = 2.5;
  var TOTAL_CAPITULOS = 1189;

  var STORAGE_KEY = "od_plano_leitura_v1";

  /* ---------- Utilidades ---------- */

  function bookByName(name) {
    for (var i = 0; i < BOOKS.length; i++) {
      if (BOOKS[i].n === name) return BOOKS[i];
    }
    return null;
  }

  /* Expande uma lista de livros em capítulos individuais. */
  function expand(books) {
    var out = [];
    for (var i = 0; i < books.length; i++) {
      for (var c = 1; c <= books[i].c; c++) {
        out.push({ b: books[i].n, c: c });
      }
    }
    return out;
  }

  function sequenceFor(order) {
    if (order === "cronologica") {
      return expand(CHRONO.map(bookByName));
    }
    return expand(BOOKS);
  }

  /* Comprime capítulos consecutivos em referências legíveis.
     Ex.: [Gn 1, Gn 2, Gn 3] -> "Gênesis 1-3" */
  function compress(chapters) {
    if (!chapters.length) return "";
    var parts = [];
    var start = chapters[0];
    var prev = chapters[0];

    for (var i = 1; i <= chapters.length; i++) {
      var cur = chapters[i];
      var continua =
        cur && cur.b === prev.b && cur.c === prev.c + 1;
      if (!continua) {
        parts.push(
          start.c === prev.c
            ? start.b + " " + start.c
            : start.b + " " + start.c + "-" + prev.c
        );
        start = cur;
      }
      prev = cur;
    }
    return parts.join(" · ");
  }

  function addDays(date, n) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + n);
    return d;
  }

  function isSunday(date) {
    return date.getDay() === 0;
  }

  function parseInputDate(value) {
    var p = value.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function toInputDate(date) {
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + m + "-" + d;
  }

  var MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
                      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun",
               "jul", "ago", "set", "out", "nov", "dez"];
  var DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

  function formatDate(date) {
    return DIAS[date.getDay()] + ", " + date.getDate() + " de " +
           MESES[date.getMonth()] + " de " + date.getFullYear();
  }

  function formatDateShort(date) {
    return date.getDate() + " " + MESES[date.getMonth()] + " " + date.getFullYear();
  }

  /* ---------- Geração do plano ---------- */

  /* Distribui `total` itens em `dias` blocos o mais uniformemente possível. */
  function distribute(total, dias) {
    var base = Math.floor(total / dias);
    var resto = total % dias;
    var sizes = [];
    for (var i = 0; i < dias; i++) {
      sizes.push(base + (i < resto ? 1 : 0));
    }
    return sizes;
  }

  /* opts: { startDate, dias, order, modo, pularDomingo, from } */
  function generatePlan(opts) {
    var seq = sequenceFor(opts.order);
    var restante = seq.slice(opts.from || 0);
    var dias = Math.max(1, opts.dias);
    var blocos;

    if (opts.modo === "paralelo") {
      var at = restante.filter(function (x) { return bookByName(x.b).t === "at"; });
      var nt = restante.filter(function (x) { return bookByName(x.b).t === "nt"; });
      var atSizes = distribute(at.length, dias);
      var ntSizes = distribute(nt.length, dias);
      blocos = [];
      var ai = 0, ni = 0;
      for (var i = 0; i < dias; i++) {
        var dia = at.slice(ai, ai + atSizes[i]).concat(nt.slice(ni, ni + ntSizes[i]));
        ai += atSizes[i];
        ni += ntSizes[i];
        blocos.push(dia);
      }
    } else {
      var sizes = distribute(restante.length, dias);
      blocos = [];
      var idx = 0;
      for (var j = 0; j < dias; j++) {
        blocos.push(restante.slice(idx, idx + sizes[j]));
        idx += sizes[j];
      }
    }

    /* Atribui datas, pulando domingos se pedido. */
    var plano = [];
    var cursor = new Date(opts.startDate.getTime());
    for (var k = 0; k < blocos.length; k++) {
      if (opts.pularDomingo) {
        while (isSunday(cursor)) cursor = addDays(cursor, 1);
      }
      if (!blocos[k].length) { cursor = addDays(cursor, 1); continue; }
      plano.push({
        date: new Date(cursor.getTime()),
        chapters: blocos[k],
        ref: compress(blocos[k]),
        minutos: Math.round(blocos[k].length * MIN_POR_CAPITULO)
      });
      cursor = addDays(cursor, 1);
    }
    return plano;
  }

  /* ---------- Estado ---------- */

  var state = {
    plano: [],
    config: null,
    lidos: {}
  };

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        config: state.config,
        lidos: state.lidos
      }));
    } catch (e) { /* modo privado: segue sem salvar */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  /* ---------- DOM ---------- */

  var $ = function (sel) { return document.querySelector(sel); };

  /* ---------- Campo de data em dia / mês / ano ----------
     Um <input type="date"> segue o idioma do navegador e mostra 08/20/2026 para
     quem está com o Chrome em inglês. Três selects em português evitam qualquer
     ambiguidade de formato. */

  function opcoes(select, itens, valorAtual) {
    var html = "";
    for (var i = 0; i < itens.length; i++) {
      html += '<option value="' + itens[i].v + '">' + itens[i].t + "</option>";
    }
    select.innerHTML = html;
    if (valorAtual != null) select.value = String(valorAtual);
  }

  function diasNoMes(ano, mes) {
    return new Date(ano, mes + 1, 0).getDate();
  }

  /* Reajusta a lista de dias quando o mês ou o ano muda (fevereiro, meses de 30). */
  function atualizarDias() {
    var ano = parseInt($("#pl-ano").value, 10);
    var mes = parseInt($("#pl-mes").value, 10);
    var max = diasNoMes(ano, mes);
    var atual = parseInt($("#pl-dia").value, 10) || 1;
    var itens = [];
    for (var d = 1; d <= max; d++) itens.push({ v: d, t: d });
    opcoes($("#pl-dia"), itens, Math.min(atual, max));
  }

  function popularData() {
    var hoje = new Date();
    var anos = [];
    for (var a = hoje.getFullYear(); a <= hoje.getFullYear() + 2; a++) {
      anos.push({ v: a, t: a });
    }
    opcoes($("#pl-ano"), anos, hoje.getFullYear());

    var meses = [];
    for (var m = 0; m < 12; m++) meses.push({ v: m, t: MESES_LONGOS[m] });
    opcoes($("#pl-mes"), meses, hoje.getMonth());

    atualizarDias();
    $("#pl-dia").value = String(hoje.getDate());

    $("#pl-mes").addEventListener("change", atualizarDias);
    $("#pl-ano").addEventListener("change", atualizarDias);
  }

  /* Devolve a data escolhida no formato YYYY-MM-DD. */
  function getInicio() {
    var ano = parseInt($("#pl-ano").value, 10);
    var mes = parseInt($("#pl-mes").value, 10);
    var dia = parseInt($("#pl-dia").value, 10);
    return toInputDate(new Date(ano, mes, dia));
  }

  /* Recebe YYYY-MM-DD e posiciona os três selects. */
  function setInicio(valor) {
    var d = parseInputDate(valor);
    var anoSel = $("#pl-ano");
    var existe = false;
    for (var i = 0; i < anoSel.options.length; i++) {
      if (anoSel.options[i].value === String(d.getFullYear())) existe = true;
    }
    /* Um plano salvo pode apontar para um ano fora da lista padrão. */
    if (!existe) {
      anoSel.innerHTML += '<option value="' + d.getFullYear() + '">' +
                          d.getFullYear() + "</option>";
    }
    anoSel.value = String(d.getFullYear());
    $("#pl-mes").value = String(d.getMonth());
    atualizarDias();
    $("#pl-dia").value = String(d.getDate());
  }

  function readForm() {
    var ritmo = $("#pl-ritmo").value;
    var minutos = parseInt($("#pl-minutos").value, 10) || 15;
    var dias;
    if (ritmo === "minutos") {
      var min = Math.max(3, minutos);
      dias = Math.ceil((TOTAL_CAPITULOS * MIN_POR_CAPITULO) / min);
    } else {
      dias = parseInt(ritmo, 10);
    }
    return {
      inicio: getInicio(),
      ritmo: ritmo,
      minutos: minutos,
      dias: dias,
      order: $("#pl-ordem").value,
      modo: $("#pl-modo").value,
      pularDomingo: $("#pl-domingo").checked,
      from: 0
    };
  }

  function build(config) {
    state.config = config;
    state.plano = generatePlan({
      startDate: parseInputDate(config.inicio),
      dias: config.dias,
      order: config.order,
      modo: config.modo,
      pularDomingo: config.pularDomingo,
      from: config.from || 0
    });
    render();
    saveState();
  }

  function progresso() {
    var lidos = 0;
    for (var i = 0; i < state.plano.length; i++) {
      if (state.lidos[i]) lidos++;
    }
    return lidos;
  }

  /* Quantos dias do plano já passaram da data de hoje sem serem marcados. */
  function diasAtrasados() {
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    var atraso = 0;
    for (var i = 0; i < state.plano.length; i++) {
      if (state.plano[i].date < hoje && !state.lidos[i]) atraso++;
    }
    return atraso;
  }

  function render() {
    var plano = state.plano;
    if (!plano.length) return;

    var fim = plano[plano.length - 1].date;
    var lidos = progresso();
    var pct = Math.round((lidos / plano.length) * 100);
    var atraso = diasAtrasados();
    var mediaCaps = (TOTAL_CAPITULOS / plano.length).toFixed(1);
    var mediaMin = Math.round((TOTAL_CAPITULOS * MIN_POR_CAPITULO) / plano.length);

    /* Resumo */
    $("#pl-resumo").innerHTML =
      '<div class="pl-stat"><span class="pl-stat__num">' + plano.length + '</span>' +
      '<span class="pl-stat__label">dias de leitura</span></div>' +
      '<div class="pl-stat"><span class="pl-stat__num">' + mediaCaps + '</span>' +
      '<span class="pl-stat__label">capítulos por dia</span></div>' +
      '<div class="pl-stat"><span class="pl-stat__num">' + mediaMin + ' min</span>' +
      '<span class="pl-stat__label">por dia</span></div>' +
      '<div class="pl-stat"><span class="pl-stat__num">' + formatDateShort(fim) + '</span>' +
      '<span class="pl-stat__label">você termina</span></div>';

    /* Barra de progresso */
    $("#pl-progresso").innerHTML =
      '<div class="pl-progress__bar"><div class="pl-progress__fill" style="width:' + pct + '%"></div></div>' +
      '<p class="pl-progress__text">' + lidos + ' de ' + plano.length +
      ' dias concluídos (' + pct + '%)</p>';

    /* Aviso de atraso: o diferencial */
    var box = $("#pl-atraso");
    if (atraso > 0) {
      box.hidden = false;
      box.innerHTML =
        '<p class="pl-atraso__title">Você está ' + atraso +
        (atraso === 1 ? ' dia atrasado.' : ' dias atrasado.') + '</p>' +
        '<p class="pl-atraso__desc">Isso não anula nada. É só recalcular o caminho ' +
        'e continuar de onde você está, a partir de hoje.</p>' +
        '<div class="pl-atraso__actions">' +
        '<button type="button" class="pl-btn pl-btn--sm" id="pl-replan-ritmo">' +
        'Continuar no meu ritmo</button>' +
        '<button type="button" class="pl-btn pl-btn--sm pl-btn--ghost" id="pl-replan-data">' +
        'Recuperar e terminar na data original</button>' +
        "</div>";
      $("#pl-replan-ritmo").addEventListener("click", function () { replanejar("ritmo"); });
      $("#pl-replan-data").addEventListener("click", function () { replanejar("data"); });
    } else {
      box.hidden = true;
      box.innerHTML = "";
    }

    /* Cronograma */
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    var html = "";
    var mesAtual = "";
    for (var i = 0; i < plano.length; i++) {
      var d = plano[i];
      var mes = MESES[d.date.getMonth()] + " " + d.date.getFullYear();
      if (mes !== mesAtual) {
        mesAtual = mes;
        html += '<li class="pl-month">' + mes + "</li>";
      }
      var isHoje = d.date.getTime() === hoje.getTime();
      var classes = "pl-day" +
        (state.lidos[i] ? " is-done" : "") +
        (isHoje ? " is-today" : "") +
        (d.date < hoje && !state.lidos[i] ? " is-late" : "");
      html +=
        '<li class="' + classes + '">' +
        '<label class="pl-day__label">' +
        '<input type="checkbox" class="pl-day__check" data-i="' + i + '"' +
        (state.lidos[i] ? " checked" : "") + ' aria-label="Marcar como lido" />' +
        '<span class="pl-day__date">' + formatDate(d.date) +
        (isHoje ? ' <b class="pl-tag">hoje</b>' : "") + "</span>" +
        '<span class="pl-day__ref">' + d.ref + "</span>" +
        '<span class="pl-day__min">' + d.minutos + " min</span>" +
        "</label></li>";
    }
    $("#pl-cronograma").innerHTML = html;

    var checks = document.querySelectorAll(".pl-day__check");
    for (var j = 0; j < checks.length; j++) {
      checks[j].addEventListener("change", onCheck);
    }

    $("#pl-resultado").hidden = false;

    /* Rola até o primeiro dia não lido */
    var alvo = document.querySelector(".pl-day.is-today") ||
               document.querySelector(".pl-day:not(.is-done)");
    if (alvo) alvo.scrollIntoView({ block: "center" });
  }

  function onCheck(e) {
    var i = parseInt(e.target.getAttribute("data-i"), 10);
    if (e.target.checked) state.lidos[i] = true;
    else delete state.lidos[i];
    saveState();

    /* Atualiza só o que muda, sem re-renderizar a lista inteira. */
    var li = e.target.closest(".pl-day");
    if (li) li.classList.toggle("is-done", e.target.checked);
    var plano = state.plano;
    var lidos = progresso();
    var pct = Math.round((lidos / plano.length) * 100);
    var fill = document.querySelector(".pl-progress__fill");
    var text = document.querySelector(".pl-progress__text");
    if (fill) fill.style.width = pct + "%";
    if (text) {
      text.textContent = lidos + " de " + plano.length +
        " dias concluídos (" + pct + "%)";
    }
  }

  /* O coração da ferramenta: refaz o cronograma a partir de hoje. */
  function replanejar(tipo) {
    var plano = state.plano;
    var dataFinalOriginal = plano[plano.length - 1].date;

    /* Quantos capítulos já foram lidos de fato (dias marcados). */
    var lidosCount = 0;
    for (var i = 0; i < plano.length; i++) {
      if (state.lidos[i]) lidosCount += plano[i].chapters.length;
    }

    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    var novosDias;
    if (tipo === "data") {
      /* Mantém a data final: aperta o ritmo. */
      novosDias = Math.max(
        1,
        Math.round((dataFinalOriginal - hoje) / 86400000) + 1
      );
    } else {
      /* Mantém o ritmo: empurra a data final. */
      var capsPorDia = TOTAL_CAPITULOS / plano.length;
      novosDias = Math.max(1, Math.ceil((TOTAL_CAPITULOS - lidosCount) / capsPorDia));
    }

    state.lidos = {};
    state.config.inicio = toInputDate(hoje);
    state.config.dias = novosDias;
    state.config.from = lidosCount;
    setInicio(state.config.inicio);
    build(state.config);

    var aviso = $("#pl-aviso");
    aviso.hidden = false;
    aviso.textContent = tipo === "data"
      ? "Pronto. Plano refeito a partir de hoje, mantendo a data final."
      : "Pronto. Plano refeito a partir de hoje, no mesmo ritmo de antes.";
    setTimeout(function () { aviso.hidden = true; }, 6000);
  }

  /* ---------- Exportar ---------- */

  function planoEmTexto() {
    var linhas = ["PLANO DE LEITURA DA BÍBLIA (oracaodiaria.space)", ""];
    for (var i = 0; i < state.plano.length; i++) {
      var d = state.plano[i];
      linhas.push(formatDate(d.date) + ": " + d.ref);
    }
    return linhas.join("\n");
  }

  /* ---------- Inicialização ---------- */

  function init() {
    var form = $("#pl-form");
    if (!form) return;

    /* Data de início = hoje. Ninguém precisa esperar 1º de janeiro. */
    popularData();

    $("#pl-ritmo").addEventListener("change", function () {
      $("#pl-minutos-wrap").hidden = $("#pl-ritmo").value !== "minutos";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      state.lidos = {};
      build(readForm());
      if (window.trackEvent) window.trackEvent("plano_gerado");
    });

    $("#pl-copiar").addEventListener("click", function () {
      navigator.clipboard.writeText(planoEmTexto());
      var b = $("#pl-copiar");
      var txt = b.textContent;
      b.textContent = "✓ Copiado!";
      setTimeout(function () { b.textContent = txt; }, 2000);
    });

    $("#pl-imprimir").addEventListener("click", function () {
      window.print();
    });

    $("#pl-recomecar").addEventListener("click", function () {
      if (!confirm("Isso apaga seu progresso e começa um plano novo. Continuar?")) return;
      state.lidos = {};
      state.config = null;
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      $("#pl-resultado").hidden = true;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    /* Restaura plano salvo. */
    var saved = loadState();
    if (saved && saved.config) {
      state.lidos = saved.lidos || {};
      setInicio(saved.config.inicio);
      if (saved.config.ritmo) {
        $("#pl-ritmo").value = saved.config.ritmo;
      } else if (saved.config.dias) {
        var dStr = String(saved.config.dias);
        if (["365", "180", "90", "730"].indexOf(dStr) !== -1) {
          $("#pl-ritmo").value = dStr;
        }
      }
      if (saved.config.minutos) {
        $("#pl-minutos").value = saved.config.minutos;
      }
      $("#pl-minutos-wrap").hidden = $("#pl-ritmo").value !== "minutos";
      $("#pl-ordem").value = saved.config.order;
      $("#pl-modo").value = saved.config.modo;
      $("#pl-domingo").checked = !!saved.config.pularDomingo;
      build(saved.config);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
