document.getElementById("uv-form").addEventListener("submit", function (event) {
   event.preventDefault();
   search();
});

function search() {
   const searchBar = document.getElementById("uv-address");
   const errorSound = document.getElementById("errorSound");
   const inputRaw = searchBar.value.trim();

   if (!inputRaw) {
      if (errorSound) {
         errorSound.currentTime = 0;
         errorSound.play().catch(function () {});
      }

      searchBar.classList.remove("shake");
      void searchBar.offsetWidth;
      searchBar.classList.add("shake");
      return;
   }

   let normalized = inputRaw.toLowerCase();

   normalized = normalized.replace(/\s+/g, "");
   normalized = normalized
      .replace(/0/g, "o")
      .replace(/1/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/5/g, "s")
      .replace(/7/g, "t");

   normalized = normalized.replace(/[^a-z0-9]/g, "");

   const blockedTerms = [
      "porn",
      "pornhub",
      "xvideos",
      "xnxx",
      "xhamster",
      "redtube",
      "youjizz",
      "tube8",
      "hentai",
      "sex",
      "milf",
      "boobs",
      "tits",
      "pussy",
      "cum",
      "jizz",
      "escort",
      "stripchat",
      "onlyfans",
      "camgirl",
      "bongacams",
      "chaturbate"
   ];

   for (const term of blockedTerms) {
      if (normalized.includes(term)) {
         if (errorSound) {
            errorSound.currentTime = 0;
            errorSound.play().catch(function () {});
         }

         searchBar.classList.remove("shake");
         void searchBar.offsetWidth;
         searchBar.classList.add("shake");
         searchBar.value = "";
         return;
      }
   }

   const hasProtocol = /^https?:\/\//i.test(inputRaw);
   const looksLikeURL = /^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(inputRaw);

   let finalURL;

   if (hasProtocol) {
      finalURL = inputRaw;
   } else if (looksLikeURL) {
      finalURL = "https://" + inputRaw;
   } else {
      finalURL = "https://duckduckgo.com/?q=" + encodeURIComponent(inputRaw) + "&ia=web";
   }

   const pageFrame = document.getElementById("page-frame");

   if (pageFrame) {
      pageFrame.src = "/static/embed.html?p=" + encodeURIComponent(finalURL);
      document.body.classList.add("frame-open");
      document.body.classList.add("proxy-open");
      history.replaceState(null, "", "/");
      return;
   }

   window.location.href = "/static/embed.html?p=" + encodeURIComponent(finalURL);
}