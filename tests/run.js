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

/* ---------- Infraestrutura ---------- */

let falhas = 0;
const resultado = [];
const check = (ok, nome) => resultado.push([ok, nome]);

function montarSite(configOverride) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, "index.html"), "utf8"), {
    url: "https://exemplo.teste/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  const erros = [];
  w.addEventListener("error", (e) => erros.push(e.message));

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
check($("#heroTitulo").textContent.includes("cuidado e leveza"), "hero: título + destaque renderizados");
check($$(".servico-card").length === 9, "serviços: 9 cards");
check($$(".servicos-categoria").length === 2, "2 categorias (Salão de Beleza + Estética)");
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
check($(".navegacao__cta").textContent.includes("Agendar pelo WhatsApp"), "CTA do menu mobile com texto");
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
check($(".logo__nome").textContent === "Cantinho da Beleza", "logo em texto a partir do config");
check(site.doc.title.includes("Manhumirim"), "SEO: title aplicado");
check($(".rodape__base").textContent.includes(String(new Date().getFullYear())), "ano corrente no copyright");
check($(".whatsapp-flutuante").getAttribute("aria-label") === "Conversar no WhatsApp", "aria-label do botão flutuante");
check(
  site.doc.documentElement.style.getPropertyValue("--cor-primaria").trim() === "#b76e79",
  "paleta do config aplicada via CSS vars"
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
check(
  $A('.rodape__rede[aria-label="Instagram"]').getAttribute("href") === "https://instagram.com/studiovitoria",
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

/* ============================================================
   PARTE 3 — Robustez: config.js ausente
   ============================================================ */

const B = montarSite(null);
check(B.erros.length === 0, "sem config.js: sem crash");
check(B.doc.title.length > 0, "sem config.js: fallback do HTML preservado");

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
