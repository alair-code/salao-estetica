# Cantinho da Beleza — Template Profissional (Salão de Beleza & Estética)

Template comercial **reutilizável** em HTML5 + CSS3 + JavaScript puro (vanilla), sem frameworks e sem dependências. Visual premium, elegante e responsivo, pronto para ser adaptado a outros clientes alterando **apenas um arquivo**: `js/config.js`.

---

## ✨ O que o template inclui

- **One-page premium**: hero, sobre, serviços (por categoria), diferenciais, galeria com lightbox, depoimentos, localização com Google Maps, contato e rodapé completo.
- **Configuração 100% centralizada** em `js/config.js` — nome, telefone, WhatsApp, endereço, redes sociais, horários, serviços, galeria, depoimentos, textos e até a **paleta de cores**.
- **Seções auto-ocultáveis**: qualquer seção sem dados (depoimentos vazios, horários não informados, Instagram vazio...) desaparece automaticamente — o site nunca fica com "buracos".
- **Paleta personalizável por cliente** via `identidade.cores`, sem tocar no CSS.
- **Ícones SVG inline** embutidos no próprio `script.js` — zero bibliotecas externas.
- **Acessibilidade**: skip link, aria-labels, navegação por teclado (Esc/setas no lightbox e menu), contraste AA.
- **SEO configurável** via `config.seo` (title, description, Open Graph).
- **100% responsivo** (mobile-first, menu lateral no celular, breakpoints até 420px).

---

## 📁 Estrutura

```text
/
├── index.html          → estrutura das seções (não precisa editar)
├── css/
│   └── style.css       → tema visual (não precisa editar)
├── js/
│   ├── config.js       → ⭐ ÚNICO arquivo a editar para cada cliente
│   └── script.js       → lógica do site (não precisa editar)
├── assets/
│   └── images/         → logo, favicon e fotos da galeria
└── README.md
```

---

## 🚀 Como usar

### 1. Rodar o site

Basta abrir o `index.html` no navegador (duplo clique) ou servir a pasta:

```bash
# opcional — qualquer servidor estático serve:
python3 -m http.server 8080
```

### 2. Adaptar para um novo cliente

1. Duplique a pasta do template.
2. Edite **somente** `js/config.js` (guia completa abaixo).
3. Substitua `assets/images/` (logo, favicon, fotos reais da galeria).
4. Publique em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, HostGator...).

> **Não é preciso mexer em HTML, CSS ou script.js.** Campos deixados como `""` (vazio) ficam ocultos no site automaticamente.

---

## 🛠️ Guia rápido do `js/config.js`

| Bloco | Para que serve |
|---|---|
| `empresa` | Nome, nome curto (logo em texto), slogan, cidade, telefone, WhatsApp, endereço, referência e e-mail |
| `identidade` | Logo, favicon, Instagram, Facebook e **paleta de cores** (`identidade.cores`) |
| `contato` | Número de WhatsApp (só números, com DDI) e mensagem pré-preenchida |
| `funcionamento` | Horários por dia da semana — vazio oculta a linha |
| `seo` | Título e descrição no Google |
| `menu` | Itens do menu desktop/mobile e do rodapé (âncoras `#` ou URLs) |
| `hero` | Textos da primeira dobra + imagem de fundo opcional |
| `sobre` | Título, parágrafos e citação opcional |
| `servicos` | Categorias → itens, cada um com ícone |
| `diferenciais` | Cards dos pilares do atendimento |
| `galeria` | Fotos (caminho em `assets/images/`), título e descrição |
| `depoimentos` | Nome, texto e serviço; lista vazia oculta a seção |
| `rodape` | Frase curta exibida abaixo da logo no rodapé (vazio = oculta) |
| `textos` | Rótulos fixos da interface (etiquetas, botões, lightbox etc.) |

### Exemplo — trocar a identidade visual de outro cliente

```js
identidade: {
  logo: "assets/images/logo.png",
  favicon: "assets/images/favicon.png",
  instagram: "https://instagram.com/novocliente",
  facebook: "",
  cores: {
    primaria: "#7c9885",        // verde-sálvia
    primariaEscura: "#5f7a68",
    dourado: "#b08968",
    escura: "#1e2a24",
    fundo: "#faf7f2",
    fundoAlt: "#eef0ea",
    texto: "#3c443e"
  }
}
```

### Exemplo — horários e WhatsApp

```js
contato: {
  whatsapp: "5531999999999",   // 55 + DDD + número, apenas dígitos
  mensagemWhatsapp: "Olá! Vim pelo site e quero agendar."
},
funcionamento: {
  segunda: "09h às 18h",
  terca: "09h às 18h",
  quarta: "",
  quinta: "09h às 18h",
  sexta: "09h às 19h",
  sabado: "08h às 16h",
  domingo: ""
}
```

### Ícones disponíveis (serviços, diferenciais e destaques)

`tesoura` · `escova` · `hidratacao` · `coloracao` · `penteado` · `pele` · `sobrancelha` · `corpo` · `folha` · `coracao` · `estrela` · `brilho` · `atendimento`

---

## 🎨 Personalização avançada

- **Logo em texto**: se `identidade.logo` ficar vazio, o site usa `empresa.nomeCurto` + `empresa.slogan` como logotipo textual.
- **Imagem de fundo do hero**: preencha `hero.imagem` (ex.: `"assets/images/hero.jpg"`) e o template aplica um overlay escuro automaticamente.
- **Seções ocultas**: deixe `servicos: []`, `diferenciais: []`, `galeria: []`, `depoimentos: []`, `funcionamento` vazio — a seção correspondente some do site e o menu continua funcionando.

## 🧪 Testes automatizados

O template vem com uma suíte de testes headless (jsdom) que executa o site de verdade e valida renderização, links, interações (lightbox, menu mobile), ocultamento automático de seções vazias e o reuso por outro cliente:

```bash
npm install   # ou bun install (instala apenas o jsdom)
npm test      # ou bun run test
```

Saída esperada: `TODOS OS 54 TESTES PASSARAM`.

Se você alterar `js/script.js` ou o `index.html`, rode `npm test` antes de publicar. Quem apenas editar `js/config.js` não precisa dos testes — mas eles também validam o site do cliente atual.

## 🧩 Requisitos

Nenhum. Funciona offline, sem build, sem npm, sem frameworks — apenas arquivos estáticos.
