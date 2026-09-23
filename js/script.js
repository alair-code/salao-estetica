(() => {
  "use strict";
  const config = window.siteConfig;
  if (!config) { console.error("siteConfig não foi carregado."); return; }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
  const text = (s,v) => $$(s).forEach(e => e.textContent = v ?? "");
  const html = (s,v) => $$(s).forEach(e => e.innerHTML = v ?? "");
  const waUrl = () => {
    const phone = String(config.empresa.whatsapp || "").replace(/\D/g,"");
    const msg = encodeURIComponent(config.contato?.mensagemWhatsapp || "");
    return phone ? `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}` : "#";
  };
  const phone = (v) => {
    const d = String(v || "").replace(/\D/g,"");
    return d.length === 11 ? `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}` : v || "";
  };
  const setImage = (img, placeholder, src, alt) => {
    const image = $(img), fallback = $(placeholder);
    if (image && src) { image.src = src; image.alt = alt || ""; image.hidden = false; fallback?.setAttribute("hidden",""); }
  };
  const init = () => {
    document.title = config.seo?.titulo || config.empresa.nome;
    $('meta[name="description"]')?.setAttribute("content", config.seo?.descricao || "");
    $('meta[property="og:title"]')?.setAttribute("content", config.seo?.titulo || config.empresa.nome);
    $('meta[property="og:description"]')?.setAttribute("content", config.seo?.descricao || "");
    if (config.seo?.imagemSocial) $('meta[property="og:image"]')?.setAttribute("content", config.seo.imagemSocial);
    if (config.identidade?.favicon) $("#favicon").href = config.identidade.favicon;
    document.documentElement.style.setProperty("--accent", config.identidade?.corPrincipal || "#9b6b62");
    document.documentElement.style.setProperty("--accent-soft", config.identidade?.corDestaque || "#caa69d");

    text("[data-company-name]", config.empresa.nome); text("[data-business-type]", config.empresa.tipo || "Salão & Estética");
    text("[data-city]", config.empresa.cidade); text("[data-phone]", phone(config.empresa.telefone)); text("[data-address]", config.empresa.endereco); text("[data-reference]", config.empresa.referencia);
    text("[data-about-text]", config.empresa.descricao); text("[data-year]", new Date().getFullYear());
    const c = config.conteudo || {};
    html("[data-hero-eyebrow]", esc(c.heroEyebrow || "")); html("[data-hero-title]", c.heroTitulo || ""); html("[data-hero-text]", esc(c.heroTexto || ""));
    text("[data-card-kicker]", c.heroCardKicker || ""); html("[data-hero-card-title]", c.heroCardTitulo || ""); text("[data-hero-card-text]", c.heroCardTexto || "");
    html("[data-services-title]", c.servicosTitulo || "Serviços"); text("[data-services-intro]", c.servicosIntro || "");
    html("[data-about-title]", c.sobreTitulo || "Sobre"); text("[data-about-badge]", c.sobreBadge || "");
    html("[data-gallery-title]", c.galeriaTitulo || "Galeria"); text("[data-gallery-intro]", c.galeriaIntro || "");
    html("[data-booking-title]", c.agendamentoTitulo || "Agendamento"); text("[data-booking-text]", c.agendamentoTexto || "");

    const brand = config.identidade?.logo;
    $$("[data-brand-logo],[data-footer-brand-logo]").forEach(e => { if (brand) { e.src = brand; e.hidden = false; } });
    $$("[data-brand-mark],[data-footer-brand-mark]").forEach(e => { if (brand) e.hidden = true; });

    const w = waUrl();
    $$("[data-whatsapp-link]").forEach(a => { a.href = w; if (w === "#") a.hidden = true; });
    const booking = config.contato?.agendamento || {};
    const bookingUrl = booking.tipo === "link" && booking.link ? booking.link : w;
    const bookingSection = $("[data-booking-section]");
    if (bookingSection) bookingSection.hidden = !bookingUrl || bookingUrl === "#";
    $$("[data-booking-link]").forEach(a => { a.href = bookingUrl; if (bookingUrl === "#") a.hidden = true; });

    const maps = $("[data-maps-link]");
    if (maps && config.empresa.endereco) maps.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(config.empresa.endereco);
    const social = [["[data-instagram-link]",config.identidade?.instagram],["[data-facebook-link]",config.identidade?.facebook]];
    social.forEach(([s,url]) => $$(s).forEach(a => { if (url) { a.href=url; a.hidden=false; } else a.hidden=true; }));

    setImage("[data-hero-image]","[data-hero-placeholder]",config.imagens?.hero,config.empresa.nome);
    setImage("[data-about-image]","[data-about-placeholder]",config.imagens?.sobre,config.empresa.nome);
    initDifferentials(); initPoints(); initServices(); initGallery(); initTestimonials(); initHours(); initLightbox(); initMenu(); initReveal();
  };
  const initDifferentials = () => {
    const c=$("[data-differentials]"), items=Array.isArray(config.diferenciais)?config.diferenciais:[];
    if(!c)return; c.innerHTML=items.slice(0,4).map((x,i)=>`<div><strong>0${i+1}</strong><span>${esc(x)}</span></div>`).join("");
  };
  const initPoints = () => {
    const c=$("[data-about-points]"), items=Array.isArray(config.pontosSobre)?config.pontosSobre:[];
    if(!c)return; c.innerHTML=items.map(x=>`<div><span>✦</span><strong>${esc(x.titulo)}</strong><small>${esc(x.texto)}</small></div>`).join("");
  };
  const initServices = () => {
    const c=$("[data-services]"), items=Array.isArray(config.servicos)?config.servicos:[];
    if(!c)return;
    c.innerHTML = items.length ? items.map((s,i)=>`<article class="service-card reveal"><span class="service-number">${String(i+1).padStart(2,"0")}</span><span class="service-category">${esc(s.categoria||"Serviço")}</span><h3>${esc(s.nome||"Serviço")}</h3><p>${esc(s.descricao||"")}</p>${s.preco?`<strong class="service-price">${esc(s.preco)}</strong>`:""}</article>`).join("") : '<p class="empty-state">Nenhum serviço cadastrado ainda. Configure a propriedade <strong>servicos</strong> em js/config.js.</p>';
  };
  const initGallery = () => {
    const c=$("[data-gallery]"), items=Array.isArray(config.galeria)?config.galeria:[];
    if(!c)return;
    c.innerHTML = items.length ? items.map((g,i)=>`<button class="gallery-item reveal" type="button" data-gallery-image="${esc(g.imagem)}" data-gallery-alt="${esc(g.titulo||"Galeria")}"><img src="${esc(g.imagem)}" alt="${esc(g.titulo||"Imagem da galeria")}" loading="${i<2?"eager":"lazy"}"><span class="gallery-overlay"><strong>${esc(g.titulo||"")}</strong><small>${esc(g.descricao||"")}</small></span></button>`).join("") : '<p class="empty-state">Nenhuma foto cadastrada. Adicione imagens em <strong>galeria</strong> no js/config.js.</p>';
    $$(".gallery-item",c).forEach(e=>e.addEventListener("click",()=>openLightbox(e.dataset.galleryImage,e.dataset.galleryAlt)));
  };
  const initTestimonials = () => {
    const s=$("[data-testimonials-section]"), c=$("[data-testimonials]"), items=Array.isArray(config.depoimentos)?config.depoimentos:[];
    if(!s||!c)return; s.hidden=!items.length;
    c.innerHTML=items.map(x=>`<article class="testimonial-card reveal"><span class="quote">“</span><p>${esc(x.texto||"")}</p><strong>${esc(x.nome||"Cliente")}</strong></article>`).join("");
  };
  const initHours = () => {
    const s=$("[data-hours-section]"), c=$("[data-hours]"), h=config.funcionamento||{}, labels={segunda:"Segunda-feira",terca:"Terça-feira",quarta:"Quarta-feira",quinta:"Quinta-feira",sexta:"Sexta-feira",sabado:"Sábado",domingo:"Domingo"};
    const items=Object.entries(labels).filter(([k])=>h[k]);
    if(!s||!c)return; s.hidden=!items.length; c.innerHTML=items.map(([k,l])=>`<div><span>${l}</span><strong>${esc(h[k])}</strong></div>`).join("");
  };
  const openLightbox=(src,alt)=>{const b=$("[data-lightbox]"),i=$("[data-lightbox-image]");if(!b||!i)return;i.src=src;i.alt=alt||"";b.setAttribute("aria-hidden","false");document.body.classList.add("no-scroll");};
  const closeLightbox=()=>{$("[data-lightbox]")?.setAttribute("aria-hidden","true");document.body.classList.remove("no-scroll");};
  const initLightbox=()=>{$("[data-lightbox]")?.addEventListener("click",e=>{if(e.target===e.currentTarget)closeLightbox();});$(".lightbox-close")?.addEventListener("click",closeLightbox);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();});};
  const initMenu=()=>{const b=$(".menu-toggle"),n=$("#main-nav");if(!b||!n)return;const setOpen=(open)=>{b.setAttribute("aria-expanded",String(open));b.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");n.classList.toggle("is-open",open);document.body.classList.toggle("menu-open",open);};b.addEventListener("click",()=>setOpen(b.getAttribute("aria-expanded")!=="true"));$(".main-nav a").forEach(a=>a.addEventListener("click",()=>setOpen(false)));document.addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false);});window.addEventListener("resize",()=>{if(window.innerWidth>720)setOpen(false);});};
  const initReveal=()=>{const es=$$(".reveal");if(!("IntersectionObserver"in window)){es.forEach(e=>e.classList.add("is-visible"));return;}const o=new IntersectionObserver((entries,obs)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");obs.unobserve(e.target);}}),{threshold:.12});es.forEach(e=>o.observe(e));};
  init();
})();