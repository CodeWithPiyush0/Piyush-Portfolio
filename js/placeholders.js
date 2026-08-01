/* ============================================================
   placeholders.js — links that aren't wired up yet (href="#")
   Instead of a dead jump to the page top, they refuse with a
   little shake — honest "not built yet" feedback. Remove a
   link's href="#" (give it a real destination) and it opts out
   automatically.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (reduceMotion) return;
      link.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(5px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 300, easing: "ease-out" }
      );
    });
  });
})();
