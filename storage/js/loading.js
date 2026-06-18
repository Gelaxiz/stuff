(function () {
   let loadingTimer = null;

   function getLoadingElement() {
      return document.getElementById("proxy-loading");
   }

   window.showLoading = function () {
      const proxyLoading = getLoadingElement();

      if (!proxyLoading) {
         return;
      }

      clearTimeout(loadingTimer);
      proxyLoading.classList.remove("proxy-loading-hidden");
   };

   window.hideLoading = function () {
      const proxyLoading = getLoadingElement();

      if (!proxyLoading) {
         return;
      }

      clearTimeout(loadingTimer);

      loadingTimer = setTimeout(function () {
         proxyLoading.classList.add("proxy-loading-hidden");
      }, 450);
   };
}());
