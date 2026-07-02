document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const cards = document.querySelectorAll(".sticky-cards .showcase-card");
  if (!cards.length) return;

  const totalCards = cards.length;
  const segmentSize = 1 / totalCards;

  const cardYOffset = 5;
  const cardScaleStep = 0.075;

  cards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50 + i * cardYOffset,
      scale: 1 - i * cardScaleStep,
    });
  });

  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * ((totalCards - 1) * 2 + 1)}px`,
    pin: true,
    pinSpacing: true,
    scrub: 0.3,
    onUpdate: (self) => {
      const progress = self.progress;

      const activeIndex = Math.min(
        Math.floor(progress / segmentSize),
        totalCards - 1,
      );
      const segProgress = (progress - activeIndex * segmentSize) / segmentSize;
      const isLastCard = activeIndex === totalCards - 1;

      cards.forEach((card, i) => {
        if (i < activeIndex) {
          gsap.set(card, {
            yPercent: -250,
            rotationX: 35,
          });
        } else if (i === activeIndex) {
          // The last card has nothing to reveal behind it, so it settles
          // into place and stays instead of flying off-screen — otherwise
          // it leaves a long blank stretch before the next section.
          gsap.set(card, {
            yPercent: isLastCard
              ? -50
              : gsap.utils.interpolate(-50, -200, segProgress),
            rotationX: isLastCard
              ? 0
              : gsap.utils.interpolate(0, 35, segProgress),
            scale: 1,
          });
        } else {
          const behindIndex = i - activeIndex;
          const currentYOffset = (behindIndex - segProgress) * cardYOffset;
          const currentScale = 1 - (behindIndex - segProgress) * cardScaleStep;

          gsap.set(card, {
            yPercent: -50 + currentYOffset,
            rotationX: 0,
            scale: currentScale,
          });
        }
      });
    },
  });
});
