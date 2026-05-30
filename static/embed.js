document.addEventListener("DOMContentLoaded", async () => {
   const frame = document.getElementById("game-frame");
   const params = new URLSearchParams(window.location.search);
   const link = params.get("p") || params.get("url");

   if (!frame) {
      return;
   }

   if (!link) {
      frame.src = "/404";
      return;
   }

   if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/static/uv-sw.js", {
         scope: "/static/"
      });
   }

   let target = link;

   if (!/^https?:\/\//i.test(target)) {
      target = "https://" + target;
   }

   frame.src = `/static/load/${__uv$config.encodeUrl(target)}`;
});