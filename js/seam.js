/* ============================================================
   seam.js — the draggable design/code seam
   Drives the --seam CSS var (0–100, % from the left edge).
   Entrance: sweeps from 0 to REST, then breathes gently until
   the visitor first touches it. Drag + arrow keys after that.
   ============================================================ */

(function () {
  "use strict";

  const stage  = document.getElementById("seam-stage");
  const handle = document.getElementById("seam-handle");
  if (!stage || !handle) return;

  const REST = 38;           // resting seam position after the entrance (%)
  const ENTRANCE_S = 1.4;    // entrance sweep duration (s)

  let pct = 0;
  let interacted = false;
  let raf = null;

  function apply(p) {
    pct = Math.min(100, Math.max(0, p));
    stage.style.setProperty("--seam", pct + "%");
    handle.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  /* ---- entrance sweep + idle breathing ---- */

  const reduceMotion =
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    navigator.webdriver ||
    location.search.indexOf("static") > -1; // ?static = screenshot/test mode

  if (reduceMotion) {
    apply(REST);
  } else {
    const t0 = performance.now();
    const idle = (now) => {
      if (interacted) return;
      const t = (now - t0) / 1000;
      if (t < ENTRANCE_S) {
        const k = t / ENTRANCE_S;
        apply(REST * (1 - Math.pow(1 - k, 3))); // ease-out cubic
      } else {
        apply(REST + Math.sin((t - ENTRANCE_S) * 1.6) * 1.5); // breathe
      }
      raf = requestAnimationFrame(idle);
    };
    raf = requestAnimationFrame(idle);
  }

  function stopIdle() {
    if (interacted) return;
    interacted = true;
    if (raf) cancelAnimationFrame(raf);
  }

  /* ---- drag (pointer events: mouse + touch + pen) ---- */

  function pctFromEvent(e) {
    const r = stage.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  }

  handle.addEventListener("pointerdown", (e) => {
    stopIdle();
    handle.setPointerCapture(e.pointerId);
    stage.classList.add("is-dragging");
    apply(pctFromEvent(e));
    e.preventDefault();
  });

  handle.addEventListener("pointermove", (e) => {
    if (!handle.hasPointerCapture(e.pointerId)) return;
    apply(pctFromEvent(e));
  });

  ["pointerup", "pointercancel"].forEach((type) =>
    handle.addEventListener(type, (e) => {
      if (handle.hasPointerCapture(e.pointerId)) {
        handle.releasePointerCapture(e.pointerId);
      }
      stage.classList.remove("is-dragging");
    })
  );

  /* ---- keyboard (it's a slider) ---- */

  handle.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft")  { stopIdle(); apply(pct - step); e.preventDefault(); }
    if (e.key === "ArrowRight") { stopIdle(); apply(pct + step); e.preventDefault(); }
  });
})();
