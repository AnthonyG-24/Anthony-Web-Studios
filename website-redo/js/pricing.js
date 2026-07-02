document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  const revealOnScroll = (el, { stagger = 0.03, duration = 0.55 } = {}) => {
    if (!el) return;

    const split = SplitText.create(el, {
      type: "lines,words,chars",
      linesClass: "line",
      wordsClass: "word",
      charsClass: "char",
    });

    gsap.set(split.chars, { x: 60, opacity: 0, skewX: 15 });

    const charMeta = split.lines.flatMap((line) => {
      const lineChars = split.chars.filter((char) => line.contains(char));
      return lineChars.map((char, charIndexInLine) => ({
        char,
        charIndexInLine,
      }));
    });

    const tl = gsap.timeline({ paused: true });
    charMeta.forEach(({ char, charIndexInLine }) => {
      tl.to(
        char,
        {
          x: 0,
          opacity: 1,
          skewX: 0,
          ease: "power3.out",
          duration,
        },
        charIndexInLine * stagger,
      );
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: () => tl.restart(),
      onLeaveBack: () => tl.pause(0),
    });

    // If the page loads already scrolled past the trigger point (deep link,
    // scroll restoration, etc.), onEnter never fires since there's no
    // crossing event, so the text would stay invisible. Catch that case here.
    if (st.isActive) tl.restart();
  };

  document.fonts.ready.then(() => {
    revealOnScroll(document.querySelector(".pricing-intro-fg h2"));
  });

  // Pinned reveal transition: the intro heading slits open, rotates, and
  // shrinks away to reveal the pricing cards underneath (adapted from the
  // Codegrid "voyeurverite" scroll animation).
  const introFg = document.querySelector(".pricing-intro-fg");
  const introOverlay = document.querySelector(".pricing-intro-overlay");

  if (introFg) {
    ScrollTrigger.create({
      trigger: ".pricing-intro",
      start: "top top",
      end: `+=${window.innerHeight * 2}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const slitProgress = gsap.utils.clamp(0, 1, progress / 0.4);
        const slitLeftEdge = gsap.utils.interpolate(0, 48, slitProgress);
        const slitRightEdge = gsap.utils.interpolate(100, 52, slitProgress);
        gsap.set(introFg, {
          clipPath: `polygon(${slitLeftEdge}% 0%, ${slitRightEdge}% 0%, ${slitRightEdge}% 100%, ${slitLeftEdge}% 100%)`,
        });

        const rotateProgress = gsap.utils.clamp(
          0,
          1,
          (progress - 0.4) / 0.3,
        );
        gsap.set(introFg, {
          rotate: gsap.utils.interpolate(0, 45, rotateProgress),
        });

        const shrinkProgress = gsap.utils.clamp(
          0,
          1,
          (progress - 0.55) / 0.3,
        );
        gsap.set(introFg, {
          scale: gsap.utils.interpolate(1, 0, shrinkProgress),
        });
        gsap.set(introOverlay, {
          opacity: gsap.utils.interpolate(0, 0.5, shrinkProgress),
        });
      },
    });
  }
});
