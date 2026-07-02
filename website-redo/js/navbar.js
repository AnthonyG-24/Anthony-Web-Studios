document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navRight = document.getElementById("navRight");
  const body = document.body;

  const overlay = document.createElement("div");
  overlay.classList.add("nav-overlay");
  body.appendChild(overlay);

  const navLinks = document.querySelectorAll(".nav-link");
  const navEl = document.querySelector("nav");

  function toggleMenu() {
    const isActive = hamburger.classList.contains("active");
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    hamburger.classList.add("active");
    navRight.classList.add("active");
    overlay.classList.add("active");
    body.classList.add("nav-open");

    hamburger.setAttribute("aria-expanded", "true");
    navRight.setAttribute("aria-hidden", "false");

    if (window.innerWidth <= 900) {
      const firstNavLink = navRight.querySelector(".nav-link");
      if (firstNavLink) {
        setTimeout(() => firstNavLink.focus(), 300);
      }
    }
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    navRight.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("nav-open");

    hamburger.setAttribute("aria-expanded", "false");
    navRight.setAttribute("aria-hidden", "true");

    if (window.innerWidth <= 900) {
      hamburger.focus();
    }
  }

  hamburger.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburger.classList.contains("active")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-controls", "navRight");
  hamburger.setAttribute("aria-label", "Toggle navigation menu");
  navRight.setAttribute("aria-hidden", "true");

  function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerOffset = navEl.offsetHeight;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: window.innerWidth <= 900 ? "instant" : "smooth",
      });
    }
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        if (window.innerWidth <= 900) {
          closeMenu();
        }

        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        smoothScrollTo(href);

        if (history.pushState) {
          history.pushState(null, null, href);
        }
      });
    }
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id], header[id]");
    const scrollPos = window.scrollY + navEl.offsetHeight + 20;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");
      const correspondingNavLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (scrollPos >= top && scrollPos <= bottom) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (correspondingNavLink) {
          correspondingNavLink.classList.add("active");
        }
      }
    });
  }

  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateActiveNavLink);
      ticking = true;
    }
  }

  window.addEventListener("scroll", () => {
    requestTick();
    ticking = false;
  });

  updateActiveNavLink();
});
