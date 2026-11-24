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

  window.setNext = function (l, t, w, h) {
    const style = document.documentElement.style;
    if (l === undefined) {
      const c = getComputedStyle(document.documentElement);
      return {
        nextL: c.getPropertyValue("--nextL").trim(),
        nextT: c.getPropertyValue("--nextT").trim(),
        nextW: c.getPropertyValue("--nextW").trim(),
        nextH: c.getPropertyValue("--nextH").trim()
      };
    }
    style.setProperty("--nextL", String(l));
    style.setProperty("--nextT", String(t == null ? "20%" : t));
    style.setProperty("--nextW", String(w || "40%"));
    style.setProperty("--nextH", String(h || "80%"));
  };

  // ---------- Hero étape 2 : carrousel de films plein écran ----------

  const FILMS = [
    { slug: "tristan", title: "Tristan", meta: "de Mallory Grolleau · fiction · 14 min · 2024", video: "1164957316", hash: "8c1cfa0fbf", url: "https://vimeo.com/picturial/tristan", h: 1013, alt: "Photogramme de Tristan — Marie-Luce et Bernard en conversation dans leur salon, mur vert pâle" },
    { slug: "ira", title: "Ira, mon amour", meta: "documentaire · 3 min · 2024 · réal. Philippe Beyer-Hirsch", video: "933198113", hash: "8300f40080", url: "https://vimeo.com/picturial/iramonamour", h: 1080, alt: "Photogramme d'Ira, mon amour : un bus bleu dans une rue de Chișinău, la nuit" },
    { slug: "objet-retrouve", title: "Objet (re)trouvé", meta: "documentaire · 23 min · 2022 · France Design Week", video: "774185263", hash: "440a590aba", url: "https://vimeo.com/picturial/objetretrouve", h: 1080, alt: "Photogramme d'Objet (re)trouvé : des chaises rouges, le titre du film à l'écran" },
    { slug: "blues-du-poulailler", title: "Le Blues du poulailler", meta: "documentaire · 17 min · 2023 · Assemblée nationale", video: "876004689", hash: "6995f14855", url: "https://vimeo.com/picturial/bluesdupoulailler", h: 1080, alt: "Photogramme du Blues du poulailler : un rapport sur l'épizootie aviaire devant un champ" },
    { slug: "recreations", title: "Récréations", meta: "documentaire · 26 min · 2024 · France Design Week", video: "1006856972", hash: "69c2dffb86", url: "https://vimeo.com/picturial/recreation", h: 1080, alt: "Photogramme de Récréations : des chaises d'école empilées, le titre du film à l'écran" },
    { slug: "murmures-de-culture", title: "Murmures de culture", meta: "documentaire · 6 min · 2025 · France Design Week", video: "1169950875", hash: "0b4518e3ef", url: "https://vimeo.com/1169950875/0b4518e3ef", h: 1080, alt: "Photogramme de Murmures de culture : des cercles colorés suspendus devant une fenêtre à vitraux" }
  ];

  const heroEl = document.getElementById("hero");
  if (heroEl) {
    const track = document.getElementById("frame-track");
    const bgSlots = [document.getElementById("bg-a"), document.getElementById("bg-b")];
    const sharpSlots = [document.getElementById("sharp-a"), document.getElementById("sharp-b")];
    const play = document.getElementById("hero-play");
    const playLabel = document.getElementById("hero-play-label");
    const countEl = document.getElementById("hero-count");

    FILMS.forEach((f) => {
      const frame = document.createElement("div");
      frame.className = "hero-frame";
      frame.innerHTML =
        '<div class="hero-caption">' +
        '<p class="hero-caption-label">Film</p>' +
        "<h2>" + f.title + "</h2>" +
        '<p class="hero-caption-meta">' + f.meta + "</p>" +
        "</div>";
      track.appendChild(frame);
    });
    const frames = Array.from(track.children);

    let cur = 0;
    let frontSlot = 0;
    let animating = false;

    function fillSlot(slotIdx, film) {
      [bgSlots[slotIdx], sharpSlots[slotIdx]].forEach((pic, layerIdx) => {
        pic.innerHTML = "";
        const src = document.createElement("source");
        src.type = "image/avif";
        src.srcset =
          "assets/img/poster-" + film.slug + "-800.avif 800w, assets/img/poster-" + film.slug + "-1600.avif 1600w, assets/img/poster-" + film.slug + "-1920.avif 1920w";
        src.sizes = "100vw";
        const img = document.createElement("img");
        img.src = "assets/img/poster-" + film.slug + "-1920.webp";
        img.srcset =
          "assets/img/poster-" + film.slug + "-800.webp 800w, assets/img/poster-" + film.slug + "-1600.webp 1600w, assets/img/poster-" + film.slug + "-1920.webp 1920w";
        img.sizes = "100vw";
        img.width = 1920;
        img.height = film.h;
        img.decoding = "async";
        if (layerIdx === 0) {
          img.alt = film.alt;
          img.setAttribute("fetchpriority", "high");
        } else {
          img.alt = "";
        }
        pic.appendChild(src);
        pic.appendChild(img);
      });
    }

    function paint() {
      frames.forEach((f, i) => {
        if (f.classList.contains("is-exit-left")) return;
        f.classList.remove("is-current", "is-next", "is-prev", "is-hidden");
        if (i === cur) f.classList.add("is-current");
        else if (i === (cur + 1) % FILMS.length) f.classList.add("is-next");
        else f.classList.add("is-hidden");
      });
      const f = FILMS[cur];
      play.dataset.video = f.video;
      play.dataset.hash = f.hash;
      play.dataset.title = f.title;
      play.dataset.url = f.url;
      play.href = f.url;
      playLabel.textContent = "Voir le film — " + f.title;
      countEl.textContent = cur + 1 + " / " + FILMS.length;
    }

    function preloadNext() {
      [(cur + 1) % FILMS.length, (cur - 1 + FILMS.length) % FILMS.length].forEach((idx) => {
        const base = "assets/img/poster-" + FILMS[idx].slug + "-";
        const av = document.createElement("link");
        av.rel = "preload";
        av.as = "image";
        av.type = "image/avif";
        av.imagesrcset = base + "800.avif 800w, " + base + "1600.avif 1600w, " + base + "1920.avif 1920w";
        av.imagesizes = "100vw";
        document.head.appendChild(av);
        const im = new Image();
        im.srcset = base + "800.webp 800w, " + base + "1600.webp 1600w, " + base + "1920.webp 1920w";
        im.sizes = "100vw";
        im.src = base + "1920.webp";
      });
    }

    function go(dir) {
      if (animating) return;
      animating = true;
      const next = (cur + dir + FILMS.length) % FILMS.length;
      const back = 1 - frontSlot;
      fillSlot(back, FILMS[next]);
      bgSlots[back].classList.add("front", "zoom-in");
      sharpSlots[back].classList.add("front", "zoom-in");
      bgSlots[frontSlot].classList.remove("front");
      sharpSlots[frontSlot].classList.remove("front");
      frontSlot = back;
      const oldF = frames[cur];
      cur = next;
      const newF = frames[cur];
      if (dir === -1) newF.classList.add("is-from-bottom");
      paint();
      oldF.classList.remove("is-hidden");
      oldF.classList.add("is-exit-left");
      const durMs = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--transDur")) || 0.8) * 1000;
      setTimeout(() => {
        bgSlots.forEach((p) => p.classList.remove("zoom-in"));
        sharpSlots.forEach((p) => p.classList.remove("zoom-in"));
        oldF.classList.remove("is-exit-left");
        oldF.classList.add("is-hidden");
        newF.classList.remove("is-from-bottom");
        animating = false;
        preloadNext();
      }, durMs + 80);
    }

    fillSlot(0, FILMS[0]);
    bgSlots[0].classList.add("front", "zoom-in");
    sharpSlots[0].classList.add("front", "zoom-in");
    frames[0].classList.add("is-entering");
    paint();
    preloadNext();
    const enterMs = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--transDur")) || 0.8) * 1500 + 120;
    setTimeout(() => {
      bgSlots[0].classList.remove("zoom-in");
      sharpSlots[0].classList.remove("zoom-in");
      frames[0].classList.remove("is-entering");
    }, enterMs);

    document.getElementById("hero-next").addEventListener("click", () => go(1));
    document.getElementById("hero-prev").addEventListener("click", () => go(-1));
    frames.forEach((f) => {
      f.addEventListener("click", () => {
        if (f.classList.contains("is-next")) go(1);
      });
    });
    document.addEventListener("keydown", (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    });
  }

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
      '<label>Flou (px) <input type="range" id="fe-blur" min="0" max="20" step="0.5"><span id="fe-blurv"></span></label>' +
      '<label>Durée (s) <input type="range" id="fe-dur" min="0.2" max="2" step="0.1"><span id="fe-durv"></span></label>' +
      '<label>Zoom (%) <input type="range" id="fe-zoom" min="0" max="10" step="0.5"><span id="fe-zoomv"></span></label>' +
      '<p class="focus-editor-sub">Cadre suivant (\u00e0 venir)</p>' +
      '<label>Suivant L (%) <input type="range" id="fe-nl" min="0" max="100" step="0.5"><span id="fe-nlv"></span></label>' +
      '<label>Suivant T (%) <input type="range" id="fe-nt" min="0" max="100" step="0.5"><span id="fe-ntv"></span></label>' +
      '<label>Suivant larg. (%) <input type="range" id="fe-nw" min="10" max="100" step="1"><span id="fe-nwv"></span></label>' +
      '<label>Suivant haut. (%) <input type="range" id="fe-nh" min="10" max="100" step="1"><span id="fe-nhv"></span></label>' +
      '<div class="focus-editor-presets">' +
      '<button type="button" data-p="gauche">Gauche</button>' +
      '<button type="button" data-p="centre">Centre</button>' +
      '<button type="button" data-p="droite">Droite</button>' +
      '<button type="button" data-p="haut">Haut</button>' +
      '<button type="button" data-p="bas">Bas</button>' +
      '<button type="button" data-p="cote">C\u00f4te \u00e0 c\u00f4te</button>' +
      "</div>" +
      '<textarea id="fe-out" readonly rows="5" aria-label="Valeurs CSS"></textarea>' +
      '<button type="button" id="fe-copy" class="focus-editor-copy">Copier les valeurs CSS</button>';
    document.body.appendChild(panel);

    const x = panel.querySelector("#fe-x");
    const y = panel.querySelector("#fe-y");
    const w = panel.querySelector("#fe-w");
    const h = panel.querySelector("#fe-h");
    const logo = panel.querySelector("#fe-logo");
    const blur = panel.querySelector("#fe-blur");
    const dur = panel.querySelector("#fe-dur");
    const zoom = panel.querySelector("#fe-zoom");
    const nl = panel.querySelector("#fe-nl");
    const nt = panel.querySelector("#fe-nt");
    const nw = panel.querySelector("#fe-nw");
    const nh = panel.querySelector("#fe-nh");
    const out = panel.querySelector("#fe-out");
    const labels = {
      x: panel.querySelector("#fe-xv"),
      y: panel.querySelector("#fe-yv"),
      w: panel.querySelector("#fe-wv"),
      h: panel.querySelector("#fe-hv"),
      logo: panel.querySelector("#fe-logov"),
      blur: panel.querySelector("#fe-blurv"),
      dur: panel.querySelector("#fe-durv"),
      zoom: panel.querySelector("#fe-zoomv"),
      nl: panel.querySelector("#fe-nlv"),
      nt: panel.querySelector("#fe-ntv"),
      nw: panel.querySelector("#fe-nwv"),
      nh: panel.querySelector("#fe-nhv")
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
      blur.value = readVar("--blur", 6);
      dur.value = readVar("--transDur", 0.8);
      zoom.value = Math.max(0, (readVar("--zoom", 1.05) - 1) * 100);
      nl.value = readVar("--nextL", 68.5);
      nt.value = readVar("--nextT", 20);
      nw.value = readVar("--nextW", 40);
      nh.value = readVar("--nextH", 80);
      paint();
    }

    function paint() {
      labels.x.textContent = x.value;
      labels.y.textContent = y.value;
      labels.w.textContent = w.value + "%";
      labels.h.textContent = h.value + "%";
      labels.logo.textContent = logo.value + "px";
      labels.blur.textContent = blur.value + "px";
      labels.dur.textContent = dur.value + "s";
      labels.zoom.textContent = zoom.value + "%";
      labels.nl.textContent = nl.value + "%";
      labels.nt.textContent = nt.value + "%";
      labels.nw.textContent = nw.value + "%";
      labels.nh.textContent = nh.value + "%";
      out.value =
        "--focusX: " + x.value + "; --focusY: " + y.value + "; --focusW: " + w.value + "%; --focusH: " + h.value + "%;\n" +
        "--nextL: " + nl.value + "%; --nextT: " + nt.value + "%; --nextW: " + nw.value + "%; --nextH: " + nh.value + "%;\n" +
        "--logoH: " + logo.value + "px;\n" +
        "--blur: " + blur.value + "px;\n" +
        "--transDur: " + dur.value + "s; --zoom: " + (1 + parseFloat(zoom.value) / 100).toFixed(2) + ";";
    }

    function apply() {
      setFocus(parseFloat(x.value), parseFloat(y.value), w.value + "%", h.value + "%");
      setNext(nl.value + "%", nt.value + "%", nw.value + "%", nh.value + "%");
      document.documentElement.style.setProperty("--logoH", logo.value + "px");
      document.documentElement.style.setProperty("--blur", blur.value + "px");
      document.documentElement.style.setProperty("--transDur", dur.value + "s");
      document.documentElement.style.setProperty("--zoom", String(1 + parseFloat(zoom.value) / 100));
      paint();
    }

    [x, y, w, h, logo, blur, dur, zoom, nl, nt, nw, nh].forEach((s) => s.addEventListener("input", apply));
    panel.querySelectorAll("[data-p]").forEach((b) => {
      b.addEventListener("click", () => {
        if (b.dataset.p === "cote") {
          const fx = readVar("--focusX", 0.37);
          const fw = readVar("--focusW", 50);
          const fh = readVar("--focusH", 100);
          setNext((fx * (100 - fw) + fw).toFixed(1) + "%", "20%", Math.round(fw * 0.8) + "%", Math.round(fh * 0.8) + "%");
        } else {
          setFocus(b.dataset.p);
        }
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
