(() => {
  if (window.top !== window || window.__nexusAutoBlankStarted) return;
  window.__nexusAutoBlankStarted = true;

  function launch() {
    const tab = window.open("about:blank", "_blank");
    if (!tab) return false;

    const title = localStorage.getItem("siteTitle") || "Home - Classroom";
    const iconUrl = new URL(
      localStorage.getItem("siteLogo") || "/storage/favicon/googleclassroom.png",
      location.origin
    ).href;
    const nexusUrl = location.href;

    tab.document.title = title;

    const icon = tab.document.createElement("link");
    icon.rel = "icon";
    icon.href = iconUrl;
    tab.document.head.appendChild(icon);

    const style = tab.document.createElement("style");
    style.textContent = "html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#08090c}iframe{display:block;width:100%;height:100%;border:0}";
    tab.document.head.appendChild(style);

    const frame = tab.document.createElement("iframe");
    frame.src = nexusUrl;
    frame.allow = "fullscreen; clipboard-read; clipboard-write";
    frame.setAttribute("allowfullscreen", "");
    frame.title = "Classroom";
    tab.document.body.appendChild(frame);

    const panicUrl = localStorage.getItem("panicUrl") || "https://classroom.google.com/";
    location.replace(panicUrl);
    return true;
  }

  if (launch()) return;

  const retry = () => {
    if (!launch()) return;
    removeEventListener("pointerdown", retry, true);
    removeEventListener("keydown", retry, true);
  };

  addEventListener("pointerdown", retry, { capture: true });
  addEventListener("keydown", retry, { capture: true });
})();
