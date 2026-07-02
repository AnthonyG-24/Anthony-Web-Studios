document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  const spotlightSection = document.querySelector(".about-spotlight");
  if (!spotlightSection) return;

  document.fonts.ready.then(() => {
    const marqueeStrip = spotlightSection.querySelector(".about-spotlight-marquee");
    const marqueeTrack = spotlightSection.querySelector(".about-spotlight-marquee-track");

    const config = {
      marqueeScrollSpeed: 100,
      stripFollowEase: 0.05,
      stripEdgeInset: 175,
      stripBottomInset: 60,
      contentRiseRate: 0.85,
      risenTopGap: 100,
      liftHeadStart: 125,
      wakeStrength: 2.5,
      wakeReach: 125,
      lineSettleEase: 0.09,
    };

    const sourceItems = Array.from(marqueeTrack.children);
    const oneSetWidth = sourceItems.reduce(
      (sum, item) => sum + item.offsetWidth,
      0,
    );
    const setsNeeded = Math.ceil(window.innerWidth / oneSetWidth) + 1;

    for (let copy = 0; copy < setsNeeded; copy++) {
      sourceItems.forEach((item) => marqueeTrack.appendChild(item.cloneNode(true)));
    }

    gsap.to(marqueeTrack, {
      x: `-=${oneSetWidth}`,
      duration: oneSetWidth / config.marqueeScrollSpeed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${gsap.utils.wrap(-oneSetWidth, 0, parseFloat(x))}px`,
      },
    });

    let stripBaseTop = 0;
    let stripHeight = 0;
    let sectionHeight = 0;
    let stripRestCenterY = 0;
    let contentTopAtRest = 0;

    let stripTargetY = 0;
    let stripCurrentY = 0;
    let stripPrevY = 0;
    let hasPointerMoved = false;

    let textLines = [];

    function measureGeometry() {
      sectionHeight = spotlightSection.getBoundingClientRect().height;
      stripBaseTop = marqueeStrip.offsetTop;
      stripHeight = marqueeStrip.offsetHeight;

      stripRestCenterY = config.stripEdgeInset;

      let blockTop = Infinity;
      textLines.forEach((line) => {
        let y = 0;
        let node = line.el;
        while (node && node !== spotlightSection) {
          y += node.offsetTop;
          node = node.offsetParent;
        }
        line.restCenterY = y + line.el.offsetHeight / 2;
        blockTop = Math.min(blockTop, line.restCenterY - line.el.offsetHeight / 2);
      });
      contentTopAtRest = isFinite(blockTop) ? blockTop : sectionHeight * 0.4;

      if (!hasPointerMoved) {
        const restY = config.stripEdgeInset - stripBaseTop - stripHeight / 2;
        stripTargetY = restY;
        stripCurrentY = restY;
        stripPrevY = restY;
      }
    }

    const splitTargets = gsap.utils.toArray(
      ".about-spotlight-content-wrapper h1, .about-spotlight-content-wrapper h3, .about-spotlight-copy p",
    );

    splitTargets.forEach((element) => {
      SplitText.create(element, {
        type: "lines",
        linesClass: "line",
        onSplit(instance) {
          textLines = textLines.filter((line) => line.source !== element);
          instance.lines.forEach((lineEl) => {
            textLines.push({
              el: lineEl,
              restCenterY: 0,
              currentY: 0,
              source: element,
            });
          });
          measureGeometry();
        },
      });
    });

    window.addEventListener("resize", measureGeometry);

    // Mouse-follow effect only makes sense with a real hover-capable pointer.
    // On touch devices there's no cursor to chase, so the strip would just sit
    // frozen at its rest spot, which can land on top of the heading text.
    // Skip the JS positioning entirely and let the marquee stay at its plain
    // CSS position (safely above the text, in the reserved top padding).
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (canHover) {
      spotlightSection.addEventListener("mousemove", (event) => {
        hasPointerMoved = true;
        const bounds = spotlightSection.getBoundingClientRect();
        const cursorY = event.clientY - bounds.top;

        const wantedY = cursorY - stripBaseTop - stripHeight / 2;
        const highestY = config.stripEdgeInset - stripBaseTop - stripHeight / 2;
        const lowestY =
          sectionHeight - config.stripBottomInset - stripBaseTop - stripHeight / 2;
        stripTargetY = gsap.utils.clamp(highestY, lowestY, wantedY);
      });

      gsap.ticker.add(() => {
        stripCurrentY += (stripTargetY - stripCurrentY) * config.stripFollowEase;
        gsap.set(marqueeStrip, { y: stripCurrentY });

        const stripCenterY = stripBaseTop + stripCurrentY + stripHeight / 2;
        const stripVelocityY = stripCurrentY - stripPrevY;
        stripPrevY = stripCurrentY;

        const descentBelowRest = Math.max(0, stripCenterY - stripRestCenterY);
        const maxRise = Math.max(0, contentTopAtRest - config.risenTopGap);
        const contentRise = -Math.min(
          descentBelowRest * config.contentRiseRate,
          maxRise,
        );

        textLines.forEach((line) => {
          const gapToStrip = line.restCenterY - stripCenterY;

          const reachedLine = stripCenterY + config.liftHeadStart >= line.restCenterY;

          const wakeInfluence = Math.exp(
            -(gapToStrip * gapToStrip) / (2 * config.wakeReach * config.wakeReach),
          );
          const wakeOffset = stripVelocityY * wakeInfluence * config.wakeStrength;

          const lineTarget = (reachedLine ? contentRise : 0) + wakeOffset;

          line.currentY += (lineTarget - line.currentY) * config.lineSettleEase;
          gsap.set(line.el, { y: line.currentY });
        });
      });
    }
  });
});
