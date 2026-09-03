(() => {
  window.RufflePlayer = window.RufflePlayer || {};
  window.RufflePlayer.config = {
    ...window.RufflePlayer.config,
    autoplay: "on",
    unmuteOverlay: "visible",
    letterbox: "on",
    forceScale: true,
    scale: "showAll",
    quality: "high",
    warnOnUnsupportedContent: false,
    contextMenu: "rightClickOnly"
  };

  function fitPlayers() {
    document.querySelectorAll("ruffle-player, ruffle-embed, ruffle-object").forEach((player) => {
      player.style.setProperty("width", "100%", "important");
      player.style.setProperty("height", "100%", "important");
    });
  }

  new MutationObserver(fitPlayers).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener("resize", fitPlayers, { passive: true });
  addEventListener("load", fitPlayers);
})();
