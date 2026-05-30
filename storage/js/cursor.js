(function () {
   const key = "nexusCustomCursor";

   function isCursorEnabled() {
      return localStorage.getItem(key) !== "false";
   }

   function applyCursorSetting() {
      const enabled = isCursorEnabled();

      document.documentElement.classList.toggle("nexus-cursor-on", enabled);
      document.documentElement.classList.toggle("nexus-cursor-off", !enabled);
   }

   window.setNexusCustomCursor = function (enabled) {
      localStorage.setItem(key, enabled ? "true" : "false");
      applyCursorSetting();
   };

   applyCursorSetting();

   window.addEventListener("storage", function (event) {
      if (event.key === key) {
         applyCursorSetting();
      }
   });
})();