/*
 * HELIOSDESK — Progressive Form Reveal
 * Collapses optional/less-used fields behind a "Show More" toggle.
 */
(function () {
  "use strict";

  function initProgressiveForms() {
    // Observe form section rendering
    var observer = new MutationObserver(function () {
      processVisibleForms();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    processVisibleForms();
  }

  function processVisibleForms() {
    document
      .querySelectorAll(
        ".form-section:not([data-hd-progressive])"
      )
      .forEach(function (section) {
        // Only target sections with many fields
        var fields = section.querySelectorAll(
          ".frappe-control[data-fieldname]"
        );
        if (fields.length <= 4) return;

        section.setAttribute("data-hd-progressive", "1");

        // Find mandatory vs optional fields
        var threshold = Math.min(fields.length - 1, 3);
        fields.forEach(function (f, idx) {
          if (idx >= threshold) {
            f.classList.add("hd-progressive-hidden");
          }
        });

        // Add toggle button
        var toggleBtn = document.createElement("div");
        toggleBtn.className = "hd-progressive-toggle";
        toggleBtn.textContent = "Show more options";
        toggleBtn.dataset.expanded = "false";
        toggleBtn.addEventListener("click", function () {
          var expanded = this.dataset.expanded === "true";
          var hiddenFields =
            section.querySelectorAll(".hd-progressive-hidden");
          hiddenFields.forEach(function (f) {
            f.style.display = expanded ? "none" : "";
          });
          this.dataset.expanded = expanded ? "false" : "true";
          this.textContent = expanded
            ? "Show more options"
            : "Show fewer options";
        });

        section
          .querySelector(".section-body") ||
          section.appendChild(toggleBtn);
      });
  }

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProgressiveForms);
  } else {
    initProgressiveForms();
  }
})();
