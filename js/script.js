// Enhanced GSAP Scroll Animation with Service Section Detection
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", function () {
  const slides = gsap.utils.toArray(".slide");
  const activeSlideImages = gsap.utils.toArray(".active-slide img");
  const slider = document.querySelector(".slider");
  const activeSlide = document.querySelector(".active-slide");

  // Utility functions
  function getInitialTranslateZ(slide) {
    const style = window.getComputedStyle(slide);
    const matrix = style.transform.match(/matrix3d\(((.+))\)/);
    if (matrix) {
      const values = matrix[1].split(", ");
      return parseFloat(values[14] || 0);
    }
    return 0;
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  // Initialize slider state - hidden by default
  gsap.set(slider, {
    opacity: 0,
    pointerEvents: "none",
    visibility: "hidden",
  });
  gsap.set(activeSlide, { opacity: 0 });

  // Show slider after about section, hide before service section
  ScrollTrigger.create({
    trigger: ".about-section",
    start: "bottom center",
    end: "bottom top",
    onEnter: () => {
      gsap.to(slider, {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(activeSlide, {
        opacity: 0.4,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    onLeaveBack: () => {
      gsap.to(slider, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => gsap.set(slider, { visibility: "hidden" }),
      });
      gsap.to(activeSlide, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    },
  });

  // Hide slider when approaching service section
  ScrollTrigger.create({
    trigger: ".service-section",
    start: "top bottom-=100",
    end: "top top",
    onEnter: () => {
      gsap.to(slider, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => gsap.set(slider, { visibility: "hidden" }),
      });
      gsap.to(activeSlide, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      });
    },
    onLeaveBack: () => {
      gsap.to(slider, {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.to(activeSlide, {
        opacity: 0.4,
        duration: 0.8,
        ease: "power2.out",
      });
    },
  });

  // Enhanced slide animations with smoother transitions
  slides.forEach((slide, index) => {
    const initialZ = getInitialTranslateZ(slide);
    let currentActiveImage = activeSlideImages[index];

    ScrollTrigger.create({
      trigger: ".container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2, // Smoother scrubbing
      onUpdate: (self) => {
        const progress = self.progress;
        const zIncrement = progress * 7500;
        const currentZ = initialZ + zIncrement;

        // Improved opacity calculation with smoother transitions
        let opacity;
        if (currentZ > -1500) {
          opacity = mapRange(currentZ, -1500, 500, 0.7, 1);
        } else if (currentZ > -3000) {
          opacity = mapRange(currentZ, -3000, -1500, 0.3, 0.7);
        } else {
          opacity = mapRange(currentZ, -6000, -3000, 0, 0.3);
        }

        // Ensure opacity stays within bounds
        opacity = Math.max(0, Math.min(1, opacity));

        // Apply transforms with better performance
        slide.style.opacity = opacity;
        slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`;

        // Background image transitions with smoother timing
        if (currentActiveImage) {
          if (currentZ > -200) {
            gsap.to(currentActiveImage, {
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(currentActiveImage, {
              opacity: 0,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        }
      },
    });
  });

  // Performance optimization: track showcase visibility
  ScrollTrigger.create({
    trigger: ".about-section",
    start: "bottom bottom",
    end: () => {
      const serviceSection = document.querySelector(".service-section");
      return `${serviceSection.offsetTop - 100}px top`;
    },
    onEnter: () => {
      ScrollTrigger.refresh();
    },
    onLeave: () => {
      // Showcase is no longer active
    },
    onEnterBack: () => {
      ScrollTrigger.refresh();
    },
    onLeaveBack: () => {
      // Showcase is no longer active
    },
  });

  // Refresh ScrollTrigger on resize for better responsiveness
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
});

// Optional: Add performance monitoring
if (window.performance && window.performance.mark) {
  window.performance.mark("showcase-animation-loaded");
}
