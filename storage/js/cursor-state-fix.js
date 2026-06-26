(function () {
   const styleId = "cursor-state-fix-style";
   const hoverClass = "cursor-clickable-fix";
   const key = "nexusCustomCursor";

   function customCursorEnabled() {
      const saved = localStorage.getItem(key);
      return saved === null ? true : saved === "true";
   }

   function css() {
      return `
         html,
         body,
         * {
            cursor: default !important;
         }

         a,
         a *,
         a[href],
         a[href] *,
         button,
         button *,
         select,
         select *,
         option,
         summary,
         summary *,
         label[for],
         label[for] *,
         [href],
         [href] *,
         [onclick],
         [onclick] *,
         [role="button"],
         [role="button"] *,
         [data-url],
         [data-url] *,
         [data-href],
         [data-href] *,
         [data-src],
         [data-src] *,
         [data-link],
         [data-link] *,
         [data-path],
         [data-path] *,
         [data-game],
         [data-game] *,
         [data-app],
         [data-app] *,
         .cursor-clickable-fix,
         .cursor-clickable-fix *,
         .game-card,
         .game-card *,
         .games-card,
         .games-card *,
         .game-button,
         .game-button *,
         .game-item,
         .game-item *,
         .game-tile,
         .game-tile *,
         .game,
         .game *,
         .app-card,
         .app-card *,
         .apps-card,
         .apps-card *,
         .app-button,
         .app-button *,
         .app-item,
         .app-item *,
         .app-tile,
         .app-tile *,
         .app,
         .app *,
         .card,
         .card *,
         .tile,
         .tile *,
         .item,
         .item *,
         input[type="button"],
         input[type="submit"],
         input[type="reset"],
         input[type="checkbox"],
         input[type="radio"],
         input[type="file"] {
            cursor: pointer !important;
         }

         input:not([type]),
         input[type="text"],
         input[type="password"],
         input[type="email"],
         input[type="search"],
         input[type="url"],
         input[type="tel"],
         input[type="number"],
         textarea,
         textarea *,
         [contenteditable="true"],
         [contenteditable="true"] * {
            cursor: text !important;
         }
      `;
   }

   function ensureStyle(doc) {
      if (!doc || !doc.head) {
         return null;
      }

      let style = doc.getElementById(styleId);

      if (!style) {
         style = doc.createElement("style");
         style.id = styleId;
         doc.head.appendChild(style);
      }

      return style;
   }

   function applyDoc(doc) {
      const style = ensureStyle(doc);

      if (!style) {
         return;
      }

      style.textContent = customCursorEnabled() ? "" : css();
   }

   function looksClickable(element) {
      if (!element || element.nodeType !== 1) {
         return false;
      }

      if (element.closest("input, textarea, [contenteditable='true']")) {
         return false;
      }

      if (element.closest("a, button, select, summary, label[for], [href], [onclick], [role='button'], [data-url], [data-href], [data-src], [data-link], [data-path], [data-game], [data-app]")) {
         return true;
      }

      let current = element;

      for (let i = 0; current && i < 5; i++) {
         const text = (
            (current.className || "") + " " +
            (current.id || "") + " " +
            (current.getAttribute && (current.getAttribute("aria-label") || current.getAttribute("title") || "") || "")
         ).toLowerCase();

         if (
            text.includes("game") ||
            text.includes("app") ||
            text.includes("card") ||
            text.includes("tile") ||
            text.includes("item") ||
            text.includes("play") ||
            text.includes("launch")
         ) {
            return true;
         }

         current = current.parentElement;
      }

      return false;
   }

   function markClickableFromPoint(event) {
      if (customCursorEnabled()) {
         return;
      }

      document.querySelectorAll("." + hoverClass).forEach(function (element) {
         element.classList.remove(hoverClass);
      });

      let element = event.target;

      while (element && element !== document.body && element.nodeType === 1) {
         if (looksClickable(element)) {
            element.classList.add(hoverClass);
            return;
         }

         element = element.parentElement;
      }
   }

   function applyFrames() {
      document.querySelectorAll("iframe").forEach(function (frame) {
         try {
            applyDoc(frame.contentDocument);
         } catch (error) {}
      });
   }

   function apply() {
      applyDoc(document);
      applyFrames();
   }

   window.applyCursorStateFix = apply;

   document.addEventListener("mousemove", markClickableFromPoint, true);
   document.addEventListener("mouseover", markClickableFromPoint, true);

   window.addEventListener("storage", function (event) {
      if (
         event.key === "nexusCustomCursor" ||
         event.key === "nexusCursorDefault" ||
         event.key === "nexusCursorPointer" ||
         event.key === "nexusCursorPreset"
      ) {
         setTimeout(apply, 0);
         setTimeout(apply, 100);
      }
   });

   window.addEventListener("message", function (event) {
      if (!event.data || event.data.type !== "nexus-cursor-change") {
         return;
      }

      setTimeout(apply, 0);
      setTimeout(apply, 100);
   });

   document.addEventListener("DOMContentLoaded", apply);
   window.addEventListener("load", apply);
   window.addEventListener("focus", apply);

   setInterval(function () {
      if (!customCursorEnabled()) {
         applyFrames();
      }
   }, 500);

   apply();
}());
