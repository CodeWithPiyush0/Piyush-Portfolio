/* ============================================================
   reveal.js — scroll-in reveal for [data-reveal] elements
   Adds .js to <html> so the hidden initial state only applies
   when JS is running (no-JS visitors see everything).
   Stagger: set --d (transition-delay) inline via data-reveal="N"
   where N is the stagger slot (0, 1, 2 …) × 80ms.
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const els = document.querySelectorAll("[data-reveal]");

  // Automated browsers or ?static (screenshot verification): skip the reveal
  // choreography entirely — IntersectionObserver doesn't fire reliably under
  // virtual time, which leaves the page blank in captures.
  if (navigator.webdriver || location.search.indexOf("static") > -1) {
    document.documentElement.classList.add("static-mode");
    document.documentElement.style.scrollBehavior = "auto";
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  if (!els.length || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  els.forEach((el) => {
    const slot = parseInt(el.getAttribute("data-reveal"), 10);
    if (slot > 0) el.style.setProperty("--d", slot * 0.08 + "s");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
})();
