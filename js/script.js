/* ============================================================
   CANTINHO DA BELEZA — LÓGICA DO SITE
   ------------------------------------------------------------
   Este arquivo NÃO contém dados do cliente.
   Tudo é lido de js/config.js (objeto global `siteConfig`).

   Fluxo:
   1. Aplica as cores personalizadas (se houver).
   2. Preenche textos/links fixos via [data-config].
   3. Monta dinamicamente: serviços, diferenciais, galeria,
      depoimentos e horários.
   4. Inicializa interações (menu, lightbox, animações).
   ============================================================ */

(function () {
  "use strict";

  // Lê o config do cliente (js/config.js). typeof evita ReferenceError
  // caso o arquivo de config não tenha sido carregado.
  var config =
    window.siteConfig ||
    (typeof siteConfig !== "undefined" ? siteConfig : {}) ||
    {};

  /* ---------- Utilidades ---------- */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  // Recebe "empresa.nome" e percorre o objeto de configuração.
  function getPath(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, config);
  }

  function isFilled(value) {
    if (value == null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") {
      return Object.keys(value).some(function (k) {
        return isFilled(value[k]);
      });
    }
    if (typeof value === "string") return value.trim() !== "";
    return true;
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = String(text == null ? "" : text);
    return div.innerHTML;
  }

  // Só escapa quando o valor for injetado dentro de atributos HTML.
  function escapeAttr(text) {
    return escapeHtml(text)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showSection(id) {
    var el = document.getElementById(id);
    if (el) el.hidden = false;
  }

  function hideSection(id) {
    var el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  /* ---------- 1. Cores personalizadas ---------- */

  function applyColors() {
    var cores = (config.identidade && config.identidade.cores) || {};
    var root = document.documentElement;
    var map = {
      "--cor-primaria": cores.primaria,
      "--cor-primaria-escura": cores.primariaEscura,
      "--cor-dourado": cores.dourado,
      "--cor-escura": cores.escura,
      "--cor-fundo": cores.fundo,
      "--cor-fundo-alt": cores.fundoAlt,
      "--cor-texto": cores.texto
    };
    Object.keys(map).forEach(function (varName) {
      if (map[varName]) root.style.setProperty(varName, map[varName]);
    });
  }

  /* ---------- 2. Ícones (SVG inline, sem bibliotecas) ---------- */

  var ICONS = {
    tesoura: '<path d="M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm1.6-4.4L20 17M20 7 7.6 15.4" stroke-linecap="round" stroke-linejoin="round"/>',
    escova: '<path d="M4 20c3-1 4-3 5-6m-2-7 6-3 5 5-3 6c-2 1-4 1-6-1s-2-3-2-7Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 4c2 3 5 4 7 4M9 13l5-5" stroke-linecap="round"/>',
    hidratacao: '<path d="M12 3s6 6.3 6 11a6 6 0 1 1-12 0c0-4.7 6-11 6-11Z" stroke-linejoin="round"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 3" stroke-linecap="round"/>',
    coloracao: '<path d="M6 21c0-4 2-5 4-6m2-9 2 2-9 9-3 1 1-3 9-9Zm2-2 1.5-1.5a2.1 2.1 0 0 1 3 3L13 12" stroke-linecap="round" stroke-linejoin="round"/>',
    penteado: '<path d="M12 3c5 0 8 3.5 8 8 0 2-1 4-2.5 5.5M12 3C7 3 4 6.5 4 11c0 3 1.5 5 3.5 6.5M12 3c-2 3-2.5 7-1.5 10.5S13 19 15 21M12 3c2 2.5 3.5 6 3.5 9.5" stroke-linecap="round"/>',
    pele: '<circle cx="12" cy="12" r="9"/><path d="M8.5 10h.01M15.5 10h.01M9 15c1 .8 2 1.2 3 1.2s2-.4 3-1.2" stroke-linecap="round"/>',
    sobrancelha: '<path d="M3 14c3-4 6-6 9-6s6 2 9 6M7 10.5c1.5-.8 3-1 4.5-.8" stroke-linecap="round"/>',
    corpo: '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v6m0 0-3 8m3-8 3 8M8 9c2.5-1.5 5.5-1.5 8 0" stroke-linecap="round" stroke-linejoin="round"/>',
    folha: '<path d="M5 19C5 9 12 4 20 4c0 9-5 15-13 15h-2Zm0 0c1.5-4.5 4-7.5 8-10" stroke-linecap="round" stroke-linejoin="round"/>',
    coracao: '<path d="M12 20s-7-4.6-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.4-9 9-9 9Z" stroke-linejoin="round"/>',
    estrela: '<path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z" stroke-linejoin="round"/>',
    brilho: '<path d="M12 4v3m0 10v3M4 12h3m10 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1m0-11.4-2.1 2.1M8.4 15.6l-2.1 2.1M14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" stroke-linecap="round"/>',
    atendimento: '<path d="M4 13a8 8 0 1 1 16 0" stroke-linecap="round"/><path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Zm-4 5c-2 1-4.5 1-6 1" stroke-linecap="round"/>',
    mapa: '<path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5"/>',
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" stroke-linecap="round"/>',
    telefone: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke-linejoin="round"/>',
    whatsapp: '<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" stroke-linejoin="round"/><path d="M9.3 8.6c.5-.4 1.4-.3 1.7.3l.6 1.1c.2.4-.1.9-.4 1.2-.3.3-.3.7 0 1.2.4.6 1 1.2 1.7 1.5.4.2.9.1 1.2-.2.3-.4.8-.6 1.2-.4l1.1.6c.6.3.7 1.2.3 1.7-1 1.2-2.8 1.4-4.5.6-1.6-.7-3.2-2.3-3.9-3.9-.8-1.7-.6-3.5.6-4.5l.4-.2Z" stroke-linejoin="round"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.5"/><path d="M16.7 7.3h.01" stroke-linecap="round"/>',
    facebook: '<path d="M15.5 8.5H14c-.8 0-1.5.7-1.5 1.5v2h3l-.5 3h-2.5v6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9"/>',
    pin: '<path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5"/>',
    aspas: '<path d="M10 8c-3 1-4.5 3-4.5 6 0 1.5 1 2.5 2.3 2.5S10 15.6 10 14.2 9 12 7.8 12c0-1.3.8-2.4 2.2-3L10 8Zm8 0c-3 1-4.5 3-4.5 6 0 1.5 1 2.5 2.3 2.5S18 15.6 18 14.2 17 12 15.8 12c0-1.3.8-2.4 2.2-3L18 8Z" fill="currentColor" stroke="none"/>',
    seta: '<path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/>',
    check: '<path d="m5 12 5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  function icon(name, cssClass) {
    var path = ICONS[name] || ICONS.brilho;
    return '<svg class="icon ' + (cssClass || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">' + path + "</svg>";
  }

  /* ---------- 3. Links e WhatsApp ---------- */

  function whatsUrl(customMessage) {
    var numero = (config.contato && config.contato.whatsapp) || "";
    if (!numero) return "#";
    var msg = customMessage ||
      (config.contato && config.contato.mensagemWhatsapp) || "";
    var url = "https://wa.me/" + String(numero).replace(/\D/g, "");
    if (msg) url += "?text=" + encodeURIComponent(msg);
    return url;
  }

  function mapsUrl() {
    var endereco = (config.empresa && config.empresa.endereco) || "";
    return endereco
      ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(endereco)
      : "#";
  }

  function telUrl() {
    var tel = (config.empresa && config.empresa.telefone) || "";
    if (!tel) return "#";
    var digitos = String(tel).replace(/\D/g, "");

    // Já em formato internacional (+DDI...): usa como está.
    if (String(tel).trim().charAt(0) === "+") return "tel:+" + digitos;

    // Sem DDI do país (ex.: "(33) 98436-8440"): herda o prefixo internacional
    // do WhatsApp (ex.: 55 + DDD + número) para não gerar um +DDI errado.
    var whats = String((config.contato && config.contato.whatsapp) || "").replace(/\D/g, "");
    if (
      whats &&
      digitos.length >= 10 &&
      whats.length > digitos.length &&
      whats.slice(-digitos.length) === digitos
    ) {
      digitos = whats.slice(0, whats.length - digitos.length) + digitos;
    }
    return "tel:+" + digitos;
  }

  function emailUrl() {
    var email = (config.empresa && config.empresa.email) || "";
    return email ? "mailto:" + String(email).trim() : "#";
  }

  /* ---------- 4. Preenchimento fixo via [data-config] ---------- */

  function bindFixedTexts() {
    $$("[data-config]").forEach(function (el) {
      var value = getPath(el.getAttribute("data-config"));
      if (value == null) value = "";
      el.textContent = value;
    });

    // Elementos que só devem aparecer quando o dado existe.
    $$("[data-config-if]").forEach(function (el) {
      var value = getPath(el.getAttribute("data-config-if"));
      if (!isFilled(value)) el.hidden = true;
    });

    // Atributos aria configuráveis (ex.: aria-label do menu e do lightbox).
    // $$ (e não $) para cobrir todos os elementos com o atributo.
    $$("[data-config-aria]").forEach(function (el) {
      var value = getPath(el.getAttribute("data-config-aria"));
      if (typeof value === "string" && value.trim() !== "") {
        el.setAttribute("aria-label", value);
      }
    });

    // Imagens configuráveis (logo etc.).
    $$("[data-config-img]").forEach(function (el) {
      var value = getPath(el.getAttribute("data-config-img"));
      el.hidden = !value;
      if (value) el.src = value;
    });

    // Links gerados.
    $$("[data-href]").forEach(function (el) {
      var kind = el.getAttribute("data-href");
      var url = kind === "maps" ? mapsUrl()
        : kind === "tel" ? telUrl()
        : kind === "email" ? emailUrl()
        : kind === "whats" ? whatsUrl()
        : kind === "instagram" ? (config.identidade && config.identidade.instagram)
        : kind === "facebook" ? (config.identidade && config.identidade.facebook)
        : "#";
      if (url) el.href = url;
    });

    // Favicon configurável.
    var favicon = (config.identidade && config.identidade.favicon) || "";
    if (favicon) {
      var faviconLink = $('link[rel="icon"]');
      if (faviconLink) faviconLink.setAttribute("href", favicon);
    }

    // Sem WhatsApp configurado, o botão flutuante não faz sentido.
    var whats = String((config.contato && config.contato.whatsapp) || "").trim();
    var flutuante = $(".whatsapp-flutuante");
    if (flutuante && !whats) flutuante.hidden = true;

    // Ano do copyright.
    $$("[data-ano-atual]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function applySeo() {
    var seo = config.seo || {};
    var empresa = config.empresa || {};

    if (seo.titulo) document.title = seo.titulo;
    else if (empresa.nome) document.title = empresa.nome;

    var metaDesc = $('meta[name="description"]');
    if (metaDesc && (seo.descricao || empresa.nome)) {
      metaDesc.setAttribute("content", seo.descricao || (empresa.nome + " - " + (empresa.cidade || "")));
    }

    var ogTitle = $('meta[property="og:title"]');
    if (ogTitle && seo.titulo) ogTitle.setAttribute("content", seo.titulo);

    var ogDesc = $('meta[property="og:description"]');
    if (ogDesc && seo.descricao) ogDesc.setAttribute("content", seo.descricao);

    // URL canônica/Open Graph (mesmo protocolo+host da página atual).
    var ogSiteName = $('meta[property="og:site_name"]');
    if (ogSiteName && empresa.nome) ogSiteName.setAttribute("content", empresa.nome);

    var ogUrl = $('meta[property="og:url"]');
    if (ogUrl && window.location.protocol.indexOf("http") === 0) {
      ogUrl.setAttribute("content", window.location.href);
    }
  }

  /* ---------- 5. Hero ---------- */

  function renderHero() {
    var hero = config.hero || {};
    var titulo = $("#heroTitulo");
    if (titulo) {
      if (hero.destaque) {
        titulo.innerHTML =
          escapeHtml(hero.titulo) + " <em>" + escapeHtml(hero.destaque) + "</em>";
      } else {
        titulo.textContent = hero.titulo || "";
      }
    }
    if (hero.imagem) {
      var section = $("#inicio");
      if (section) {
        section.style.backgroundImage = "linear-gradient(rgba(28,20,16,.78), rgba(28,20,16,.82)), url('" + hero.imagem + "')";
        section.classList.add("hero--com-imagem");
      }
    }

    // Se não houver serviços cadastrados, o botão secundário leva ao contato.
    var temServicos = (config.servicos || []).some(function (c) {
      return c && c.itens && c.itens.length > 0;
    });
    var botaoSecundario = $(".hero__acoes .botao--contorno");
    if (botaoSecundario && !temServicos) botaoSecundario.setAttribute("href", "#contato");
  }

  /* ---------- 6. Menu de navegação (a partir de config.menu) ---------- */

  function renderMenus() {
    var itens = (config.menu || []).filter(function (m) {
      return m && m.texto && m.link;
    });

    var nav = $("#menuNavegacao");
    if (nav) {
      var html = itens.map(function (item) {
        var externo = /^https?:/i.test(item.link);
        return (
          '<a class="navegacao__link" href="' + escapeAttr(item.link) + '"' +
          (externo ? ' target="_blank" rel="noopener"' : "") + ">" +
          escapeHtml(item.texto) + "</a>"
        );
      }).join("");

      // Observação: o bindFixedTexts já rodou, então texto e link do CTA são
      // inseridos aqui diretamente (data-config/data-href não seriam processados).
      if (String((config.contato && config.contato.whatsapp) || "").trim()) {
        var textoCta = (config.hero && config.hero.textoBotaoPrimario) || "Agendar";
        html +=
          '<a class="botao botao--primario navegacao__cta" target="_blank" rel="noopener" href="' +
            escapeAttr(whatsUrl()) + '">' +
            '<span data-icone="whatsapp"></span>' +
            "<span>" + escapeHtml(textoCta) + "</span>" +
          "</a>";
      }
      nav.innerHTML = html;
    }

    var rodapeMenu = $("#rodapeMenu");
    if (rodapeMenu) {
      rodapeMenu.innerHTML = itens.map(function (item) {
        var externo = /^https?:/i.test(item.link);
        return (
          "<li><a href=\"" + escapeAttr(item.link) + "\"" +
          (externo ? " target=\"_blank\" rel=\"noopener\"" : "") + ">" +
          escapeHtml(item.texto) + "</a></li>"
        );
      }).join("");
    }
  }

  /* ---------- 6. Serviços ---------- */

  function renderServicos() {
    var grid = $("#servicosLista");
    if (!grid) return;
    var textosServ = (config.textos && config.textos.servicos) || {};
    var categorias = (config.servicos || []).filter(function (c) {
      return c && c.itens && c.itens.length > 0;
    });

    if (!categorias.length) {
      hideSection("servicos");
      return;
    }
    showSection("servicos");

    grid.innerHTML = categorias.map(function (categoria, ci) {
      var cards = categoria.itens.map(function (item) {
        var desc = item.descricao
          ? '<p class="servico-card__desc">' + escapeHtml(item.descricao) + "</p>"
          : "";
        return (
          '<article class="servico-card" data-reveal>' +
            '<div class="servico-card__icone">' + icon(item.icone) + "</div>" +
            "<h4>" + escapeHtml(item.nome) + "</h4>" +
            desc +
            '<a class="servico-card__cta" target="_blank" rel="noopener" href="' + escapeAttr(whatsUrl()) + '">' +
              escapeHtml(textosServ.ctaCard || "Agendar") + icon("whatsapp") +
            "</a>" +
          "</article>"
        );
      }).join("");

      return (
        '<div class="servicos-categoria">' +
          '<div class="servicos-categoria__cabecalho" data-reveal>' +
            '<span class="servicos-categoria__numero">' + String(ci + 1).padStart(2, "0") + "</span>" +
            "<h3>" + escapeHtml(categoria.categoria || "") + "</h3>" +
            (categoria.descricao ? '<p>' + escapeHtml(categoria.descricao) + "</p>" : "") +
          "</div>" +
          '<div class="servicos-grid">' + cards + "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------- 7. Diferenciais ---------- */

  function renderDiferenciais() {
    var grid = $("#diferenciaisLista");
    if (!grid) return;
    var itens = (config.diferenciais || []).filter(function (d) { return d && d.titulo; });

    if (!itens.length) {
      hideSection("diferenciais");
      return;
    }
    showSection("diferenciais");

    grid.innerHTML = itens.map(function (item) {
      return (
        '<article class="diferencial-card" data-reveal>' +
          '<div class="diferencial-card__icone">' + icon(item.icone) + "</div>" +
          "<h3>" + escapeHtml(item.titulo) + "</h3>" +
          (item.descricao ? "<p>" + escapeHtml(item.descricao) + "</p>" : "") +
        "</article>"
      );
    }).join("");
  }

  /* ---------- 8. Sobre (citação + destaques) ---------- */

  function renderSobre() {
    var sobre = config.sobre || {};
    var box = $("#sobreCitacao");
    if (!box) return;
    if (sobre.citacao) {
      box.innerHTML = icon("aspas", "sobre__aspas") + "<p>" + escapeHtml(sobre.citacao) + "</p>";
    } else {
      box.hidden = true;
    }
  }

  function renderSobreDestaques() {
    var box = $("#sobreDestaques");
    if (!box) return;
    var textosSobre = (config.textos && config.textos.sobre) || {};
    var itens = (textosSobre.destaques || []).filter(function (d) {
      return d && d.texto;
    });

    if (!itens.length) {
      box.hidden = true;
      return;
    }

    box.innerHTML = itens.map(function (item) {
      return (
        '<div class="sobre-destaque">' +
          '<span data-icone="' + escapeAttr(item.icone || "estrela") + '"></span>' +
          "<strong>" + escapeHtml(item.texto) + "</strong>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------- 9. Galeria + Lightbox ---------- */

  var lightbox = null;

  function openLightbox(index) {
    var items = (config.galeria || []).filter(function (g) { return g && g.imagem; });
    if (!lightbox) return;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    updateLightbox(index, items);
    var fechar = $("#lightboxFechar");
    if (fechar) fechar.focus();
  }

  function updateLightbox(index, items) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    lightbox._index = index;

    var item = items[index];
    $("#lightboxImg").src = item.imagem;
    $("#lightboxImg").alt = item.titulo || "Foto da galeria";
    $("#lightboxLegenda").textContent = item.titulo || "";
    $("#lightboxContador").textContent = (index + 1) + " / " + items.length;
    $("#lightboxDescricao").textContent = item.descricao || "";
    $("#lightboxDescricao").hidden = !item.descricao;

    var semNavegacao = items.length < 2;
    $("#lightboxPrev").hidden = semNavegacao;
    $("#lightboxNext").hidden = semNavegacao;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function renderGaleria() {
    var grid = $("#galeriaGrade");
    if (!grid) return;
    var itens = (config.galeria || []).filter(function (g) { return g && g.imagem; });

    if (!itens.length) {
      hideSection("galeria");
      return;
    }
    showSection("galeria");

    grid.innerHTML = itens.map(function (item, i) {
      var legenda = item.titulo
        ? '<span class="galeria-item__titulo">' + escapeHtml(item.titulo) + "</span>"
        : "";
      return (
        '<button type="button" class="galeria-item" data-reveal data-index="' + i + '"' +
          ' aria-label="Ampliar foto: ' + escapeAttr(item.titulo || "Foto " + (i + 1)) + '">' +
          '<img src="' + escapeAttr(item.imagem) + '" alt="' + escapeAttr(item.titulo || "Foto da galeria") + '"' +
            ' loading="lazy" decoding="async">' +
          '<span class="galeria-item__overlay">' +
            icon("brilho", "galeria-item__lupa") + legenda +
          "</span>" +
        "</button>"
      );
    }).join("");

    // Navegação do lightbox.
    var setaEsq = $("#lightboxPrev");
    var setaDir = $("#lightboxNext");
    var botaoFechar = $("#lightboxFechar");

    setaEsq.addEventListener("click", function () {
      updateLightbox((lightbox._index || 0) - 1, itens);
    });
    setaDir.addEventListener("click", function () {
      updateLightbox((lightbox._index || 0) + 1, itens);
    });
    botaoFechar.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") setaEsq.click();
      if (event.key === "ArrowRight") setaDir.click();
    });

    // Cliques nos itens da galeria (delegação).
    grid.addEventListener("click", function (event) {
      var botao = event.target.closest(".galeria-item");
      if (!botao) return;
      openLightbox(Number(botao.getAttribute("data-index")));
    });
  }

  /* ---------- 10. Depoimentos ---------- */

  function renderDepoimentos() {
    var grade = $("#depoimentosGrade");
    if (!grade) return;
    var itens = (config.depoimentos || []).filter(function (d) {
      return d && d.texto;
    });

    if (!itens.length) {
      hideSection("depoimentos");
      return;
    }
    showSection("depoimentos");

    grade.innerHTML = itens.map(function (item) {
      var inicial = (item.nome || "?").trim().charAt(0).toUpperCase();
      var servico = item.servico
        ? '<span class="depoimento-card__servico">' + escapeHtml(item.servico) + "</span>"
        : "";
      return (
        '<article class="depoimento-card" data-reveal>' +
          icon("aspas", "depoimento-card__aspas") +
          '<p class="depoimento-card__texto">' + escapeHtml(item.texto) + "</p>" +
          '<footer class="depoimento-card__autor">' +
            '<span class="depoimento-card__avatar" aria-hidden="true">' + escapeHtml(inicial) + "</span>" +
            "<div>" +
              '<strong>' + escapeHtml(item.nome || "Cliente") + "</strong>" +
              servico +
            "</div>" +
          "</footer>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------- 11. Horários ---------- */

  function renderHorarios() {
    var lista = $("#horariosLista");
    if (!lista) return;
    var funcionamento = config.funcionamento || {};
    var nomes = {
      segunda: "Segunda-feira",
      terca: "Terça-feira",
      quarta: "Quarta-feira",
      quinta: "Quinta-feira",
      sexta: "Sexta-feira",
      sabado: "Sábado",
      domingo: "Domingo"
    };

    var linhas = Object.keys(funcionamento).map(function (dia) {
      var valor = funcionamento[dia];
      if (!isFilled(valor)) return "";
      return (
        "<li>" +
          "<span>" + escapeHtml(nomes[dia] || dia) + "</span>" +
          "<strong>" + escapeHtml(valor) + "</strong>" +
        "</li>"
      );
    }).filter(Boolean).join("");

    var card = $("#horariosCard");
    if (!linhas) {
      if (card) card.hidden = true;
      return;
    }
    if (card) card.hidden = false;
    lista.innerHTML = linhas;
  }

  /* ---------- 12. Menu mobile / Header ---------- */

  function initMenu() {
    var botao = $("#menuToggle");
    var menu = $("#menuNavegacao");

    if (!botao || !menu) return;

    var textosNav = (config.textos && config.textos.navegacao) || {};
    var iconeMenu = botao.querySelector('[data-icone="menu"]');
    var iconeFechar = botao.querySelector('[data-icone="fechar"]');

    function atualizarEstado(aberto) {
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute("aria-label", aberto
        ? (textosNav.fecharMenu || "Fechar menu")
        : (textosNav.abrirMenu || "Abrir menu"));
      menu.classList.toggle("is-open", aberto);
      // Avisa ao header que o painel claro do menu está aberto (mobile),
      // para os ícones não ficarem claros sobre fundo claro.
      var cabecalho = $("#cabecalho");
      if (cabecalho) cabecalho.classList.toggle("menu-aberto", aberto);
      if (iconeMenu) iconeMenu.hidden = aberto;
      if (iconeFechar) iconeFechar.hidden = !aberto;
      document.body.classList.toggle("no-scroll", aberto);
    }

    atualizarEstado(false);

    botao.addEventListener("click", function () {
      atualizarEstado(botao.getAttribute("aria-expanded") !== "true");
    });

    // Fecha ao clicar em um link (bom para âncoras no mobile).
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) atualizarEstado(false);
    });

    // Fecha com Esc.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        botao.focus();
        atualizarEstado(false);
      }
    });
  }

  function initHeaderScroll() {
    var header = $("#cabecalho");
    if (!header) return;
    var aoRolar = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
  }

  /* ---------- 13. Animações de entrada ---------- */

  function initReveals() {
    var elementos = $$("[data-reveal]");
    if (!elementos.length) return;

    // Sem IntersectionObserver (navegadores muito antigos): mostra tudo.
    if (!("IntersectionObserver" in window)) {
      elementos.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    elementos.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 14. Boot ---------- */

  function init() {
    applyColors();
    applySeo();
    bindFixedTexts();

    lightbox = $("#lightbox");

    renderHero();
    renderMenus();
    renderServicos();
    renderDiferenciais();
    renderSobre();
    renderSobreDestaques();
    renderGaleria();
    renderDepoimentos();
    renderHorarios();

    initMenu();
    initHeaderScroll();
    initReveals();

    // Ícones estáticos escritos direto no HTML.
    $$("[data-icone]").forEach(function (el) {
      el.innerHTML = icon(el.getAttribute("data-icone"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
