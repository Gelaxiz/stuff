(() => {
  const presets = {
    default: { title: "Home - Classroom", icon: "/storage/favicon/googleclassroom.png" },
    googledrive: { title: "Google Drive", icon: "/storage/favicon/googledrive.png" },
    google: { title: "Google", icon: "/storage/favicon/google.png" },
    youtube: { title: "YouTube", icon: "/storage/favicon/youtube.png" },
    sparx: { title: "Sparx Maths", icon: "/storage/favicon/sparx.png" },
    schoology: { title: "Schoology", icon: "/storage/favicon/schoology.png" }
  };

  function setIcon(src) {
    let icon = document.querySelector("link[rel~='icon']");
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = src;
  }

  function apply() {
    const requested = localStorage.getItem("cloakPreset") || "default";
    const presetName = presets[requested] ? requested : "default";
    const fallback = presets[presetName];
    const title = localStorage.getItem("siteTitle") || fallback.title;
    const icon = localStorage.getItem("siteLogo") || fallback.icon;

    localStorage.setItem("cloakPreset", presetName);
    localStorage.setItem("siteTitle", title);
    localStorage.setItem("siteLogo", icon);
    document.title = title;
    setIcon(icon);

    if (window.parent !== window) {
      window.parent.postMessage({ type: "nexus-cloak-change", preset: presetName, title, icon }, "*");
    }
  }

  window.NexusCloak = { apply, presets };
  apply();
})();
