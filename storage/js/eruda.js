(function () {
   if (window.__nexusErudaRunning) {
      if (window.inspectelement) {
         window.inspectelement();
      }

      return;
   }

   window.__nexusErudaRunning = true;

   let devToggle = false;
   let erudaLoading = false;

   function findFrame() {
      return (
         document.querySelector("#proxy-frame") ||
         document.querySelector("#game-frame") ||
         document.querySelector("#page-frame") ||
         document.querySelector(".proxy-frame") ||
         document.querySelector(".game-iframe") ||
         document.querySelector(".tab-iframe.active") ||
         document.querySelector("iframe")
      );
   }

   function getFrameDocument(frame) {
      try {
         return frame.contentDocument || frame.contentWindow.document;
      } catch (error) {
         return null;
      }
   }

   function waitForFrame(callback) {
      let tries = 0;

      const timer = setInterval(function () {
         const frame = findFrame();

         if (frame) {
            clearInterval(timer);
            callback(frame);
            return;
         }

         tries++;

         if (tries > 80) {
            clearInterval(timer);
            console.error("iframe not found");
         }
      }, 100);
   }

   function loadErudaInto(frameDocument) {
      return new Promise(function (resolve, reject) {
         if (frameDocument.getElementById("nexus-eruda-script")) {
            resolve();
            return;
         }

         if (erudaLoading) {
            resolve();
            return;
         }

         erudaLoading = true;

         const script = frameDocument.createElement("script");
         script.id = "nexus-eruda-script";
         script.src = "https://cdn.jsdelivr.net/npm/eruda";

         script.onload = function () {
            erudaLoading = false;
            resolve();
         };

         script.onerror = function () {
            erudaLoading = false;
            reject(new Error("failed to load eruda"));
         };

         frameDocument.body.appendChild(script);
      });
   }

   function toggleEruda(frameDocument) {
      const script = frameDocument.createElement("script");

      script.textContent = `
         if (window.eruda) {
            if (!window.__nexusErudaReady) {
               window.eruda.init({
                  defaults: {
                     displaySize: 50,
                     transparency: 1,
                     theme: "Material Deep Ocean"
                  }
               });

               window.__nexusErudaReady = true;
            }

            if (${!devToggle}) {
               window.eruda.show();
            } else {
               window.eruda.hide();
            }
         }

         document.currentScript.remove();
      `;

      frameDocument.body.appendChild(script);
      devToggle = !devToggle;
   }

   window.inspectelement = function () {
      waitForFrame(function (frame) {
         const frameDocument = getFrameDocument(frame);

         if (!frameDocument || !frameDocument.body) {
            console.error("iframe is not accessible. make sure the page is loaded through uv, not directly cross-origin.");
            return;
         }

         if (frameDocument.readyState === "loading") {
            frame.addEventListener("load", function () {
               window.inspectelement();
            }, { once: true });

            return;
         }

         loadErudaInto(frameDocument)
            .then(function () {
               toggleEruda(frameDocument);
            })
            .catch(function (error) {
               console.error(error);
            });
      });
   };

   window.inspectelement();
})();