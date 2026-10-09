/* ============================================================
   TESTES DO TEMPLATE — execução headless com jsdom
   ------------------------------------------------------------
   Roda o site de verdade (index.html + config.js + script.js)
   em um DOM simulado e verifica a renderização e as interações.

   Uso:  npm install && npm test
   ============================================================ */

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const css = fs.readFileSync(path.join(root, "css", "style.css"), "utf8");

/* ---------- Infraestrutura ---------- */

let falhas = 0;
const resultado = [];
const check = (ok, nome) => resultado.push([ok, nome]);

function montarSite(configOverride, prepararWindow) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, "index.html"), "utf8"), {
    url: "https://exemplo.teste/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  const erros = [];
  w.addEventListener("error", (e) => erros.push(e.message));

  // jsdom não implementa matchMedia (usado no menu mobile). Em navegadores
  // reais a API sempre existe; aqui simulamos viewport desktop.
  if (typeof w.matchMedia !== "function") {
    w.matchMedia = () => ({
      matches: false,
      media: "",
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    });
  }

  if (typeof prepararWindow === "function") prepararWindow(w);

  if (configOverride !== null) {
    // Simula o js/config.js (do cliente atual ou de outro cliente)
    w.eval(configOverride);
  }
  w.eval(fs.readFileSync(path.join(root, "js", "script.js"), "utf8"));
  w.document.dispatchEvent(new w.Event("DOMContentLoaded", { bubbles: true }));

  return { w, doc: w.document, erros };
}

// Carrega o config real do template
const sandbox = {};
require("vm").createContext(sandbox);
const config = require("vm").runInContext(
  fs.readFileSync(path.join(root, "js", "config.js"), "utf8") + "\n;siteConfig;",
  sandbox
);

const configReal = fs.readFileSync(path.join(root, "js", "config.js"), "utf8");

/* ============================================================
   PARTE 1 — Site com o config do Cantinho da Beleza
   ============================================================ */

const site = montarSite(configReal);
const $ = (s) => site.doc.querySelector(s);
const $$ = (s) => [...site.doc.querySelectorAll(s)];

