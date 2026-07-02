document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);
  CustomEase.create("hop", "0.8, 0, 0.2, 1");
  CustomEase.create("hop2", "0.9, 0, 0.1, 1");

  document.fonts.ready.then(() => {
    const preloaderImgInitRotations = [7.5, -2.5, -10, 12.5, -5, 5];
    gsap.set(".preloader-img", {
      rotate: (i) => preloaderImgInitRotations[i],
    });

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(".preloader-img", {
      scale: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "hop",
      stagger: 0.2,
    });

    tl.to(
      ".preloader-images .preloader-img",
      {
        scale: 0,
        clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
        duration: 0.75,
        ease: "hop2",
        stagger: -0.075,
      },
      2.0,
    );

    tl.to(
      ".preloader-logo",
      {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "hop2",
      },
      2.75,
    );

    tl.to(
      ".preloader-logo",
      {
        opacity: 0,
        scale: 0.85,
        duration: 0.6,
        ease: "hop2",
      },
      3.9,
    );

    tl.to(
      ".preloader",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.9,
        ease: "hop2",
      },
      4.6,
    );
  });
});
