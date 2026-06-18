(function () {
   const styleId = "nexus-cursor-style";
   let lastSignature = "";

   function cleanPath(value) {
      return String(value || "").replace(/\\/g, "/").replace(/^https?:\/\/[^/]+/i, "");
   }

   function getSaved(key, fallback) {
      const value = localStorage.getItem(key);
      return value === null || value === "" ? fallback : value;
   }

   function setSaved(key, value) {
      localStorage.setItem(key, value);
   }

   function getEnabled() {
      const saved = localStorage.getItem("nexusCustomCursor");
      return saved === null ? true : saved === "true";
   }

   function getNormalCursor() {
      return cleanPath(getSaved("nexusCursorDefault", "/storage/icons/cursor/cursor.png"));
   }

   function inferPointer(normal) {
      normal = cleanPath(normal);

      if (/\/cursor\.png$/i.test(normal)) {
         return normal.replace(/\/cursor\.png$/i, "/pointer.png");
      }

      const parts = normal.split("/");
      parts.pop();

      if (parts.length > 1) {
         return parts.join("/") + "/pointer.png";
      }

      return "/storage/icons/cursor/pointer.png";
   }

   function getPointerCursor() {
      const normal = getNormalCursor();
      const saved = cleanPath(localStorage.getItem("nexusCursorPointer"));

      if (!saved) {
         return inferPointer(normal);
      }

      if (
         saved === "/storage/icons/cursor/pointer.png" &&
         normal !== "/storage/icons/cursor/cursor.png"
      ) {
         return inferPointer(normal);
      }

      return saved;
   }

   function getSignature() {
      return [
         getEnabled() ? "on" : "off",
         getNormalCursor(),
         getPointerCursor()
      ].join("|");
   }

   function ensureStyle() {
      let style = document.getElementById(styleId);

      if (!style) {
         style = document.createElement("style");
         style.id = styleId;
         document.head.appendChild(style);
      }

      return style;
   }

   function applyCursor(force) {
      const signature = getSignature();

      if (!force && signature === lastSignature) {
         return;
      }

      lastSignature = signature;

      const enabled = getEnabled();
      const normal = getNormalCursor();
      const pointer = getPointerCursor();
      const style = ensureStyle();

      setSaved("nexusCursorDefault", normal);
      setSaved("nexusCursorPointer", pointer);

      document.documentElement.classList.toggle("nexus-cursor-on", enabled);
      document.documentElement.classList.toggle("nexus-cursor-off", !enabled);

      if (!enabled) {
         style.textContent = "";
         return;
      }

      style.textContent = `
         html.nexus-cursor-on,
         html.nexus-cursor-on body,
         html.nexus-cursor-on body *,
         html.nexus-cursor-on *::before,
         html.nexus-cursor-on *::after {
            cursor: url("${normal}") 0 0, auto !important;
         }

         html.nexus-cursor-on a,
         html.nexus-cursor-on a *,
         html.nexus-cursor-on a:hover,
         html.nexus-cursor-on a:hover *,
         html.nexus-cursor-on button,
         html.nexus-cursor-on button *,
         html.nexus-cursor-on button:hover,
         html.nexus-cursor-on button:hover *,
         html.nexus-cursor-on select,
         html.nexus-cursor-on select:hover,
         html.nexus-cursor-on option,
         html.nexus-cursor-on label,
         html.nexus-cursor-on label:hover,
         html.nexus-cursor-on [role="button"],
         html.nexus-cursor-on [role="button"] *,
         html.nexus-cursor-on [role="button"]:hover,
         html.nexus-cursor-on [role="button"]:hover *,
         html.nexus-cursor-on [onclick],
         html.nexus-cursor-on [onclick] *,
         html.nexus-cursor-on [onclick]:hover,
         html.nexus-cursor-on [onclick]:hover *,
         html.nexus-cursor-on summary,
         html.nexus-cursor-on summary:hover,
         html.nexus-cursor-on .clickable,
         html.nexus-cursor-on .clickable *,
         html.nexus-cursor-on .clickable:hover,
         html.nexus-cursor-on .clickable:hover *,
         html.nexus-cursor-on .nav-item,
         html.nexus-cursor-on .nav-item *,
         html.nexus-cursor-on .nav-item:hover,
         html.nexus-cursor-on .nav-item:hover *,
         html.nexus-cursor-on .game-button,
         html.nexus-cursor-on .game-button *,
         html.nexus-cursor-on .game-button:hover,
         html.nexus-cursor-on .game-button:hover *,
         html.nexus-cursor-on .app-button,
         html.nexus-cursor-on .app-button *,
         html.nexus-cursor-on .app-button:hover,
         html.nexus-cursor-on .app-button:hover *,
         html.nexus-cursor-on .game-card,
         html.nexus-cursor-on .game-card *,
         html.nexus-cursor-on .game-card:hover,
         html.nexus-cursor-on .game-card:hover *,
         html.nexus-cursor-on .app-card,
         html.nexus-cursor-on .app-card *,
         html.nexus-cursor-on .app-card:hover,
         html.nexus-cursor-on .app-card:hover *,
         html.nexus-cursor-on .proxy-tab,
         html.nexus-cursor-on .proxy-tab *,
         html.nexus-cursor-on .proxy-tab:hover,
         html.nexus-cursor-on .proxy-tab:hover *,
         html.nexus-cursor-on .proxy-tab-close,
         html.nexus-cursor-on .proxy-tab-close *,
         html.nexus-cursor-on .proxy-tab-close:hover,
         html.nexus-cursor-on .proxy-tab-close:hover *,
         html.nexus-cursor-on .cursor-choice,
         html.nexus-cursor-on .cursor-choice *,
         html.nexus-cursor-on .cursor-choice:hover,
         html.nexus-cursor-on .cursor-choice:hover * {
            cursor: url("${pointer}") 0 0, pointer !important;
         }

         html.nexus-cursor-on input[type="text"],
         html.nexus-cursor-on input[type="password"],
         html.nexus-cursor-on input[type="email"],
         html.nexus-cursor-on input[type="search"],
         html.nexus-cursor-on input[type="url"],
         html.nexus-cursor-on input[type="tel"],
         html.nexus-cursor-on textarea,
         html.nexus-cursor-on [contenteditable="true"] {
            cursor: url("${normal}") 0 0, text !important;
         }
      `;
   }

   window.setNexusCustomCursor = function (enabled) {
      setSaved("nexusCustomCursor", enabled ? "true" : "false");
      applyCursor(true);
   };

   window.setNexusCursorChoice = function (normal, pointer) {
      const fixedNormal = cleanPath(normal || "/storage/icons/cursor/cursor.png");
      const fixedPointer = cleanPath(pointer || inferPointer(fixedNormal));

      setSaved("nexusCursorDefault", fixedNormal);
      setSaved("nexusCursorPointer", fixedPointer);
      setSaved("nexusCustomCursor", "true");

      applyCursor(true);
   };

   window.applyNexusCursor = function () {
      applyCursor(true);
   };

   window.addEventListener("storage", function (event) {
      if (
         event.key === "nexusCustomCursor" ||
         event.key === "nexusCursorDefault" ||
         event.key === "nexusCursorPointer" ||
         event.key === "nexusCursorPreset"
      ) {
         applyCursor(true);
      }
   });

   if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
         applyCursor(true);
      });
   } else {
      applyCursor(true);
   }

   window.addEventListener("focus", function () {
      applyCursor(true);
   });

   document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
         applyCursor(true);
      }
   });

   setInterval(function () {
      applyCursor(false);
   }, 500);
})();