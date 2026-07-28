/*
 * HELIOSDESK — Options / Settings Panel
 * In-desk popover for theme, density, font controls.
 */
(function () {
  "use strict";

  function addOptionsTrigger() {
    // Add gear icon to toolbar
    var right = document.querySelector(".hd-toolbar .hd-toolbar-right");
    if (!right) return;

    var gearBtn = document.createElement("button");
    gearBtn.className = "hd-tb-btn";
    gearBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    gearBtn.title = "Settings";
    gearBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleOptionsPanel(gearBtn);
    });

    // Insert before the divider
    var divider = right.querySelector(".hd-divider");
    if (divider) {
      right.insertBefore(gearBtn, divider);
    } else {
      right.insertBefore(gearBtn, right.querySelector(".hd-user-btn"));
    }
  }

  function toggleOptionsPanel(anchor) {
    var existing = document.querySelector(".hd-options-panel");
    if (existing) {
      existing.remove();
      return;
    }

    var panel = document.createElement("div");
    panel.className = "hd-options-panel";

    var rect = anchor.getBoundingClientRect();
    panel.style.cssText =
      "position:fixed;top:" +
      (rect.bottom + 8) +
      "px;right:" +
      (window.innerWidth - rect.right) +
      "px;z-index:1060;";

    panel.innerHTML =
      '<div class="hd-options-header">Settings</div>' +

      // Theme
      '<div class="hd-options-group">' +
      '<label class="hd-options-label">Theme</label>' +
      '<div class="hd-options-controls">' +
      '<button class="hd-opt-btn" data-action="theme-light">☀️ Light</button>' +
      '<button class="hd-opt-btn" data-action="theme-dark">🌙 Dark</button>' +
      '<button class="hd-opt-btn" data-action="theme-auto">🌓 Auto</button>' +
      "</div>" +
      "</div>" +

      // Density
      '<div class="hd-options-group">' +
      '<label class="hd-options-label">Density</label>' +
      '<div class="hd-options-controls">' +
      '<button class="hd-opt-btn" data-action="density-comfortable">Comfortable</button>' +
      '<button class="hd-opt-btn" data-action="density-compact">Compact</button>' +
      '<button class="hd-opt-btn" data-action="density-ultra">Ultra-Compact</button>' +
      "</div>" +
      "</div>" +

      // Font scale
      '<div class="hd-options-group">' +
      '<label class="hd-options-label">Font Size</label>' +
      '<div class="hd-options-controls">' +
      '<button class="hd-opt-btn" data-action="font-decrease">−</button>' +
      '<span class="hd-opt-value" id="hd-opt-font-val">100%</span>' +
      '<button class="hd-opt-btn" data-action="font-increase">+</button>' +
      '<button class="hd-opt-btn hd-opt-btn-secondary" data-action="font-reset">Reset</button>' +
      "</div>" +
      "</div>";

    document.body.appendChild(panel);

    // Button handlers
    panel.querySelectorAll(".hd-opt-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var action = this.dataset.action;
        switch (action) {
          case "theme-light":
            window.hdThemeMode && window.hdThemeMode.set("Light");
            break;
          case "theme-dark":
            window.hdThemeMode && window.hdThemeMode.set("Dark");
            break;
          case "theme-auto":
            window.hdThemeMode && window.hdThemeMode.set("Automatic");
            break;
          case "density-comfortable":
            window.hdDensity && window.hdDensity.set("Comfortable");
            break;
          case "density-compact":
            window.hdDensity && window.hdDensity.set("Compact");
            break;
          case "density-ultra":
            window.hdDensity && window.hdDensity.set("Ultra-Compact");
            break;
          case "font-increase":
            window.hdFont && window.hdFont.increase();
            updateFontValue();
            break;
          case "font-decrease":
            window.hdFont && window.hdFont.decrease();
            updateFontValue();
            break;
          case "font-reset":
            window.hdFont && window.hdFont.reset();
            updateFontValue();
            break;
        }
      });
    });

    // Close on outside click
    setTimeout(function () {
      document.addEventListener(
        "click",
        function close(e) {
          if (
            !panel.contains(e.target) &&
            e.target !== anchor
          ) {
            panel.remove();
            document.removeEventListener("click", close);
          }
        },
        { once: false }
      );
    }, 0);

    updateFontValue();

    function updateFontValue() {
      var val = document.getElementById("hd-opt-font-val");
      if (val && window.hdFont) {
        val.textContent = window.hdFont.current() + "%";
      }
    }
  }

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addOptionsTrigger);
  } else {
    addOptionsTrigger();
  }
})();
