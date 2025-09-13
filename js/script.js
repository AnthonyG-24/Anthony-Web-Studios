document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis for smooth scrolling only on larger screens
  let lenis = null;

  if (window.innerWidth > 820) {
    lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Animate cards on scroll
  const cards = gsap.utils.toArray(".card");

  cards.forEach((card, index) => {
    if (index < cards.length - 1) {
      const cardInner = card.querySelector(".card-inner");

      // Animation for the card inner element
      gsap.fromTo(
        cardInner,
        {
          y: "0%",
          z: 0,
          rotationX: 0,
        },
        {
          y: "-50%",
          z: -250,
          rotationX: 45,
          scrollTrigger: {
            trigger: cards[index + 1],
            start: "top 85%",
            end: "top -75%",
            scrub: true,
            pin: card,
            pinSpacing: false,
          },
        }
      );

      // Animation for the card's after element (gradient overlay)
      gsap.to(cardInner, {
        "--after-opacity": 1,
        scrollTrigger: {
          trigger: cards[index + 1],
          start: "top 73%",
          end: "top 25%",
          scrub: true,
        },
      });
    }
  });

  // Video autoplay on scroll into view
  const video = document.querySelector('.testimonial-video');
  if (video) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(video);
  }

});
