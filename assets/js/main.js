(() => {
  "use strict";

  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const dialog = document.getElementById("player-dialog");
  const playerFrame = document.getElementById("player-frame");
  const playerTitle = document.getElementById("player-dialog-title");
  const playerClose = document.getElementById("player-close");
  let lastTrigger = null;

  const desktopQuery = window.matchMedia("(min-width: 861px)");

  function setMenu(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileNav.hidden = !open;
  }

  menuToggle.addEventListener("click", () => {
    setMenu(mobileNav.hidden);
  });

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

  window.addEventListener("scroll", () => {
    header.style.borderBottomColor = window.scrollY > 8 ? "#D9D9D5" : "";
  }, { passive: true });

  function openPlayer(trigger) {
    const { video, hash, title } = trigger.dataset;
    playerTitle.textContent = title;
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

  function closePlayer() {
    playerFrame.textContent = "";
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll("[data-video]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openPlayer(trigger);
    });
  });

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

  dialog.addEventListener("close", closePlayer);

  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = "Projet de film — " + (data.get("nom") || "");
    const body = [
      "Nom : " + (data.get("nom") || ""),
      "Email : " + (data.get("email") || ""),
      "Type de projet : " + (data.get("projet") || ""),
      "",
      String(data.get("message") || "")
    ].join("\n");
    const params = new URLSearchParams({ subject, body });
    window.location.href = "mailto:contact@picturial.fr?" + params.toString();
  });
})();
