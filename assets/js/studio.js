(function () {
  "use strict";
  if (new URLSearchParams(window.location.search).get("studio") !== "1") return;
  if (window.__picturialStudioLoaded) return;
  window.__picturialStudioLoaded = true;

  function start() {
    const root = document.documentElement;
    const DRAFT_KEY = "picturial-studio-draft";
    const MANAGED = ["--ficheXvw", "--ficheStepvw", "--peekOpacity", "--fichePad", "--logoH", "--bodyDX", "--bodyDY", "--actionsDX", "--actionsDY", "--barDX", "--barDY"];
    const VAR_LABEL = {
      "--ficheXvw": "X fiche active (vw)",
      "--ficheStepvw": "Largeur fiche (vw)",
      "--peekOpacity": "Opacité aperçu (0..1)",
      "--fichePad": "Marge intérieure (px)",
      "--logoH": "Hauteur px",
      "--bodyDX": "Bloc texte fiche active, décalage X (px)",
      "--bodyDY": "Bloc texte fiche active, décalage Y (px)",
      "--actionsDX": "Bouton Voir le film, décalage X (px)",
      "--actionsDY": "Bouton Voir le film, décalage Y (px)",
      "--barDX": "Barre flèches, décalage X (px)",
      "--barDY": "Barre flèches, décalage Y (px)"
    };
    const heroEl = document.getElementById("hero");

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function round2(v) { return Math.round(v * 100) / 100; }
    function round4(v) { return Math.round(v * 10000) / 10000; }
    function pct(v) { return round2(v) + "%"; }
    function refRect() { return (heroEl || document.body).getBoundingClientRect(); }
    function inlineVar(n) { return root.style.getPropertyValue(n).trim(); }

    const TARGETS = [
      {
        id: "fiche-active", label: "Fiche active", vars: ["--ficheXvw", "--ficheStepvw", "--fichePad"],
        el: function () { return document.querySelector(".fiche.is-current"); },
        boxToVars: function (b, ref) {
          const w = clamp(b.w, 80, ref.width - 4);
          return {
            "--ficheXvw": round2(b.l / ref.width * 100) + "vw",
            "--ficheStepvw": round2(w / ref.width * 100) + "vw"
          };
        }
      },
      {
        id: "fiche-next", label: "Fiche à venir (aperçu)", vars: ["--peekOpacity"],
        el: function () { return document.querySelector(".fiche.is-next"); },
        boxToVars: function (b, ref) {
          return { "--peekOpacity": String(clamp(round2((ref.height - b.t) / ref.height), 0.1, 1)) };
        }
      },
      {
        id: "logo", label: "Logo", vars: ["--logoH"],
        el: function () { return document.querySelector(".site-header--overlay .brand img"); },
        boxToVars: function (b) { return { "--logoH": Math.round(clamp(b.h, 16, 400)) + "px" }; }
      },
      {
        id: "fiche-body", label: "Bloc texte (fiche active)", vars: ["--bodyDX", "--bodyDY"],
        el: function () { return document.querySelector(".fiche.is-current .fiche-body"); },
        boxToVars: function (b) {
          const fEl = document.querySelector(".fiche.is-current");
          const f = fEl.getBoundingClientRect();
          const padL = parseFloat(getComputedStyle(fEl).paddingLeft) || 0;
          const padT = parseFloat(getComputedStyle(fEl).paddingTop) || 0;
          return {
            "--bodyDX": Math.round(b.l - f.left - padL) + "px",
            "--bodyDY": Math.round(b.t - f.top - padT) + "px"
          };
        }
      },
      {
        id: "fiche-actions", label: "Bouton « Voir le film »", vars: ["--actionsDX", "--actionsDY"],
        el: function () { return document.querySelector(".fiche.is-current .fiche-actions"); },
        boxToVars: function (b) {
          const fEl = document.querySelector(".fiche.is-current");
          const f = fEl.getBoundingClientRect();
          const padL = parseFloat(getComputedStyle(fEl).paddingLeft) || 0;
          const padB = parseFloat(getComputedStyle(fEl).paddingBottom) || 0;
          return {
            "--actionsDX": Math.round(b.l - f.left - padL) + "px",
            "--actionsDY": Math.round(f.bottom - padB - b.bottom) + "px"
          };
        }
      },
      {
        id: "hero-bar", label: "Barre flèches + compteur", vars: ["--barDX", "--barDY"],
        el: function () { return document.querySelector(".hero-bar"); },
        boxToVars: function (b) {
          const fEl = document.querySelector(".fiche.is-current");
          const hero = heroEl.getBoundingClientRect();
          const f = fEl.getBoundingClientRect();
          const padL = parseFloat(getComputedStyle(fEl).paddingLeft) || 0;
          const barH = parseFloat(getComputedStyle(root).getPropertyValue("--barH")) || 64;
          const baseBottom = (barH - 46) / 2;
          return {
            "--barDX": Math.round(b.l - f.left - padL) + "px",
            "--barDY": Math.round(hero.bottom - baseBottom - b.h - b.t) + "px"
          };
        }
      }
    ];

    function readBase() {
      const base = {};
      const sheets = document.styleSheets;
      for (let i = 0; i < sheets.length; i++) {
        let rules = null;
        try { rules = sheets[i].cssRules; } catch (e) { continue; }
        if (!rules) continue;
        for (let j = 0; j < rules.length; j++) {
          const r = rules[j];
          if (r.selectorText === ":root") {
            for (const n of MANAGED) {
              const v = r.style.getPropertyValue(n);
              if (v) base[n] = v.trim();
            }
          }
        }
      }
      const c = getComputedStyle(root);
      for (const n of MANAGED) {
        if (!base[n]) {
          const v = c.getPropertyValue(n);
          if (v) base[n] = v.trim();
        }
      }
      return base;
    }
    const base = readBase();

    let selected = null;
    let paused = true;
    let history = [];
    let hIndex = -1;
    let lastPush = 0;

    function snapshot() {
      const s = {};
      for (const n of MANAGED) { const v = inlineVar(n); if (v) s[n] = v; }
      return s;
    }
    function updateHistoryButtons() {
      undoBtn.disabled = hIndex <= 0;
      redoBtn.disabled = hIndex >= history.length - 1;
    }
    function pushHistory(coalesce) {
      const now = Date.now();
      if (coalesce && now - lastPush < 700 && hIndex === history.length - 1) {
        history[hIndex] = snapshot();
        lastPush = now;
        updateHistoryButtons();
        return;
      }
      history = history.slice(0, hIndex + 1);
      history.push(snapshot());
      if (history.length > 100) history.shift();
      hIndex = history.length - 1;
      lastPush = now;
      updateHistoryButtons();
    }
    function applySnapshot(s) {
      for (const n of MANAGED) {
        const v = s[n];
        if (v) root.style.setProperty(n, v); else root.style.removeProperty(n);
      }
      saveDraft();
      refreshInspector();
    }
    function undo() { if (hIndex > 0) { hIndex--; applySnapshot(history[hIndex]); updateHistoryButtons(); } }
    function redo() { if (hIndex < history.length - 1) { hIndex++; applySnapshot(history[hIndex]); updateHistoryButtons(); } }

    function saveDraft() {
      const vars = {};
      for (const n of MANAGED) { const v = inlineVar(n); if (v) vars[n] = v; }
      try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ vars: vars, ts: Date.now() })); } catch (e) {}
    }
    function loadDraft() {
      try {
        const d = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null");
        if (d && d.vars) {
          for (const n in d.vars) root.style.setProperty(n, d.vars[n]);
          return d.ts || null;
        }
      } catch (e) {}
      return null;
    }
    function clearDraft() { try { window.localStorage.removeItem(DRAFT_KEY); } catch (e) {} }

    function setVars(map, record) {
      for (const n in map) root.style.setProperty(n, map[n]);
      if (record) pushHistory();
      saveDraft();
      refreshInspector();
    }

    function el(tag, cls, text) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    }

    const toolbar = el("div", "studio-toolbar");
    toolbar.appendChild(el("strong", null, "Studio"));
    const pauseBtn = el("button", "studio-btn", "Anim : en pause");
    const hideBtn = el("button", "studio-btn", "Masquer (H)");
    const undoBtn = el("button", "studio-btn", "Annuler");
    const redoBtn = el("button", "studio-btn", "Rétablir");
    const resetSelBtn = el("button", "studio-btn", "Reset sélection");
    const resetAllBtn = el("button", "studio-btn", "Reset tout");
    const exportBtn = el("button", "studio-btn", "Exporter");
    const quitBtn = el("button", "studio-btn", "Quitter");
    [pauseBtn, hideBtn, undoBtn, redoBtn, resetSelBtn, resetAllBtn, exportBtn, quitBtn].forEach(function (b) { toolbar.appendChild(b); });
    document.body.appendChild(toolbar);

    const layersPanel = el("div", "studio-layers");
    layersPanel.appendChild(el("p", "studio-panel-title", "Calques"));
    TARGETS.forEach(function (t) {
      const b = el("button", "studio-layer", t.label);
      b.type = "button";
      b.dataset.id = t.id;
      b.addEventListener("click", function () { select(t); });
      layersPanel.appendChild(b);
    });
    document.body.appendChild(layersPanel);

    const inspector = el("div", "studio-inspector");
    document.body.appendChild(inspector);

    const overlay = el("div", "studio-overlay");
    overlay.style.display = "none";
    const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
    HANDLES.forEach(function (h) {
      const hd = el("div", "studio-handle");
      hd.dataset.h = h;
      overlay.appendChild(hd);
    });
    const tag = el("div", "studio-tag");
    overlay.appendChild(tag);
    document.body.appendChild(overlay);

    const guideLayer = el("div", null);
    document.body.appendChild(guideLayer);

    const banner = el("div", "studio-banner");
    banner.style.display = "none";

    const exportModal = el("div", "studio-export");
    exportModal.hidden = true;
    const exportCard = el("div", "studio-export-card");
    exportCard.appendChild(el("h3", null, "Exporter les modifications Studio"));
    const taCSS = el("textarea"); taCSS.rows = 6; taCSS.readOnly = true;
    const taJSON = el("textarea"); taJSON.rows = 5; taJSON.readOnly = true;
    const taSum = el("textarea"); taSum.rows = 8; taSum.readOnly = true;
    exportCard.appendChild(el("h4", null, "CSS — variables modifiées seules"));
    exportCard.appendChild(taCSS);
    exportCard.appendChild(el("h4", null, "JSON"));
    exportCard.appendChild(taJSON);
    exportCard.appendChild(el("h4", null, "Résumé (à transmettre à l'agent)"));
    exportCard.appendChild(taSum);
    const exportActions = el("div", "studio-export-actions");
    const copyCSS = el("button", "studio-btn", "Copier CSS");
    const copyJSON = el("button", "studio-btn", "Copier JSON");
    const copySum = el("button", "studio-btn", "Copier le résumé");
    const dlCSS = el("button", "studio-btn", "Télécharger .css");
    const closeExport = el("button", "studio-btn", "Fermer");
    [copyCSS, copyJSON, copySum, dlCSS, closeExport].forEach(function (b) { exportActions.appendChild(b); });
    exportCard.appendChild(exportActions);
    exportModal.appendChild(exportCard);
    document.body.appendChild(exportModal);

    const showBtn = el("button", "studio-show", "Afficher Studio");
    showBtn.type = "button";
    document.body.appendChild(showBtn);

    function select(t) {
      selected = t;
      const btns = layersPanel.querySelectorAll(".studio-layer");
      for (const b of btns) b.classList.toggle("is-sel", !!t && b.dataset.id === t.id);
      refreshInspector();
    }

    function tagText(r, ref) {
      if (selected && selected.id === "logo") return "h " + Math.round(r.height) + " px";
      return "L " + pct(r.left / ref.width * 100) + " · T " + pct(r.top / ref.height * 100) + " · " + Math.round(r.width) + "×" + Math.round(r.height) + " px";
    }

    function tick() {
      if (selected && selected.el) {
        const node = selected.el();
        const r = node ? node.getBoundingClientRect() : null;
        if (r && r.width > 1 && r.height > 1) {
          overlay.style.display = "block";
          overlay.style.left = r.left + "px";
          overlay.style.top = r.top + "px";
          overlay.style.width = r.width + "px";
          overlay.style.height = r.height + "px";
          tag.textContent = tagText(r, refRect());
        } else {
          overlay.style.display = "none";
        }
      } else {
        overlay.style.display = "none";
      }
      requestAnimationFrame(tick);
    }

    let drag = null;

    overlay.addEventListener("pointerdown", function (e) {
      if (!selected) return;
      const h = e.target.closest(".studio-handle");
      const node = selected.el();
      if (!node) return;
      const r = node.getBoundingClientRect();
      drag = {
        mode: h ? "resize" : "move",
        handle: h ? h.dataset.h : null,
        startBox: { l: r.left, t: r.top, w: r.width, h: r.height },
        sx: e.clientX, sy: e.clientY,
        aspect: r.width / r.height,
        guides: []
      };
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener("pointermove", function (e) {
      if (!drag || !selected) return;
      const ref = refRect();
      const dx = e.clientX - drag.sx;
      const dy = e.clientY - drag.sy;
      const s = drag.startBox;
      let box = { l: s.l, t: s.t, w: s.w, h: s.h };
      if (drag.mode === "move") {
        if (selected.id === "logo") box.h = s.h + dy;
        else { box.l = s.l + dx; box.t = s.t + dy; }
      } else {
        if (selected.id === "logo") {
          box.h = s.h + dy;
        } else {
          const hd = drag.handle;
          if (hd.indexOf("e") !== -1) box.w = s.w + dx;
          if (hd.indexOf("s") !== -1) box.h = s.h + dy;
          if (hd.indexOf("w") !== -1) { box.w = s.w - dx; box.l = s.l + dx; }
          if (hd.indexOf("n") !== -1) { box.h = s.h - dy; box.t = s.t + dy; }
          if (e.shiftKey && hd.length === 2) {
            box.h = box.w / drag.aspect;
            if (hd.indexOf("n") !== -1) box.t = s.t + s.h - box.h;
          }
        }
      }
      box = snapBox(box, selected, ref, drag);
      const vars = selected.boxToVars(box, ref);
      for (const n in vars) root.style.setProperty(n, vars[n]);
      refreshInspector();
      drawGuides(drag.guides);
    });

    window.addEventListener("pointerup", function () {
      if (!drag) return;
      drag = null;
      drawGuides([]);
      pushHistory();
      saveDraft();
    });

    function snapBox(box, target, ref, dragRef) {
      const linesX = [0, ref.width / 2, ref.width];
      const linesY = [0, ref.height / 2, ref.height];
      const other = target.id === "courant" ? TARGETS[1] : target.id === "suivant" ? TARGETS[0] : null;
      if (other && other.el) {
        const node = other.el();
        if (node) {
          const r = node.getBoundingClientRect();
          linesX.push(r.left, r.right, r.left + r.width / 2);
          linesY.push(r.top, r.bottom, r.top + r.height / 2);
        }
      }
      const T = 8;
      dragRef.guides = [];
      let best = null;
      for (const x of linesX) {
        for (const edge of ["l", "r"]) {
          const pos = edge === "l" ? box.l : box.l + box.w;
          const d = x - pos;
          if (Math.abs(d) <= T && (!best || Math.abs(d) < Math.abs(best.d))) best = { d: d, line: x, axis: "x" };
        }
      }
      if (best && best.axis === "x") {
        box.l += best.d;
        dragRef.guides.push({ axis: "x", pos: best.line });
      }
      best = null;
      for (const y of linesY) {
        for (const edge of ["t", "b"]) {
          const pos = edge === "t" ? box.t : box.t + box.h;
          const d = y - pos;
          if (Math.abs(d) <= T && (!best || Math.abs(d) < Math.abs(best.d))) best = { d: d, line: y, axis: "y" };
        }
      }
      if (best && best.axis === "y") {
        box.t += best.d;
        dragRef.guides.push({ axis: "y", pos: best.line });
      }
      box.w = clamp(box.w, 40, ref.width - 4);
      box.h = clamp(box.h, 40, ref.height - 4);
      return box;
    }

    function drawGuides(guides) {
      guideLayer.innerHTML = "";
      for (const g of guides) {
        const d = el("div", "studio-guide " + (g.axis === "x" ? "v" : "h"));
        if (g.axis === "x") d.style.left = g.pos + "px";
        else d.style.top = g.pos + "px";
        guideLayer.appendChild(d);
      }
    }

    function isTyping(e) {
      const t = e.target;
      return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
    }

    document.addEventListener("keydown", function (e) {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "z" && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (k === "y" || (k === "z" && e.shiftKey))) { e.preventDefault(); redo(); return; }
      if (k === "h" && !isTyping(e)) { e.preventDefault(); toggleHidden(); return; }
      if (e.key === "Escape") { select(null); return; }
      if (selected && !isTyping(e) && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        e.stopPropagation();
        const step = e.shiftKey ? 10 : 1;
        const node = selected.el();
        if (!node) return;
        const r = node.getBoundingClientRect();
        const ref = refRect();
        const box = { l: r.left, t: r.top, w: r.width, h: r.height };
        if (selected.id === "logo") {
          if (e.key === "ArrowUp") box.h -= step;
          if (e.key === "ArrowDown") box.h += step;
        } else {
          if (e.key === "ArrowLeft") box.l -= step;
          if (e.key === "ArrowRight") box.l += step;
          if (e.key === "ArrowUp") box.t -= step;
          if (e.key === "ArrowDown") box.t += step;
        }
        const vars = selected.boxToVars(box, ref);
        for (const n in vars) root.style.setProperty(n, vars[n]);
        pushHistory(true);
        saveDraft();
        refreshInspector();
      }
    }, true);

    document.addEventListener("click", function (e) {
      if (e.target.closest(".studio-toolbar, .studio-layers, .studio-inspector, .studio-export, .studio-banner, .studio-show, .studio-overlay")) return;
      const f = e.target.closest(".fiche");
      if (f) {
        if (f.classList.contains("is-current")) select(TARGETS[0]);
        else if (f.classList.contains("is-next")) select(TARGETS[1]);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.target.closest(".site-header--overlay .brand")) {
        select(TARGETS[2]);
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    function parseVar(n, v) {
      v = String(v).trim();
      if (!v) return null;
      if (n === "--logoH" || n === "--fichePad") return Math.max(8, parseFloat(v) || 0) + "px";
      if (n === "--peekOpacity") return String(clamp(parseFloat(v) || 0, 0, 1));
      if (n === "--ficheXvw" || n === "--ficheStepvw") {
        const n2 = parseFloat(v) || 0;
        return n2 + (v.trim().endsWith("vw") ? "vw" : "vw");
      }
      return v;
    }

    function refreshInspector() {
      inspector.innerHTML = "";
      if (!selected) {
        inspector.appendChild(el("p", "studio-insp-empty", "Aucun élément sélectionné — cliquez sur un cadre ou le logo, ou choisissez un calque."));
        return;
      }
      inspector.appendChild(el("p", "studio-insp-head", selected.label));
      for (const n of selected.vars) {
        const row = el("div", "studio-insp-row");
        const lab = el("label", null, VAR_LABEL[n] || n);
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = inlineVar(n) || base[n] || "";
        inp.setAttribute("aria-label", VAR_LABEL[n] || n);
        inp.addEventListener("change", function () {
          const v = parseVar(n, inp.value);
          if (v == null) { inp.value = inlineVar(n) || base[n] || ""; return; }
          setVars({ [n]: v }, true);
        });
        row.appendChild(lab);
        row.appendChild(inp);
        inspector.appendChild(row);
      }
      const node = selected.el();
      if (node) {
        const r = node.getBoundingClientRect();
        const ref = refRect();
        const info = el("div", "studio-boxinfo",
          selected.id === "logo"
            ? "h = " + Math.round(r.height) + " px"
            : "L " + pct(r.left / ref.width * 100) + " · T " + pct(r.top / ref.height * 100) + " · " + pct(r.width / ref.width * 100) + " × " + pct(r.height / ref.height * 100));
        inspector.appendChild(info);
      }
    }

    function changedVars() {
      const out = {};
      for (const n of MANAGED) {
        const cur = inlineVar(n);
        if (cur && cur !== (base[n] || "")) out[n] = cur;
      }
      return out;
    }
    function buildCSS() {
      const c = changedVars();
      let s = ":root {\n";
      for (const n in c) s += "  " + n + ": " + c[n] + ";\n";
      return s + "}";
    }
    function buildJSON() {
      return JSON.stringify({ site: "picturial", mode: "studio", exportedAt: new Date().toISOString(), changedVars: changedVars() }, null, 2);
    }
    function buildSummary() {
      const c = changedVars();
      const lines = ["Studio Picturial — modifications à valider (" + new Date().toLocaleString("fr-FR") + ")"];
      let any = false;
      for (const t of TARGETS) {
        const rows = t.vars.filter(function (n) { return c[n]; });
        if (!rows.length) continue;
        any = true;
        lines.push("");
        lines.push(t.label + " :");
        for (const n of rows) lines.push("  - " + n + " : " + (base[n] || "(défaut)") + " → " + c[n]);
      }
      if (!any) lines.push("Aucune modification par rapport au :root actuel.");
      lines.push("");
      lines.push("Bloc CSS à coller dans :root de assets/css/style.css :");
      lines.push(buildCSS());
      return lines.join("\n");
    }

    function copyText(txt, btn) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { flash(btn, "Copié"); }, function () { flash(btn, "Sélectionne + Ctrl+C"); });
      } else {
        const ta = document.createElement("textarea");
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); flash(btn, "Copié"); } catch (e) { flash(btn, "Sélectionne + Ctrl+C"); }
        ta.remove();
      }
    }
    function flash(btn, msg) {
      const old = btn.textContent;
      btn.textContent = msg;
      setTimeout(function () { btn.textContent = old; }, 1200);
    }
    function download(name, content, type) {
      const blob = new Blob([content], { type: type || "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    }

    pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    hideBtn.addEventListener("click", toggleHidden);
    showBtn.addEventListener("click", toggleHidden);
    undoBtn.addEventListener("click", undo);
    redoBtn.addEventListener("click", redo);
    resetSelBtn.addEventListener("click", function () {
      if (!selected) return;
      const map = {};
      for (const n of selected.vars) map[n] = null;
      for (const n in map) root.style.removeProperty(n);
      pushHistory();
      saveDraft();
      refreshInspector();
    });
    resetAllBtn.addEventListener("click", function () {
      for (const n of MANAGED) root.style.removeProperty(n);
      clearDraft();
      pushHistory();
      refreshInspector();
    });
    exportBtn.addEventListener("click", function () {
      taCSS.value = buildCSS();
      taJSON.value = buildJSON();
      taSum.value = buildSummary();
      exportModal.hidden = false;
    });
    closeExport.addEventListener("click", function () { exportModal.hidden = true; });
    exportModal.addEventListener("click", function (e) { if (e.target === exportModal) exportModal.hidden = true; });
    copyCSS.addEventListener("click", function () { copyText(taCSS.value, copyCSS); });
    copyJSON.addEventListener("click", function () { copyText(taJSON.value, copyJSON); });
    copySum.addEventListener("click", function () { copyText(taSum.value, copySum); });
    dlCSS.addEventListener("click", function () { download("picturial-studio-vars.css", buildCSS(), "text/css"); });
    quitBtn.addEventListener("click", function () { window.location.href = window.location.pathname; });

    function setPaused(on) {
      paused = on;
      root.classList.toggle("studio-paused", on);
      pauseBtn.classList.toggle("is-on", on);
      pauseBtn.textContent = on ? "Anim : en pause" : "Anim : actives";
    }
    function toggleHidden() {
      root.classList.toggle("studio-hidden");
    }

    function showBanner(ts) {
      banner.innerHTML = "";
      banner.appendChild(el("span", null, "Brouillon Studio restauré (" + new Date(ts).toLocaleString("fr-FR") + ")"));
      const keep = el("button", "studio-btn", "Garder");
      const wipe = el("button", "studio-btn", "Brouillon vidé (déjà intégré)");
      keep.type = "button"; wipe.type = "button";
      keep.addEventListener("click", function () { banner.style.display = "none"; });
      wipe.addEventListener("click", function () { clearDraft(); banner.style.display = "none"; });
      banner.appendChild(keep);
      banner.appendChild(wipe);
      banner.style.display = "flex";
      document.body.appendChild(banner);
    }

    const draftTs = loadDraft();
    setPaused(true);
    pushHistory();
    select(TARGETS[0]);
    if (draftTs) showBanner(draftTs);
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
