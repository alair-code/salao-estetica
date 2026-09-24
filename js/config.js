/* ============================================================
   CANTINHO DA BELEZA — ARQUIVO DE CONFIGURAÇÃO DO CLIENTE
   ------------------------------------------------------------
   ⭐ Este é o ÚNICO arquivo que você precisa editar para
      adaptar o template a um novo cliente.

   Como usar:
   1. Altere os textos, telefones, serviços e fotos abaixo.
   2. Salve o arquivo. O site se ajusta automaticamente.
   3. Não é preciso mexer no index.html, style.css ou script.js.

   Observações:
   • Campos com "" (vazio) ficam ocultos no site automaticamente.
   • Não apague as chaves — apenas altere ou deixe vazias.
   ============================================================ */

// "var" (e não const) para o config ficar acessível em window.siteConfig —
// declarações const/let no escopo global não criam propriedades no window.
var siteConfig = {

  /* ---------- 1. DADOS DA EMPRESA ---------- */
  empresa: {
    nome: "Salão e Estética Cantinho da Beleza",
    nomeCurto: "Cantinho da Beleza",            // usado no header e footer
    slogan: "Salão de Beleza & Estética",
    cidade: "Manhumirim - MG",
    telefone: "(33) 98436-8440",
    whatsapp: "5533984368440",                  // apenas números, com DDI (55) + DDD
    endereco: "Av. Padre Júlio Maria, 25 - Centro, Manhumirim - MG, 36970-000",
    referencia: "Em cima da Loja da Margarida",
    email: "",                                   // opcional

    // Link direto do Google Maps (botão "Compartilhar > Copiar link" do lugar).
    // Vazio = o site gera a rota automaticamente a partir do endereço.
    mapsLink: "https://maps.app.goo.gl/ocMxSTeCDn7E89Ps5"
  },

  /* ---------- 2. IDENTIDADE VISUAL ---------- */
  identidade: {
    logo: "",                                   // ex.: "assets/images/logo.png" — vazio = usa o nome em texto
    favicon: "assets/images/favicon.svg",
    instagram: "",                              // ex.: "https://instagram.com/seuperfil"
    facebook: "",                               // ex.: "https://facebook.com/suapagina"

    // Paleta de cores do site (personalizável por cliente).
    // Deixe o objeto vazio ({}) para usar o tema padrão do template.
    cores: {
      primaria: "#b76e79",                      // rosa-gold (botões, destaques)
      primariaEscura: "#9a5560",                // tom escuro da primária (hover)
      dourado: "#c8a15a",                       // detalhes finos (linhas, ícones)
      escura: "#231b16",                        // fundo do header/footer
      fundo: "#faf6f1",                         // fundo claro do site
      fundoAlt: "#f2e9e2",                      // fundo de seções alternadas
      texto: "#453931"                          // cor dos textos
    }
  },

  /* ---------- 3. CONTATO / WHATSAPP ---------- */
  contato: {
    whatsapp: "5533984368440",                  // apenas números, com DDI + DDD
    mensagemWhatsapp: "Olá! Gostaria de conhecer os serviços e agendar um horário."
  },

  /* ---------- 4. HORÁRIO DE FUNCIONAMENTO ---------- */
  // Preencha apenas com o que o cliente informar. Vazio = linha oculta.
  // Ex.: segunda: "08h às 18h"
  funcionamento: {
    segunda: "",
    terca: "",
    quarta: "",
    quinta: "",
    sexta: "",
    sabado: "",
    domingo: ""
  },

  /* ---------- 5. SEO (título e descrição no Google) ---------- */
  seo: {
    titulo: "Salão e Estética Cantinho da Beleza | Manhumirim - MG",
    descricao: "Salão de beleza e estética em Manhumirim - MG. Cabelo, estética facial e corporal em um ambiente acolhedor. Agende pelo WhatsApp (33) 98436-8440."
  },

  /* ---------- 5a. MENU DE NAVEGAÇÃO ---------- */
  // Links são âncoras (#) das seções ou URLs completas (https://...).
  menu: [
    { texto: "Início", link: "#inicio" },
    { texto: "Sobre", link: "#sobre" },
    { texto: "Serviços", link: "#servicos" },
    { texto: "Galeria", link: "#galeria" },
    { texto: "Localização", link: "#localizacao" },
    { texto: "Contato", link: "#contato" }
  ],

  /* ---------- 6. HERO (primeira dobra) ---------- */
  hero: {
    etiqueta: "Salão de Beleza & Estética",
    titulo: "Onde a sua beleza recebe",
    destaque: "cuidado e leveza",               // palavra(s) destacadas no título
    descricao: "Um espaço pensado para valorizar a sua autoestima, com atendimento acolhedor e serviços de cabelo e estética em Manhumirim - MG.",
    textoBotaoPrimario: "Agendar pelo WhatsApp",
    textoBotaoSecundario: "Conhecer os serviços",
    imagem: ""                                  // opcional: "assets/images/hero.jpg" como fundo
  },

  /* ---------- 7. SOBRE ---------- */
  sobre: {
    titulo: "Um espaço de cuidado e beleza",
    paragrafos: [
      "O Cantinho da Beleza foi criado para ser mais do que um salão: é um lugar onde cada cliente é recebida com atenção, carinho e respeito pelo seu tempo.",
      "Aqui, beleza e bem-estar caminham juntos. Dos cuidados com os cabelos aos procedimentos de estética, cada detalhe é pensado para que você saia se sentindo ainda melhor."
    ],
    citacao: "Beleza é se sentir bem na própria pele."   // opcional — vazio oculta
  },

  /* ---------- 8. SERVIÇOS ---------- */
  // Cada categoria gera um grupo de cards. Itens com nome e descrição curta.
  // Ícones disponíveis: tesoura, escova, hidratacao, coloracao, penteado,
  // pele, sobrancelha, corpo, folha, coracao, estrela, brilho, atendimento
  servicos: [
    {
      categoria: "Salão de Beleza",
      descricao: "Cuidados completos com os cabelos, do corte ao acabamento.",
      itens: [
        { nome: "Corte", descricao: "Cortes personalizados para o seu estilo e tipo de fio.", icone: "tesoura" },
        { nome: "Escova", descricao: "Finalizações com movimento, volume e brilho.", icone: "escova" },
        { nome: "Hidratação", descricao: "Tratamentos que devolvem saúde e maciez ao fio.", icone: "hidratacao" },
        { nome: "Coloração", descricao: "Cor, luzes e matização com técnica e cuidado.", icone: "coloracao" },
        { nome: "Penteados", descricao: "Penteados para festas, formaturas e ocasiões especiais.", icone: "penteado" }
      ]
    },
    {
      categoria: "Estética",
      descricao: "Procedimentos faciais e corporais para o seu bem-estar.",
      itens: [
        { nome: "Limpeza de pele", descricao: "Remoção de impurezas e renovação da pele do rosto.", icone: "pele" },
        { nome: "Procedimentos faciais", descricao: "Cuidados que realçam e revitalizam a pele.", icone: "brilho" },
        { nome: "Cuidados corporais", descricao: "Relaxamento e cuidados que valorizam o corpo.", icone: "corpo" },
        { nome: "Design de sobrancelhas", descricao: "Formato que harmoniza e valoriza o olhar.", icone: "sobrancelha" }
      ]
    }
  ],

  /* ---------- 9. DIFERENCIAIS ---------- */
  // Cards com os pilares do atendimento. Itens vazios [] ocultam a seção.
  diferenciais: [
    { titulo: "Atendimento personalizado", descricao: "Cada cliente é atendida de forma única, no seu ritmo.", icone: "atendimento" },
    { titulo: "Cuidado", descricao: "Atenção a cada detalhe, do primeiro contato ao resultado.", icone: "coracao" },
    { titulo: "Beleza", descricao: "Técnicas que realçam a beleza natural de cada pessoa.", icone: "estrela" },
    { titulo: "Bem-estar", descricao: "Um ambiente leve e acolhedor para relaxar.", icone: "folha" },
    { titulo: "Qualidade", descricao: "Compromisso com um serviço bem feito, sempre.", icone: "brilho" }
  ],

  /* ---------- 10. GALERIA ---------- */
  // Coloque as fotos em assets/images/ e adicione os itens abaixo.
  // Dica: use imagens quadradas ou verticais (proporção 4:5) para melhor resultado.
  galeria: [
    { imagem: "assets/images/galeria-01.svg", titulo: "Nosso espaço", descricao: "Um ambiente pensado para o seu conforto." },
    { imagem: "assets/images/galeria-02.svg", titulo: "Beleza e cuidado", descricao: "" },
    { imagem: "assets/images/galeria-03.svg", titulo: "Detalhes que encantam", descricao: "Cada atendimento com atenção especial." },
    { imagem: "assets/images/galeria-04.svg", titulo: "Ambiente acolhedor", descricao: "" },
    { imagem: "assets/images/galeria-05.svg", titulo: "Cuidados com você", descricao: "Estética facial e corporal." },
    { imagem: "assets/images/galeria-06.svg", titulo: "Toque final", descricao: "" }
  ],

  /* ---------- 11. DEPOIMENTOS ---------- */
  // Enquanto a lista estiver vazia, a seção fica oculta automaticamente.
  // Exemplo:
  // depoimentos: [
  //   { nome: "Maria S.", texto: "Amei o atendimento, saí me sentindo outra pessoa!", servico: "Escova" }
  // ]
  depoimentos: [],

  /* ---------- 12. RODAPÉ ---------- */
  // Frase curta exibida abaixo da logo no rodapé. Vazio = oculta.
  rodape: {
    mensagem: ""
  },

  /* ---------- 13. TEXTOS FIXOS DAS SEÇÕES ---------- */
  // Rótulos e frases da interface. Deixe "" para ocultar o elemento.
  textos: {
    navegacao: {
      aria: "Navegação principal",
      abrirMenu: "Abrir menu",
      fecharMenu: "Fechar menu"
    },
    hero: {
      cidadePrefixo: "Salão e estética em"          // ex.: "Salão e estética em Manhumirim - MG"
    },
    sobre: {
      etiqueta: "Sobre nós",
      destaques: [
        { texto: "Atendimento personalizado", icone: "atendimento" },
        { texto: "Ambiente acolhedor", icone: "folha" },
        { texto: "Serviços de qualidade", icone: "brilho" }
      ]
    },
    servicos: {
      etiqueta: "Serviços",
      titulo: "Nossos serviços",
      descricao: "Escolha o cuidado ideal para você e agende pelo WhatsApp.",
      ctaCard: "Agendar"                            // link de WhatsApp dentro de cada card
    },
    diferenciais: {
      etiqueta: "Diferenciais",
      titulo: "Por que nos escolher"
    },
    galeria: {
      etiqueta: "Galeria",
      titulo: "Nossos trabalhos e espaço",
      descricao: "Toque nas fotos para ampliar."
    },
    depoimentos: {
      etiqueta: "Depoimentos",
      titulo: "O que dizem nossas clientes"
    },
    localizacao: {
      etiqueta: "Localização",
      tituloVisita: "Visite nosso espaço",
      horarioTitulo: "Horário de funcionamento",
      telefoneTitulo: "Telefone e WhatsApp",
      mapaTitulo: "Estamos aqui",
      botaoMaps: "Ver rota no Google Maps"
    },
    contato: {
      etiqueta: "Contato",
      titulo: "Agende seu horário",
      descricao: "Estamos prontas para receber você. Fale com a gente pelo WhatsApp e escolha o melhor horário para o seu cuidado.",
      botaoWhatsapp: "Enviar mensagem no WhatsApp",
      whatsappFlutuante: "Conversar no WhatsApp"     // aria-label do botão flutuante
    },
    rodape: {
      tituloNavegacao: "Navegação",
      tituloContato: "Contato",
      direitos: "Todos os direitos reservados."
    },
    lightbox: {
      fechar: "Fechar visualização",
      anterior: "Foto anterior",
      proximo: "Próxima foto",
      dialogo: "Visualização ampliada de foto"
    }
  }
};

/* ============================================================
   FIM DA CONFIGURAÇÃO — não é preciso editar nada abaixo disso
   ============================================================ */
