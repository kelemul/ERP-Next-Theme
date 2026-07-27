/*
 * HELIOSDESK — Login Page Enhancement
 * Ambient canvas, dynamic background, white-label.
 */
(function () {
  "use strict";

  // Only run on the login page
  if (
    !document.querySelector(".page-login") &&
    !document.querySelector(".login-wrapper") &&
    !document.querySelector("#login-page")
  )
    return;

  function addLoginMeta() {
    // Set body class
    document.body.classList.add("hd-login-page");

    // Inject branding if available
    if (frappe.boot && frappe.boot.hd_branding) {
      var brand = frappe.boot.hd_branding;
      if (brand.company_name) {
        var logoSection = document.querySelector(
          ".login-content .form-title"
        ) ||
          document.querySelector(".login-wrapper .form-title");
        if (logoSection) {
          logoSection.textContent = brand.company_name;
        }
      }
    }

    // Generate ambient particles
    var canvas = document.getElementById("hd-login-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "hd-login-canvas";
      document.body.appendChild(canvas);
    }

    var ctx = canvas.getContext("2d");
    var particles = [];
    var W, H;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (var i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      // Draw connections between nearby particles
      particles.forEach(function (a, idx) {
        particles.slice(idx + 1).forEach(function (b) {
          var dist = Math.sqrt(
            (a.x - b.x) * (a.x - b.x) +
              (a.y - b.y) * (a.y - b.y)
          );
          if (dist < 150) {
            ctx.strokeStyle =
              "rgba(99, 102, 241, " +
              (0.08 * (1 - dist / 150)) +
              ")";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(99, 102, 241, " + p.alpha + ")";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // Wait for Frappe boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addLoginMeta);
  } else {
    addLoginMeta();
  }
})();
