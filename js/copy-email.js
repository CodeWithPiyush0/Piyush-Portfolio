/* ============================================================
   copy-email.js — click-to-copy email in the contact section
   No form, no backend: the address copies to the clipboard and
   the button confirms. Falls back to mailto if clipboard fails.
   ============================================================ */

(function () {
  "use strict";

  const btn = document.getElementById("copy-email");
  if (!btn) return;

  const EMAIL = "piyush0codes@gmail.com";
  const IDLE_LABEL = EMAIL + " · copy";
  let timer = null;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      btn.textContent = EMAIL + " · copied ✓";
      btn.classList.add("is-copied");
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = IDLE_LABEL;
        btn.classList.remove("is-copied");
      }, 1800);
    } catch (err) {
      // clipboard unavailable (very old browser / permissions) — fall back
      window.location.href = "mailto:" + EMAIL;
    }
  });
})();
