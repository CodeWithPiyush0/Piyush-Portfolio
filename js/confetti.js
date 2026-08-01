/* ============================================================
   confetti.js — the Playground confetti-button toy
   Pure DOM + Web Animations API, no canvas. Particles burst from
   the button, fall with a little spin, then clean themselves up.
   ============================================================ */

(function () {
  "use strict";

  const btn = document.getElementById("confetti-btn");
  if (!btn) return;

  const tile = btn.closest(".pg-tile");
  const COLORS = ["#0D99FF", "#FAF8F3", "#2FB344", "#FFB020", "#FF5C5C"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  btn.addEventListener("click", () => {
    if (reduceMotion) return;

    const rect = btn.getBoundingClientRect();
    const home = tile.getBoundingClientRect();
    const originX = rect.left - home.left + rect.width / 2;
    const originY = rect.top - home.top + rect.height / 2;

    for (let i = 0; i < 36; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      piece.style.background = COLORS[i % COLORS.length];
      if (i % 3 === 0) piece.style.borderRadius = "50%";
      tile.appendChild(piece);

      const angle = Math.random() * Math.PI * 2;
      const power = 60 + Math.random() * 130;
      const dx = Math.cos(angle) * power;
      const dy = Math.sin(angle) * power - 80; // bias upward
      const fall = 160 + Math.random() * 120;
      const spin = (Math.random() - 0.5) * 720;
      const life = 700 + Math.random() * 700;

      piece
        .animate(
          [
            { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${dx}px, ${dy}px) rotate(${spin / 2}deg)`,
              opacity: 1,
              offset: 0.35,
            },
            {
              transform: `translate(${dx * 1.3}px, ${dy + fall}px) rotate(${spin}deg)`,
              opacity: 0,
            },
          ],
          { duration: life, easing: "cubic-bezier(0.15, 0.6, 0.4, 1)" }
        )
        .addEventListener("finish", () => piece.remove());
    }
  });
})();