check(site.erros.length === 0, "sem erros de runtime");
check(
  [
    ".whatsapp-flutuante",
    '.rodape__rede[aria-label="Instagram"]',
    '.rodape__rede[aria-label="Facebook"]',
    '.rodape__rede[aria-label="WhatsApp"]',
  ].every((seletor) => {
    const elemento = site.doc.querySelector(seletor);
    return elemento && elemento.querySelector("[data-icone] svg.icon");
  }),
  "ícones do WhatsApp flutuante e das redes sociais são renderizados"
);
check(
  [...site.doc.querySelectorAll("[data-icone]")].every((elemento) => elemento.querySelector("svg.icon")),
  "todos os ícones estáticos possuem SVG após a inicialização"
);
check(
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation:\s*none\s*!important/.test(css) &&
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition-duration:\s*0\.01ms\s*!important/.test(css) &&
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition-delay:\s*0s\s*!important/.test(css),
  "acessibilidade: movimento reduzido desativa animações e elimina atrasos de transição"
);
check(
  /@media \(max-width: 420px\)[\s\S]*?\.hero__titulo[\s\S]*?font-size:\s*clamp\(2\.2rem, 10vw, 2\.6rem\)/.test(css),
  "responsividade: título do hero ajusta a tipografia em telas estreitas"
);
check(
  /\.hero\s*\{[^}]*min-height:\s*100vh;[^}]*min-height:\s*100svh;/s.test(css),
  "hero: altura de viewport tem fallback 100vh antes de 100svh"
);
check(
  /@keyframes hero-pan-lateral[\s\S]*?translateX\(-1\.2%\)[\s\S]*?translateX\(1\.2%\)/.test(css) &&
    /\.hero--movimento-lateral\.hero--com-imagem::after[\s\S]*?inset:\s*-7%[\s\S]*?animation:\s*hero-pan-lateral/.test(css),
  "hero: movimento lateral é suave e mantém a camada ampliada para evitar bordas vazias"
);
check(
  /\.hero--movimento-desativado\.hero--com-imagem::after[\s\S]*?animation:\s*none/.test(css),
  "hero: movimento pode ser desativado sem remover a imagem"
);
check(
  /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?animation:\s*none\s*!important/.test(css),
  "hero: CSS desativa animações com movimento reduzido"
);
check(
  /\.hero\s*\{[\s\S]{0,900}color-mix\(in srgb, var\(--cor-primaria\)/.test(css) &&
    /color-mix\(in srgb, var\(--cor-dourado\)/.test(css) &&
    /@supports not \(color: color-mix\(in srgb, #000 50%, transparent\)\)[\s\S]*?\.hero:not\(\.hero--com-imagem\)\s*\{\s*background:\s*var\(--cor-escura\)/.test(css),
  "hero: gradientes acompanham a paleta configurada e têm fallback sem color-mix"
);
check($("#heroTitulo").textContent.includes("toque de cuidado"), "hero: título + destaque renderizados");
check(
  $("#inicio").classList.contains("hero--com-slides") &&
    $$("#inicio .hero__slide").length === 2 &&
    $$("#inicio .hero__slide").every((slide) => slide.style.backgroundImage.includes("images.unsplash.com")),
  "hero: configuração publicada ativa duas fotos demonstrativas para a transição visual"
);
const configMovimentoLateral = configReal
  .replace(/(\n    imagem: ")[^"]*(")/, '$1assets/images/hero.jpg$2')
  .replace(/    imagens: \[[\s\S]*?\n    \],/, '    imagens: [],')
  .replace('movimento: "zoom"', 'movimento: "lateral"');
const siteMovimentoLateral = montarSite(configMovimentoLateral);
const configDuasImagens = configReal
  .replace(/(\n    imagem: ")[^"]*(")/, '$1$2')
  .replace(/    imagens: \[[\s\S]*?\n    \],/, '    imagens: ["assets/images/hero-1.jpg", "assets/images/hero-2.jpg"],');
const siteDuasImagens = montarSite(configDuasImagens);
check(
  siteDuasImagens.doc.querySelector("#inicio").classList.contains("hero--com-slides") &&
    siteDuasImagens.doc.querySelectorAll(".hero__slide").length === 2,
  "hero: duas imagens opcionais criam camadas para crossfade"
);
check(
  siteDuasImagens.doc.querySelector(".hero__slide.is-primeiro").style.backgroundImage.includes("hero-1.jpg") &&
    siteDuasImagens.doc.querySelector(".hero__slide.is-segundo").style.backgroundImage.includes("hero-2.jpg"),
  "hero: imagens configuradas são aplicadas às camadas na ordem correta"
);
const configUmaImagemLista = configReal
  .replace(/(\n    imagem: ")[^"]*(")/, '$1$2')
  .replace(/    imagens: \[[\s\S]*?\n    \],/, '    imagens: ["assets/images/hero-1.jpg"],');
const siteUmaImagemLista = montarSite(configUmaImagemLista);
check(
  !siteUmaImagemLista.doc.querySelector("#inicio").classList.contains("hero--com-slides") &&
    siteUmaImagemLista.doc.querySelectorAll(".hero__slide").length === 0 &&
    siteUmaImagemLista.doc.querySelector("#inicio").classList.contains("hero--com-imagem") &&
    siteUmaImagemLista.doc.querySelector("#inicio").style.getPropertyValue("--hero-imagem").includes("hero-1.jpg"),
  "hero: lista com uma imagem usa capa estática quando hero.imagem está vazio"
);
const configImagemLegadaComListaUnica = configReal
  .replace(/(\n    imagem: ")[^"]*(")/, '$1assets/images/capa-legada.jpg$2')
  .replace(/    imagens: \[[\s\S]*?\n    \],/, '    imagens: ["assets/images/hero-1.jpg"],');
const siteImagemLegadaComListaUnica = montarSite(configImagemLegadaComListaUnica);
check(
  siteImagemLegadaComListaUnica.doc.querySelector("#inicio").style.getPropertyValue("--hero-imagem").includes("capa-legada.jpg"),
  "hero: imagem legada tem prioridade quando a lista opcional contém apenas uma imagem"
);
check(
  /@keyframes hero-crossfade-primeiro/.test(css) &&
    /@keyframes hero-crossfade-segundo/.test(css) &&
    /\.hero__slide\.is-primeiro\s*\{[^}]*hero-zoom-cinematico/.test(css) &&
    /\.hero--movimento-lateral\.hero--com-slides \.hero__slide\.is-primeiro\s*\{[^}]*hero-pan-lateral/.test(css) &&
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.hero--com-slides \.hero__slide[\s\S]*?animation:\s*none !important/.test(css),
  "hero: crossfade combina zoom/lateral e respeita movimento reduzido"
);
const siteSlidesSemMovimento = montarSite(
  configDuasImagens.replace('movimento: "zoom"', 'movimento: "nenhum"')
);
check(
  siteSlidesSemMovimento.doc.querySelector("#inicio").classList.contains("hero--movimento-desativado") &&
    /\.hero--movimento-desativado\.hero--com-slides \.hero__slide[\s\S]*?animation:\s*none/.test(css) &&
    /\.hero--movimento-desativado\.hero--com-slides \.hero__slide\.is-primeiro[\s\S]*?opacity:\s*1/.test(css),
  "hero: movimento nenhum mantém a primeira imagem estática no modo slides"
);
check(
  !siteDuasImagens.doc.querySelector(".hero__slide").style.backgroundImage.includes("color-mix") &&
    /@supports not \(color:\s*color-mix/.test(css) &&
    /\.hero__slide::after[\s\S]*?background:[\s\S]*?var\(--cor-escura\)/.test(css),
  "hero: imagens e gradiente têm fallback para navegadores sem color-mix"
);
check(
  /\.hero--com-slides \.hero__slide\s*\{\s*background-position:\s*64% center/.test(css),
  "hero: enquadramento das imagens é ajustado em telas pequenas"
);
check(
  siteMovimentoLateral.doc.querySelector("#inicio").classList.contains("hero--movimento-lateral") &&
    siteMovimentoLateral.doc.querySelector("#inicio").classList.contains("hero--com-imagem"),
  "hero: configuração lateral ativa a alternativa somente quando há imagem configurada"
);
const configMovimentoDesativado = configMovimentoLateral.replace('movimento: "lateral"', 'movimento: "nenhum"');
const siteMovimentoDesativado = montarSite(configMovimentoDesativado);
check(
  siteMovimentoDesativado.doc.querySelector("#inicio").classList.contains("hero--movimento-desativado") &&
    siteMovimentoDesativado.doc.querySelector("#inicio").classList.contains("hero--com-imagem"),
  "hero: movimento desativado mantém a camada de imagem"
);
const configMovimentoLegado = configReal.replace(/\n\s*movimento: "zoom"/, "");
const siteMovimentoLegado = montarSite(configMovimentoLegado);
check(
  siteMovimentoLegado.doc.querySelector("#inicio").classList.contains("hero--movimento-zoom"),
  "hero: configuração antiga sem movimento mantém zoom padrão"
);
const configMovimentoInvalido = configReal.replace('movimento: "zoom"', 'movimento: "invalido"');
const siteMovimentoInvalido = montarSite(configMovimentoInvalido);
check(
  siteMovimentoInvalido.doc.querySelector("#inicio").classList.contains("hero--movimento-zoom"),
  "hero: valor de movimento inválido retorna ao zoom seguro"
);
check($(".hero__etiqueta").textContent.trim().length > 0, "hero: etiqueta permanece disponível");
check($(".hero__descricao").textContent.trim().length > 0, "hero: descrição permanece disponível");
check($$(".hero__acoes .botao").length === 2, "hero: CTAs preservados");
const siteSemAnimacao = montarSite(configReal, (w) => {
  w.Element.prototype.animate = undefined;
});
check(siteSemAnimacao.erros.length === 0, "hero: sem erro quando a API de animação não existe");
check(
  siteSemAnimacao.doc.querySelector("#heroTitulo").textContent.trim().length > 0 &&
  siteSemAnimacao.doc.querySelectorAll(".hero__acoes .botao").length === 2,
  "hero: conteúdo e CTAs permanecem disponíveis sem a API de animação"
);
const chamadasAnimacao = [];
const siteAnimado = montarSite(configReal, (w) => {
  w.Element.prototype.animate = function (keyframes, options) {
    chamadasAnimacao.push({ elemento: this.className, keyframes, options });
    return {};
  };
});
check(siteAnimado.erros.length === 0, "hero: animação não gera erro de runtime");
check(chamadasAnimacao.length === 4, "hero: anima os quatro grupos de conteúdo quando a API está disponível");
check(
  chamadasAnimacao.map((item) => item.options.delay).join(",") === "0,90,180,270",
  "hero: entrada em sequência com atrasos curtos"
);
const siteAnimacaoFalha = montarSite(configReal, (w) => {
  w.Element.prototype.animate = function () {
    throw new Error("Falha simulada da Web Animations API");
  };
});
check(siteAnimacaoFalha.erros.length === 0, "hero: falha da API de animação não gera erro de runtime");
check(
  !siteAnimacaoFalha.doc.querySelector("#heroTitulo").hidden &&
    !siteAnimacaoFalha.doc.querySelector(".hero__acoes .botao--whatsapp").hidden,
  "hero: conteúdo e CTA permanecem visíveis quando a animação falha"
);
const chamadasMovimentoReduzido = [];
montarSite(configReal, (w) => {
  w.matchMedia = (query) => ({ matches: query.includes("prefers-reduced-motion"), media: query });
  w.Element.prototype.animate = function () { chamadasMovimentoReduzido.push(this); return {}; };
});
check(chamadasMovimentoReduzido.length === 0, "hero: respeita prefers-reduced-motion");
check($$(".servico-card").length === 15, "serviços: 15 cards (massoterapia + salão + estética)");
check($$(".servicos-categoria").length === 3, "3 categorias (Massoterapia + Salão + Estética)");
check(!$("#servicos").hidden, "seção #servicos visível");
check(
  $$(".servico-card__cta").every((a) => a.href.startsWith("https://wa.me/5533984368440")),
  "CTA dos cards apontam ao WhatsApp configurado"
);
check($$(".galeria-item").length === 6, "galeria: 6 itens");
check(!$("#galeria").hidden, "seção #galeria visível");
check($("#depoimentos").hidden === true, "depoimentos vazio → seção oculta");
check($("#horariosCard").hidden === true, "horários vazios → card oculto");
check($$(".diferencial-card").length === 5, "diferenciais: 5 cards");
check($$(".navegacao__link").length === 6, "menu: 6 links a partir do config");
check($$("#rodapeMenu li").length === 6, "rodapé: menu espelhado");
check($(".navegacao__cta").textContent.includes("Quero agendar minha sessão"), "CTA do menu mobile com texto");
check($(".navegacao__cta").href.startsWith("https://wa.me/5533984368440"), "CTA do menu com link WhatsApp");
check(
  $$('[data-href="whats"]').every((a) => a.href.startsWith("https://wa.me/5533984368440")),
  "links WhatsApp gerados (" + $$('[data-href="whats"]').length + ")"
);
check(
  $$('[data-href="maps"]').every(
    (a) => a.href === config.empresa.mapsLink || a.href.includes("google.com/maps")
  ),
  "links Maps gerados (" + $$('[data-href="maps"]').length + ") com o link oficial do lugar"
);
check(
  $$('[data-href="maps"]').every((a) => a.href === config.empresa.mapsLink),
  "mapsLink do config tem prioridade sobre a busca por endereço"
);
check(
  $$('[data-href="tel"]').every((a) => a.href.startsWith("tel:+5533")),
  "links tel: com DDI 55 (não discar DDI errado)"
);
check(
  $$('[data-href="instagram"]').length >= 2 &&
    $$('[data-href="instagram"]').every((a) => a.href.includes("andreia_massoterapia_estetica")),
  "Instagram no rodapé e no contato com o perfil da Andreia"
);
check(site.doc.title.includes("Manhumirim"), "SEO: title aplicado");
check($(".rodape__base").textContent.includes(String(new Date().getFullYear())), "ano corrente no copyright");
check($(".whatsapp-flutuante").getAttribute("aria-label") === "Conversar no WhatsApp", "aria-label do botão flutuante");
check(
  site.doc.documentElement.style.getPropertyValue("--cor-primaria").trim() === "#b76e79",
  "paleta do config aplicada via CSS vars"
);
const configSemImagem = configReal
  .replace(/(\n    imagem: ")[^"]*(")/, '$1$2')
  .replace(/    imagens: \[[\s\S]*?\n    \],/, '    imagens: [],');
const siteSemImagem = montarSite(configSemImagem);
check(!siteSemImagem.doc.querySelector("#inicio").classList.contains("hero--com-imagem"), "hero sem imagem mantém fundo alternativo");
check(
  !$("#inicio").style.getPropertyValue("--hero-imagem"),
  "hero sem imagem não cria camada de mídia"
);

// Interações: lightbox
$(".galeria-item").click();
check($("#lightbox").classList.contains("is-open"), "lightbox abre ao clicar na foto");
check($("#lightboxImg").src.includes("galeria-01.svg"), "lightbox carrega a imagem correta");
check($("#lightboxContador").textContent === "1 / 6", "contador do lightbox: 1 / 6");
$("#lightboxFechar").click();
check(!$("#lightbox").classList.contains("is-open"), "lightbox fecha pelo botão");

// Interações: menu mobile
$("#menuToggle").click();
check($("#menuNavegacao").classList.contains("is-open"), "menu mobile abre");
check($("#menuToggle").getAttribute("aria-expanded") === "true", "aria-expanded do toggle correto");
$("#menuToggle").click();
check(!$("#menuNavegacao").classList.contains("is-open"), "menu mobile fecha");

/* ============================================================
   PARTE 2 — Reuso: "outro cliente" editando só o config
   ============================================================ */

const configCliente2 = `
var siteConfig = {
  empresa: { nome: "Studio Vitória Estética", nomeCurto: "Studio Vitória", slogan: "Estética & Bem-estar",
    cidade: "Viçosa - MG", telefone: "+5531988887777", whatsapp: "5531988887777",
    endereco: "Rua das Flores, 100 - Centro, Viçosa - MG", referencia: "", email: "contato@studiovitoria.com" },
  identidade: { logo: "assets/images/logo.png", favicon: "", instagram: "https://instagram.com/studiovitoria",
    facebook: "", cores: { primaria: "#7c9885", primariaEscura: "#5f7a68", dourado: "#b08968",
      escura: "#1e2a24", fundo: "#faf7f2", fundoAlt: "#eef0ea", texto: "#3c443e" } },
  contato: { whatsapp: "5531988887777", mensagemWhatsapp: "Olá, Studio Vitória!" },
  funcionamento: { segunda: "09h às 18h", terca: "", quarta: "09h às 18h", quinta: "", sexta: "09h às 19h", sabado: "08h às 12h", domingo: "" },
  seo: { titulo: "Studio Vitória | Estética em Viçosa", descricao: "Estética em Viçosa - MG." },
  menu: [ { texto: "Início", link: "#inicio" }, { texto: "Contato", link: "#contato" } ],
  hero: { etiqueta: "Estética & Bem-estar", titulo: "Seu momento de", destaque: "bem-estar",
    descricao: "Cuidados estéticos em Viçosa.", textoBotaoPrimario: "Agendar agora",
    textoBotaoSecundario: "Conhecer", imagem: "assets/images/hero.jpg" },
  sobre: { titulo: "Sobre o Studio", paragrafos: ["Parágrafo único."], citacao: "" },
  servicos: [],
  diferenciais: [ { titulo: "Professoras qualificadas", descricao: "", icone: "estrela" } ],
  galeria: [ { imagem: "assets/images/galeria-01.svg", titulo: "Recepção", descricao: "" } ],
  depoimentos: [ { nome: "Ana P.", texto: "Amei o atendimento!", servico: "Limpeza de pele" } ],
  rodape: { mensagem: "Desde 2010 cuidando de você." },
  textos: {}
};
`;

const A = montarSite(configCliente2);
const $A = (s) => A.doc.querySelector(s);
const $$A = (s) => [...A.doc.querySelectorAll(s)];

check(A.erros.length === 0, "outro cliente: sem erros de runtime");
check($A("#heroTitulo").textContent.includes("bem-estar"), "outro cliente: título renderizado");
check($A(".logo__nome").textContent === "Studio Vitória", "outro cliente: nome aplicado");
check($A("title").textContent === "Studio Vitória | Estética em Viçosa", "outro cliente: SEO aplicado");
check($A(".logo__img").src.includes("logo.png") && !$A(".logo__img").hidden, "outro cliente: logo configurada aparece");
check(
  A.doc.documentElement.style.getPropertyValue("--cor-primaria").trim() === "#7c9885",
  "outro cliente: paleta personalizada aplicada"
);
check($A("#servicos").hidden, "outro cliente: sem serviços → seção oculta");
check($A(".botao--contorno").getAttribute("href") === "#contato", "outro cliente: botão do hero cai no #contato");
check(!$A("#diferenciais").hidden && $$A(".diferencial-card").length === 1, "outro cliente: 1 diferencial renderizado");
check(!$A("#galeria").hidden && $$A(".galeria-item").length === 1, "outro cliente: galeria com 1 foto");
check(!$A("#depoimentos").hidden, "outro cliente: depoimento → seção visível");
check($A(".depoimento-card__avatar").textContent === "A", "outro cliente: avatar com inicial do nome");
check($A("#horariosLista").querySelectorAll("li").length === 4, "outro cliente: só os dias preenchidos na lista");
check(!$A("#horariosCard").hidden, "outro cliente: card de horários visível");
check($A(".rodape__mensagem").textContent === "Desde 2010 cuidando de você.", "outro cliente: mensagem do rodapé");
check($A(".hero__descricao").textContent.includes("Viçosa"), "outro cliente: copy própria aplicada");
check(
  $$A('[data-href="instagram"]').every((a) => a.href === "https://instagram.com/studiovitoria"),
  "todos os links de Instagram (rodapé + contato) apontam ao perfil"
);
check(
  $A(".rodape__rede[aria-label=\"Instagram\"]").getAttribute("href") === "https://instagram.com/studiovitoria",
  "outro cliente: Instagram visível e correto"
);
check($A('.rodape__rede[aria-label="Facebook"]').hidden === true, "outro cliente: Facebook sem config → oculto");
check(
  $$A('[data-href="whats"]').every((a) => a.href.startsWith("https://wa.me/5531988887777")),
  "outro cliente: WhatsApp próprio + mensagem"
);
check(
  $$A('[data-href="tel"]').every((a) => a.href === "tel:+5531988887777"),
  "outro cliente: tel: com DDI explícito preservado"
);
check($$A('[data-href="email"]').every((a) => a.href === "mailto:contato@studiovitoria.com"), "outro cliente: e-mail gerado");
check($$A(".navegacao__link").length === 2, "outro cliente: menu próprio (2 itens)");
check($A("#inicio").classList.contains("hero--com-imagem"), "outro cliente: imagem de fundo do hero aplicada");
check(
  $A("#inicio").style.getPropertyValue("--hero-imagem").includes("hero.jpg"),
  "outro cliente: imagem configurada é passada à camada visual do hero"
);

/* ============================================================
   PARTE 3 — Robustez: config.js ausente
   ============================================================ */

const B = montarSite(null);
check(B.erros.length === 0, "sem config.js: sem crash");
check(B.doc.title.length > 0, "sem config.js: fallback do HTML preservado");

const configHeroVazio = configReal.replace(
  /hero: \{[\s\S]*?imagem: ""[\s\S]*?movimento: "[^"]+"[^\n]*\n\s*\}/,
  'hero: { etiqueta: "", titulo: "", destaque: "", descricao: "", textoBotaoPrimario: "", textoBotaoSecundario: "", imagem: "   " }'
);
const animacoesHeroVazio = [];
const siteHeroVazio = montarSite(configHeroVazio, (w) => {
  w.Element.prototype.animate = function () { animacoesHeroVazio.push(this); return {}; };
});
check(siteHeroVazio.erros.length === 0, "hero opcional: sem erro de runtime");
check(siteHeroVazio.doc.querySelector(".hero__etiqueta").hidden, "hero opcional: etiqueta vazia oculta");
check(siteHeroVazio.doc.querySelector("#heroTitulo").hidden, "hero opcional: título vazio oculto");
check(siteHeroVazio.doc.querySelector(".hero__descricao").hidden, "hero opcional: descrição vazia oculta");
check(siteHeroVazio.doc.querySelector(".hero__acoes").hidden, "hero opcional: ações vazias ocultas");
check(animacoesHeroVazio.length === 0, "hero opcional: campos ocultos não recebem animação");
check(
  !siteHeroVazio.doc.querySelector("#inicio").classList.contains("hero--com-imagem") &&
    !siteHeroVazio.doc.querySelector("#inicio").style.getPropertyValue("--hero-imagem"),
  "hero opcional: imagem vazia mantém o fallback"
);

const configSemWhatsApp = configReal.replace(
  /(contato:\s*\{\s*whatsapp:\s*)"5533984368440"/,
  '$1""'
);
const siteSemWhatsAppHero = montarSite(configSemWhatsApp);
check(siteSemWhatsAppHero.erros.length === 0, "hero sem WhatsApp: sem erro de runtime");
check(
  siteSemWhatsAppHero.doc.querySelector(".hero__acoes .botao--whatsapp").hidden,
  "hero sem WhatsApp: CTA principal oculto para evitar link sem destino"
);
check(
  !siteSemWhatsAppHero.doc.querySelector(".hero__acoes .botao--contorno").hidden &&
    !siteSemWhatsAppHero.doc.querySelector(".hero__acoes").hidden,
  "hero sem WhatsApp: botão secundário continua disponível"
);

/* ---------- Saída ---------- */

let total = 0;
for (const [ok, nome] of resultado) {
  if (!ok) falhas++;
  total++;
  console.log((ok ? "✅" : "❌") + " " + nome);
}
console.log(
  falhas === 0
    ? "\n=== TODOS OS " + total + " TESTES PASSARAM ==="
    : "\n=== " + falhas + " FALHA(S) de " + total + " ==="
);
process.exit(falhas === 0 ? 0 : 1);
