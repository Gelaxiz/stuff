(function () {
   const builtInBare = "https://www.en.etgigigich.ipv64.net/ca/";

   function cleanBareUrl(url) {
      let bare = String(url || "").trim();

      if (!bare) {
         return builtInBare;
      }

      if (!/^https?:\/\//i.test(bare)) {
         bare = "https://" + bare;
      }

      if (!bare.endsWith("/")) {
         bare += "/";
      }

      return bare;
   }

   function getCustomBare() {
      try {
         return localStorage.getItem("customBareServer");
      } catch (error) {
         return null;
      }
   }

   const customBare = getCustomBare();

   self.__uv$config = {
      prefix: "/static/load/",
      bare: customBare ? cleanBareUrl(customBare) : builtInBare,
      encodeUrl: Ultraviolet.codec.xor.encode,
      decodeUrl: Ultraviolet.codec.xor.decode,
      handler: "/static/uv/uv.handler.js",
      bundle: "/static/uv/uv.bundle.js",
      config: "/static/uv/uv.config.js",
      sw: "/static/uv/uv.sw.js"
   };
})();