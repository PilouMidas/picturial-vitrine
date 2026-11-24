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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        strip.scrollBy({ left: -slideStep(), behavior: reducedMotion ? "auto" : "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        strip.scrollBy({ left: slideStep(), behavior: reducedMotion ? "auto" : "smooth" });
      });
    }
    strip.addEventListener("scroll", updateStrip, { passive: true });
    window.addEventListener("resize", updateStrip);
    updateStrip();
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
