(() => {
  "use strict";

  const config = window.siteConfig;
  if (!config) {
    console.error("siteConfig não foi carregado.");
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const createWhatsAppUrl = () => {
    const phone = String(config.empresa.whatsapp || "").replace(/\D/g, "");
    const message = encodeURIComponent(config.contato?.mensagemWhatsapp || "");
    return phone ? `https://wa.me/${phone}${message ? `?text=${message}` : ""}` : "#";
  };

  const setText = (selector, value) => {
    $$(selector).forEach((element) => {
      element.textContent = value || "";
    });
  };

  const initBaseData = () => {
    document.title = config.seo?.titulo || config.empresa.nome;
    const description = $('meta[name="description"]');
    if (description) description.setAttribute("content", config.seo?.descricao || config.empresa.descricao || "");

    const ogTitle = $('meta[property="og:title"]');
    const ogDescription = $('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute("content", config.seo?.titulo || config.empresa.nome);
    if (ogDescription) ogDescription.setAttribute("content", config.seo?.descricao || "");

    const favicon = $("#favicon");
    if (favicon && config.identidade?.favicon) favicon.href = config.identidade.favicon;

    document.documentElement.style.setProperty("--accent", config.identidade?.corPrincipal || "#9b6b62");
    document.documentElement.style.setProperty("--accent-soft", config.identidade?.corDestaque || "#caa69d");

    setText("[data-company-name]", config.empresa.nome);
    setText("[data-city]", config.empresa.cidade);
    setText("[data-phone]", formatPhone(config.empresa.telefone));
    setText("[data-address]", config.empresa.endereco);
    setText("[data-reference]", config.empresa.referencia);
    setText("[data-about-text]", config.empresa.descricao);
    setText("[data-year]", new Date().getFullYear());

    const whatsappUrl = createWhatsAppUrl();
    $$("[data-whatsapp-link]").forEach((link) => {
      link.href = whatsappUrl;
      if (whatsappUrl === "#") link.hidden = true;
    });

    const mapsQuery = encodeURIComponent(config.empresa.endereco || "");
    const mapsLink = $("[data-maps-link]");
    if (mapsLink && mapsQuery) {
      mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    }

    const instagram = config.identidade?.instagram;
    $$("[data-instagram-link]").forEach((link) => {
      if (instagram) {
        link.href = instagram;
        link.hidden = false;
      } else {
        link.hidden = true;
      }
    });
  };

  const formatPhone = (phone) => {
    const digits = String(phone || "").replace(/\D/g, "");
    if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return phone || "";
  };

  const initServices = () => {
    const container = $("[data-services]");
    if (!container) return;
    const services = Array.isArray(config.servicos) ? config.servicos : [];

    if (!services.length) {
      container.innerHTML = '<p class="empty-state">Adicione os serviços do cliente no arquivo js/config.js.</p>';
      return;
    }

    container.innerHTML = services.map((service, index) => `
      <article class="service-card reveal">
        <span class="service-number">0${index + 1}</span>
        <span class="service-category">${escapeHtml(service.categoria || "Serviço")}</span>
        <h3>${escapeHtml(service.nome || "Serviço")}</h3>
        <p>${escapeHtml(service.descricao || "")}</p>
        ${service.preco ? `<strong class="service-price">${escapeHtml(service.preco)}</strong>` : ""}
      </article>
    `).join("");
  };

  const initGallery = () => {
    const container = $("[data-gallery]");
    if (!container) return;
    const gallery = Array.isArray(config.galeria) ? config.galeria : [];

    container.innerHTML = gallery.length
      ? gallery.map((item, index) => `
        <button class="gallery-item reveal" type="button" data-gallery-image="${escapeAttribute(item.imagem)}" data-gallery-alt="${escapeAttribute(item.titulo || "Galeria")}">
          <img src="${escapeAttribute(item.imagem)}" alt="${escapeAttribute(item.titulo || "Imagem da galeria")}" loading="${index < 2 ? "eager" : "lazy"}">
          <span class="gallery-overlay"><strong>${escapeHtml(item.titulo || "")}</strong><small>${escapeHtml(item.descricao || "")}</small></span>
        </button>
      `).join("")
      : '<p class="empty-state">Adicione fotos na propriedade galeria do arquivo js/config.js.</p>';

    $$(".gallery-item", container).forEach((item) => {
      item.addEventListener("click", () => openLightbox(item.dataset.galleryImage, item.dataset.galleryAlt));
    });
  };

  const initTestimonials = () => {
    const section = $("[data-testimonials-section]");
    const container = $("[data-testimonials]");
    if (!section || !container) return;
    const testimonials = Array.isArray(config.depoimentos) ? config.depoimentos : [];

    if (!testimonials.length) {
      section.hidden = true;
      return;
    }

    container.innerHTML = testimonials.map((item) => `
      <article class="testimonial-card reveal">
        <span class="quote">“</span>
        <p>${escapeHtml(item.texto || "")}</p>
        <strong>${escapeHtml(item.nome || "Cliente")}</strong>
      </article>
    `).join("");
  };

  const openLightbox = (src, alt) => {
    const box = $("[data-lightbox]");
    const image = $("[data-lightbox-image]");
    if (!box || !image) return;
    image.src = src;
    image.alt = alt || "";
    box.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const closeLightbox = () => {
    const box = $("[data-lightbox]");
    if (!box) return;
    box.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  const initLightbox = () => {
    $("[data-lightbox]")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeLightbox();
    });
    $(".lightbox-close")?.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  };

  const initMobileMenu = () => {
    const toggle = $(".menu-toggle");
    const nav = $("#main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    $$("#main-nav a").forEach((link) => link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }));
  };

  const initReveal = () => {
    const elements = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));

  const escapeAttribute = escapeHtml;

  initBaseData();
  initServices();
  initGallery();
  initTestimonials();
  initLightbox();
  initMobileMenu();
  initReveal();
})();