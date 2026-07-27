/*
 * HELIOSDESK — AI-Powered Command Palette (Ctrl+K)
 */
(function () {
  "use strict";

  var palette, overlay, input, resultsList;
  var items = [];
  var selectedIndex = -1;

  function createCommandPalette() {
    if (document.querySelector(".hd-command-overlay")) return;

    overlay = document.createElement("div");
    overlay.className = "hd-command-overlay";
    overlay.setAttribute("id", "hd-command-overlay");
    overlay.style.display = "none";

    palette = document.createElement("div");
    palette.className = "hd-command-modal";

    // Search input
    input = document.createElement("input");
    input.className = "hd-command-search form-control";
    input.type = "text";
    input.placeholder = "Search commands, docs, modules...";
    input.autocomplete = "off";
    input.spellcheck = false;
    palette.appendChild(input);

    // Results
    resultsList = document.createElement("div");
    resultsList.className = "hd-command-results";
    palette.appendChild(resultsList);

    // Hint
    var hint = document.createElement("div");
    hint.className = "hd-command-hint";
    hint.innerHTML =
      'Navigate: <kbd>↑</kbd> <kbd>↓</kbd> Select: <kbd>Enter</kbd> Close: <kbd>Esc</kbd>';
    palette.appendChild(hint);

    overlay.appendChild(palette);
    document.body.appendChild(overlay);

    // Events
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    input.addEventListener("input", search);
    input.addEventListener("keydown", onKeydown);
    document.addEventListener("keydown", function (e) {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "k" || e.key === "K")
      ) {
        e.preventDefault();
        if (overlay.style.display === "block") {
          close();
        } else {
          open();
        }
      }
      if (e.key === "Escape" && overlay.style.display === "block") {
        close();
      }
    });
  }

  function open() {
    overlay.style.display = "block";
    populateDefaultItems();
    input.value = "";
    selectedIndex = -1;
    render();
    setTimeout(function () {
      input.focus();
    }, 50);
    document.dispatchEvent(new CustomEvent("hd:command-open"));
  }

  function close() {
    overlay.style.display = "none";
    document.dispatchEvent(new CustomEvent("hd:command-close"));
  }

  function populateDefaultItems() {
    items = [];
    // Module links
    var modules = [];
    if (
      frappe.boot &&
      frappe.boot.module_list &&
      frappe.boot.allowed_module_list
    ) {
      modules = frappe.boot.allowed_module_list.map(function (m) {
        return m.module_name || m;
      });
    }

    modules.forEach(function (mod) {
      items.push({
        type: "module",
        label: mod,
        icon: "📦",
        action: function () {
          frappe.set_route("modules", mod);
          close();
        },
      });
    });

    // Quick actions
    var quickActions = [
      {
        label: "New To Do",
        icon: "📝",
        action: function () {
          frappe.new_doc("ToDo");
          close();
        },
      },
      {
        label: "New Event",
        icon: "📅",
        action: function () {
          frappe.new_doc("Event");
          close();
        },
      },
      {
        label: "New Note",
        icon: "📄",
        action: function () {
          frappe.new_doc("Note");
          close();
        },
      },
      {
        label: "Toggle Dark Mode",
        icon: "🌙",
        action: function () {
          if (window.hdThemeMode) window.hdThemeMode.toggle();
          close();
        },
      },
      {
        label: "Toggle Density",
        icon: "📏",
        action: function () {
          if (window.hdDensity) window.hdDensity.toggle();
          close();
        },
      },
      {
        label: "Toggle Sidebar",
        icon: "📂",
        action: function () {
          var sb = document.querySelector(".sidebar-collapse-btn");
          if (sb) sb.click();
          close();
        },
      },
    ];
    quickActions.forEach(function (a) {
      items.push({
        type: "action",
        label: a.label,
        icon: a.icon,
        action: a.action,
      });
    });

    // Recently viewed from localStorage
    try {
      var recent = JSON.parse(
        localStorage.getItem("hd_recent_docs") || "[]"
      );
      recent.slice(0, 5).forEach(function (r) {
        items.push({
          type: "recent",
          label: r.label || r.name,
          icon: "🕐",
          action: function () {
            frappe.set_route("Form", r.doctype, r.name);
            close();
          },
        });
      });
    } catch (e) {
      // ignore
    }
  }

  function search() {
    var q = input.value.toLowerCase().trim();
    if (!q) {
      populateDefaultItems();
      render();
      return;
    }

    // Filter locally
    var localResults = items.filter(function (it) {
      return it.label.toLowerCase().includes(q);
    });

    // Async AI search via API
    resultsList.innerHTML = "";
    var html = "";
    localResults.forEach(function (it) {
      html +=
        '<div class="hd-command-item" data-action="local">' +
        '<span class="hd-cmd-icon">' +
        (it.icon || "●") +
        "</span>" +
        '<span class="hd-cmd-label">' +
        highlight(it.label, q) +
        "</span>" +
        '<span class="hd-cmd-type">' +
        it.type +
        "</span>" +
        "</div>";
    });
    resultsList.innerHTML = html;

    // Attach click handlers
    Array.from(resultsList.children).forEach(function (el, idx) {
      el.addEventListener("click", function () {
        if (localResults[idx]) localResults[idx].action();
      });
    });

    selectedIndex = localResults.length > 0 ? 0 : -1;
    updateSelection();
  }

  function render() {
    resultsList.innerHTML = "";
    var html = "";
    items.forEach(function (it) {
      html +=
        '<div class="hd-command-item" data-action="' +
        it.type +
        '">' +
        '<span class="hd-cmd-icon">' +
        (it.icon || "●") +
        "</span>" +
        '<span class="hd-cmd-label">' +
        it.label +
        "</span>" +
        '<span class="hd-cmd-type">' +
        it.type +
        "</span>" +
        "</div>";
    });
    resultsList.innerHTML = html;

    // Attach click handlers
    Array.from(resultsList.children).forEach(function (el, idx) {
      el.addEventListener("click", function () {
        if (items[idx]) items[idx].action();
      });
    });

    selectedIndex = items.length > 0 ? 0 : -1;
    updateSelection();
  }

  function updateSelection() {
    Array.from(resultsList.children).forEach(function (el, idx) {
      el.classList.toggle("selected", idx === selectedIndex);
    });
    if (selectedIndex >= 0) {
      var el = resultsList.children[selectedIndex];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }

  function onKeydown(e) {
    var children = resultsList.children;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(
        (selectedIndex + 1) % children.length,
        children.length - 1
      );
      updateSelection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex =
        selectedIndex <= 0
          ? children.length - 1
          : selectedIndex - 1;
      updateSelection();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].action();
      }
    }
  }

  function highlight(text, query) {
    var re = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return text.replace(re, "<strong>$1</strong>");
  }

  window.hdCommand = {
    open: open,
    close: close,
  };

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createCommandPalette);
  } else {
    createCommandPalette();
  }
})();
