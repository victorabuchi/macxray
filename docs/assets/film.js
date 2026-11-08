// The website's films: real screenshots of MacXray (scripts/film-shots.mjs) played scene by scene with a cursor, inside
// a MacXray window, with a tab for each view. Adapted from Statiku's landing-page film. Each scene is a function of its
// own clock, so pausing, jumping to a tab and reduced motion cost nothing. It plays only while on screen, and never for
// someone who asked for less motion: they see each scene's last picture. The Light or Dark pictures follow the Mac.
// A page can have several films (data-film), each playing its own list of scenes (data-scenes) from the same pictures.
(() => {
  const TICK = 100;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const darkMode = matchMedia("(prefers-color-scheme: dark)");
  const src = (document.currentScript && document.currentScript.dataset.src) || "assets/film/";
  let pictures = null;
  const loadPictures = (v) => (pictures = pictures || fetch(`${src}film.json?v=${v || ""}`).then((r) => r.json()));
  for (const root of document.querySelectorAll("[data-film]")) play(root);

  function play(root) {
    const scenes = window.MACXRAY_SCENES[root.dataset.scenes || "main"];
    if (!scenes) return;
    const $ = (sel) => root.querySelector(sel);
    let data = null, set = "light", clock = { scene: 0, t: 0 }, playing = true, visible = false, scale = 1;

    root.innerHTML = `
      <div class="film-stage">
        <div class="film-glow" aria-hidden="true"></div>
        <div class="film-window">
          <div class="film-chrome" aria-hidden="true"><span class="film-dots"><i></i><i></i><i></i></span><span class="film-title" data-title></span></div>
          <div class="film-viewport" data-viewport aria-hidden="true">
            <div class="film-frames" data-frames></div>
            <div class="film-label" data-label></div>
            <div class="film-cursor" data-cursor><i class="film-ripple" data-ripple></i><svg width="22" height="26" viewBox="0 0 18 22"><path d="M1 1L1 17L5 13L8 20L10.5 19L7.5 12L13 12Z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg></div>
          </div>
          <button type="button" class="film-play" data-play aria-label="Pause"></button>
        </div>
        <div class="film-tabs" role="tablist" aria-label="Views" data-tabs></div>
      </div>
      <p class="film-caption" data-caption aria-live="polite"></p>`;
    const el = { frames: $("[data-frames]"), cursor: $("[data-cursor]"), ripple: $("[data-ripple]"), tabs: $("[data-tabs]"), caption: $("[data-caption]"),
      title: $("[data-title]"), play: $("[data-play]"), viewport: $("[data-viewport]"), glow: $(".film-glow"), label: $("[data-label]") };
    el.tabs.innerHTML = scenes.map((s, i) => `<button type="button" role="tab" class="film-tab" data-i="${i}">${s.tab}<i class="film-progress"></i></button>`).join("");
    const tabEls = [...el.tabs.children];

    const frameAt = (def, t) => {
      let f = def.frames[0];
      for (const x of def.frames) if (x[0] <= t) f = x;
      return f[1];
    };
    const beatAt = (def, t) => {
      let b = [0, null];
      for (const x of def.beats) if (x[0] <= t) b = x;
      return { target: b[1], press: Boolean(b[2] && t < b[0] + b[2]), key: b[0], label: b[3] || null };
    };

    function build() {
      set = darkMode.matches && data.dark ? "dark" : "light";
      el.cursor.style.transition = "none";
      el.label.style.transition = "none";
      requestAnimationFrame(() => { el.cursor.style.transition = ""; el.label.style.transition = ""; });
      const d = data[set];
      el.frames.innerHTML = Object.entries(d.frames).map(([name, file]) => `<img src="${src}${file}?v=${root.dataset.v || ""}" alt="" data-name="${name}" decoding="async" draggable="false">`).join("");
      el.viewport.style.aspectRatio = `${d.size[0]} / ${d.size[1]}`;
      shown = "";
      resize();
      render(true);
    }
    function resize() {
      if (data) scale = el.viewport.clientWidth / data[set].size[0];
    }

    let shown = "";
    function render(force) {
      if (!data) return;
      const def = scenes[clock.scene], t = reduced ? def.dur - 1 : clock.t, d = data[set];
      const name = frameAt(def, t);
      if (force || name !== shown) {
        shown = name;
        for (const img of el.frames.children) img.classList.toggle("on", img.dataset.name === name);
      }
      el.title.textContent = `MacXray · ${def.tab}`;
      el.glow.style.background = `radial-gradient(closest-side, ${def.glow}, transparent)`;
      tabEls.forEach((b, i) => {
        b.setAttribute("aria-selected", String(i === clock.scene));
        b.querySelector(".film-progress").style.width = i === clock.scene ? `${(t / def.dur) * 100}%` : "0";
      });
      if (el.caption.dataset.id !== def.id) {
        el.caption.dataset.id = def.id;
        el.caption.innerHTML = `<b>${def.title}</b> ${def.caption}`;
        el.caption.classList.remove("in");
        void el.caption.offsetWidth;
        el.caption.classList.add("in");
      }
      // A box belongs to the picture it was measured on: the cursor only shows over that picture.
      const beat = beatAt(def, t), owner = beat.target && d.owner && d.owner[beat.target];
      const r = beat.target && (!owner || owner === name) && d.rects[beat.target];
      if (!r) el.cursor.style.opacity = "0";
      else {
        el.cursor.style.transform = `translate(${(r.x + Math.min(r.w / 2, 70)) * scale}px, ${(r.y + Math.min(r.h / 2, 60)) * scale}px)`;
        el.cursor.style.opacity = "1";
      }
      // What the cursor is pointing at, in a label beside it (on its left near the right edge).
      if (r && beat.label && !reduced) {
        const x = (r.x + Math.min(r.w / 2, 70)) * scale, y = (r.y + Math.min(r.h / 2, 60)) * scale;
        if (el.label.textContent !== beat.label) el.label.textContent = beat.label;
        const right = x + 26 + el.label.offsetWidth < el.viewport.clientWidth - 8;
        el.label.style.transform = `translate(${right ? x + 26 : x - el.label.offsetWidth - 14}px, ${Math.max(6, y + 16)}px)`;
        el.label.style.setProperty("--glow", def.glow);
        el.label.style.opacity = "1";
      } else el.label.style.opacity = "0";
      if (beat.press && el.ripple.dataset.k !== `${clock.scene}-${beat.key}`) {
        el.ripple.dataset.k = `${clock.scene}-${beat.key}`;
        el.ripple.classList.remove("go");
        void el.ripple.offsetWidth;
        el.ripple.classList.add("go");
      }
      el.play.setAttribute("aria-label", running() ? "Pause" : "Play");
      el.play.innerHTML = running()
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l14 8-14 8V4z"/></svg>';
    }

    const running = () => playing && visible && !reduced;
    setInterval(() => {
      if (!running()) return;
      const def = scenes[clock.scene];
      clock = clock.t + TICK >= def.dur ? { scene: (clock.scene + 1) % scenes.length, t: 0 } : { scene: clock.scene, t: clock.t + TICK };
      render();
      const tab = tabEls[clock.scene], bar = el.tabs;
      if (clock.t === 0 && tab) bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }, TICK);

    el.tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".film-tab");
      if (!b) return;
      clock = { scene: +b.dataset.i, t: 0 };
      playing = true;
      render();
    });
    el.play.addEventListener("click", () => {
      playing = !playing;
      render();
    });
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      render();
    }, { threshold: 0.2 }).observe(root);
    new ResizeObserver(() => {
      resize();
      render();
    }).observe(root);
    darkMode.addEventListener("change", () => { if (data) build(); });
    loadPictures(root.dataset.v).then((json) => {
      data = json;
      build();
    });
  }
})();
