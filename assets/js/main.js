(() => {
  "use strict";

  const CONSENT_KEY = "picturial-consent";
  let memoryConsent = null;
  let pendingTrigger = null;
  let bannerEl = null;

  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const dialog = document.getElementById("player-dialog");
  const playerFrame = document.getElementById("player-frame");
  const playerFallback = document.getElementById("player-fallback");
  const playerExternal = document.getElementById("player-external-link");
  const playerTitle = document.getElementById("player-dialog-title");
  const playerClose = document.getElementById("player-close");
  let lastTrigger = null;

  const desktopQuery = window.matchMedia("(min-width: 861px)");
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Consentement (RGPD) ----------

  function getConsent() {
    if (memoryConsent) return memoryConsent;
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    memoryConsent = value;
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {}
    hideBanner();
  }

  function buildBanner() {
    bannerEl = document.createElement("div");
    bannerEl.className = "cookie-banner";
    bannerEl.id = "cookie-banner";
    bannerEl.tabIndex = -1;
    bannerEl.setAttribute("role", "region");
    bannerEl.setAttribute("aria-label", "Consentement aux cookies");
    bannerEl.hidden = true;
    bannerEl.innerHTML =
      '<div class="container cookie-inner">' +
      '<p class="cookie-text">Ce site ne dépose aucun cookie de suivi et n’utilise aucun outil de mesure d’audience. ' +
      'Seules les vidéos Vimeo intégrées peuvent déposer des cookies de tiers : elles ne se chargent qu’avec votre accord. ' +
      '<a href="politique-de-confidentialite.html">Politique de confidentialité</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn cookie-accept" data-consent="accepted">Tout accepter</button>' +
      '<button type="button" class="cookie-btn cookie-refuse" data-consent="refused">Tout refuser</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(bannerEl);
    bannerEl.querySelectorAll("[data-consent]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setConsent(btn.getAttribute("data-consent"));
        if (pendingTrigger) {
          const t = pendingTrigger;
          pendingTrigger = null;
          routeVideo(t);
        }
      });
    });
  }

  function showBanner() {
    if (!bannerEl) buildBanner();
    bannerEl.hidden = false;
    bannerEl.focus();
  }

  function hideBanner() {
    if (bannerEl) bannerEl.hidden = true;
  }

  const manageCookies = document.getElementById("manage-cookies");
  if (manageCookies) {
    manageCookies.addEventListener("click", () => {
      memoryConsent = null;
      showBanner();
    });
  }

  if (getConsent() === null) showBanner();

  // ---------- Menu mobile ----------

  function setMenu(open) {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileNav.hidden = !open;
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => setMenu(mobileNav.hidden));
    mobileNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileNav.hidden) {
        setMenu(false);
        menuToggle.focus();
      }
    });
    desktopQuery.addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });
  }

  if (header) {
    window.addEventListener("scroll", () => {
      header.style.borderBottomColor = window.scrollY > 8 ? "#D9D9D5" : "";
    }, { passive: true });
  }

  // ---------- Lecteur vidéo (chargé uniquement après consentement) ----------

  function openPlayer(trigger) {
    const { video, hash, title } = trigger.dataset;
    playerTitle.textContent = title;
    if (playerFallback) playerFallback.hidden = true;
    playerFrame.textContent = "";
    const iframe = document.createElement("iframe");
    const params = new URLSearchParams({
      h: hash,
      autoplay: "1",
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1"
    });
    iframe.src = "https://player.vimeo.com/video/" + encodeURIComponent(video) + "?" + params.toString();
    iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media; web-share";
    iframe.allowFullscreen = true;
    iframe.title = title;
    playerFrame.appendChild(iframe);
    lastTrigger = trigger;
    if (!dialog.open) dialog.showModal();
    playerClose.focus();
  }

  function openExternal(trigger) {
    const title = trigger.dataset.title || "Film";
    const url = trigger.dataset.url || trigger.getAttribute("href") || "https://vimeo.com/picturial";
    playerTitle.textContent = title;
    playerFrame.textContent = "";
    if (playerFallback) playerFallback.hidden = false;
    if (playerExternal) playerExternal.href = url;
    lastTrigger = trigger;
    if (!dialog.open) dialog.showModal();
    playerClose.focus();
  }

  function routeVideo(trigger) {
    const consent = getConsent();
    if (consent === "accepted") openPlayer(trigger);
    else if (consent === "refused") openExternal(trigger);
    else {
      pendingTrigger = trigger;
      showBanner();
    }
  }

  document.querySelectorAll("[data-video]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      routeVideo(trigger);
    });
  });

  if (dialog && playerClose) {
    playerClose.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const onBackdrop =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (onBackdrop) dialog.close();
    });
    dialog.addEventListener("close", () => {
      playerFrame.textContent = "";
      if (playerFallback) playerFallback.hidden = true;
      if (lastTrigger) lastTrigger.focus();
    });
  }

  // ---------- Bande horizontale des réalisations ----------

  const strip = document.getElementById("film-strip");
  if (strip) {
    const slides = Array.from(strip.querySelectorAll(".film-slide"));
    const prevBtn = document.getElementById("film-prev");
    const nextBtn = document.getElementById("film-next");
    const countEl = document.getElementById("film-count");
    function slideStep() {
      if (!slides.length) return 0;
      const styles = getComputedStyle(strip);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }

    function currentIndex() {
      const step = slideStep() || 1;
      return Math.min(slides.length - 1, Math.max(0, Math.round(strip.scrollLeft / step)));
    }

    function updateStrip() {
      const i = currentIndex();
      if (countEl) countEl.textContent = (i + 1) + " / " + slides.length;
      if (prevBtn) prevBtn.disabled = strip.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 4;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        strip.scrollBy({ left: -slideStep(), behavior: REDUCED_MOTION ? "auto" : "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        strip.scrollBy({ left: slideStep(), behavior: REDUCED_MOTION ? "auto" : "smooth" });
      });
    }
    strip.addEventListener("scroll", updateStrip, { passive: true });
    window.addEventListener("resize", updateStrip);
    updateStrip();
  }

  // ---------- Carrousel de vidéoogrammes à l'intérieur de chaque film ----------

  document.querySelectorAll(".film-slide").forEach((slide) => {
    const stillStrip = slide.querySelector(".still-strip");
    if (!stillStrip) return;
    const stills = Array.from(stillStrip.querySelectorAll(".still"));
    if (!stills.length) return;
    const nav = slide.querySelector(".still-nav");
    const prevBtn = slide.querySelector(".still-prev");
    const nextBtn = slide.querySelector(".still-next");
    const countEl = slide.querySelector(".still-count");
    if (nav && stills.length > 1) nav.hidden = false;

    function stillStep() {
      const gap = parseFloat(getComputedStyle(stillStrip).columnGap || getComputedStyle(stillStrip).gap) || 0;
      return stills[0].getBoundingClientRect().width + gap;
    }
    function stillIndex() {
      const step = stillStep() || 1;
      return Math.min(stills.length - 1, Math.max(0, Math.round(stillStrip.scrollLeft / step)));
    }
    function updateStills() {
      if (countEl) countEl.textContent = (stillIndex() + 1) + " / " + stills.length;
      if (prevBtn) prevBtn.disabled = stillStrip.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = stillStrip.scrollLeft >= stillStrip.scrollWidth - stillStrip.clientWidth - 4;
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        stillStrip.scrollBy({ left: -stillStep(), behavior: REDUCED_MOTION ? "auto" : "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        stillStrip.scrollBy({ left: stillStep(), behavior: REDUCED_MOTION ? "auto" : "smooth" });
      });
    }
    stillStrip.addEventListener("scroll", updateStills, { passive: true });
    window.addEventListener("resize", updateStills);
    updateStills();
  });

  // ---------- Surcadrage (zone nette) : réglable depuis la console, partagé par tous les films ----------

  const FOCUS_PRESETS = {
    droite: { x: "1", y: "0.5", w: "min(34vw, 520px)", h: "100%" },
    gauche: { x: "0", y: "0.5", w: "min(34vw, 520px)", h: "100%" },
    centre: { x: "0.5", y: "0.5", w: "min(88vw, calc(min(58svh, 560px) * 16 / 9))", h: "min(58svh, 560px)" },
    haut: { x: "0.5", y: "0", w: "100%", h: "min(30svh, 300px)" },
    bas: { x: "0.5", y: "1", w: "100%", h: "min(30svh, 300px)" }
  };

  window.setFocus = function (preset, y, w, h) {
    const style = document.documentElement.style;
    if (preset === undefined) {
      const c = getComputedStyle(document.documentElement);
      return {
        focusX: c.getPropertyValue("--focusX").trim(),
        focusY: c.getPropertyValue("--focusY").trim(),
        focusW: c.getPropertyValue("--focusW").trim(),
        focusH: c.getPropertyValue("--focusH").trim()
      };
    }
    let p;
    if (typeof preset === "string" && FOCUS_PRESETS[preset]) {
      p = FOCUS_PRESETS[preset];
    } else {
      p = {
        x: String(preset),
        y: String(y == null ? 0.5 : y),
        w: String(w || "min(34vw, 520px)"),
        h: String(h || "100%")
      };
    }
    style.setProperty("--focusX", p.x);
    style.setProperty("--focusY", p.y);
    style.setProperty("--focusW", p.w);
    style.setProperty("--focusH", p.h);
    return p;
  };

  // ---------- Mode édition visuelle du cadre : ajouter ?focus=edit à l'URL ----------

  const editParams = new URLSearchParams(window.location.search);
  if (editParams.get("focus") === "edit" || editParams.get("edit") === "1") {
    const panel = document.createElement("aside");
    panel.className = "focus-editor";
    panel.setAttribute("aria-label", "Réglages du hero (cadre net, logo)");
    panel.innerHTML =
      '<div class="focus-editor-head"><strong>Réglages hero</strong><button type="button" class="focus-editor-close">Fermer</button></div>' +
      '<label>X (gauche/droite) <input type="range" id="fe-x" min="0" max="1" step="0.01"><span id="fe-xv"></span></label>' +
      '<label>Y (haut/bas) <input type="range" id="fe-y" min="0" max="1" step="0.01"><span id="fe-yv"></span></label>' +
      '<label>Largeur <input type="range" id="fe-w" min="10" max="100" step="1"><span id="fe-wv"></span></label>' +
      '<label>Hauteur <input type="range" id="fe-h" min="10" max="100" step="1"><span id="fe-hv"></span></label>' +
      '<label>Logo (px) <input type="range" id="fe-logo" min="24" max="200" step="1"><span id="fe-logov"></span></label>' +
      '<div class="focus-editor-presets">' +
      '<button type="button" data-p="gauche">Gauche</button>' +
      '<button type="button" data-p="centre">Centre</button>' +
      '<button type="button" data-p="droite">Droite</button>' +
      '<button type="button" data-p="haut">Haut</button>' +
      '<button type="button" data-p="bas">Bas</button>' +
      "</div>" +
      '<textarea id="fe-out" readonly rows="3" aria-label="Valeurs CSS"></textarea>' +
      '<button type="button" id="fe-copy" class="focus-editor-copy">Copier les valeurs CSS</button>';
    document.body.appendChild(panel);

    const x = panel.querySelector("#fe-x");
    const y = panel.querySelector("#fe-y");
    const w = panel.querySelector("#fe-w");
    const h = panel.querySelector("#fe-h");
    const logo = panel.querySelector("#fe-logo");
    const out = panel.querySelector("#fe-out");
    const labels = {
      x: panel.querySelector("#fe-xv"),
      y: panel.querySelector("#fe-yv"),
      w: panel.querySelector("#fe-wv"),
      h: panel.querySelector("#fe-hv"),
      logo: panel.querySelector("#fe-logov")
    };
    const logoImg = document.querySelector(".site-header--overlay .brand img");

    function readVar(k, fallback) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(k).trim();
      if (!v) return fallback;
      if (v.endsWith("%")) return parseFloat(v);
      const n = parseFloat(v);
      return Number.isNaN(n) ? fallback : n;
    }

    function refresh() {
      x.value = readVar("--focusX", 1);
      y.value = readVar("--focusY", 0.5);
      w.value = readVar("--focusW", 34);
      h.value = readVar("--focusH", 100);
      if (logoImg) {
        const lh = parseFloat(getComputedStyle(logoImg).height);
        logo.value = Number.isNaN(lh) ? 64 : Math.min(200, Math.max(24, Math.round(lh)));
      }
      paint();
    }

    function paint() {
      labels.x.textContent = x.value;
      labels.y.textContent = y.value;
      labels.w.textContent = w.value + "%";
      labels.h.textContent = h.value + "%";
      labels.logo.textContent = logo.value + "px";
      out.value =
        "--focusX: " + x.value + "; --focusY: " + y.value + "; --focusW: " + w.value + "%; --focusH: " + h.value + "%;\n" +
        "--logoH: " + logo.value + "px;";
    }

    function apply() {
      setFocus(parseFloat(x.value), parseFloat(y.value), w.value + "%", h.value + "%");
      document.documentElement.style.setProperty("--logoH", logo.value + "px");
      paint();
    }

    [x, y, w, h, logo].forEach((s) => s.addEventListener("input", apply));
    panel.querySelectorAll("[data-p]").forEach((b) => {
      b.addEventListener("click", () => {
        setFocus(b.dataset.p);
        refresh();
      });
    });
    panel.querySelector(".focus-editor-close").addEventListener("click", () => panel.remove());
    panel.querySelector("#fe-copy").addEventListener("click", () => {
      out.select();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.value);
      } else {
        document.execCommand("copy");
      }
    });
    refresh();
  }

  // ---------- Formulaire de contact (mailto, aucune donnée stockée côté serveur) ----------

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = "Projet de film — " + (data.get("nom") || "");
      const body = [
        "Nom : " + (data.get("nom") || ""),
        "Email : " + (data.get("email") || ""),
        "Type de projet : " + (data.get("projet") || ""),
        "Consentement au traitement de la demande : " + (data.get("consent") ? "oui" : "non"),
        "",
        String(data.get("message") || "")
      ].join("\n");
      const params = new URLSearchParams({ subject, body });
      window.location.href = "mailto:contact@picturial.fr?" + params.toString();
    });
  }
})();
