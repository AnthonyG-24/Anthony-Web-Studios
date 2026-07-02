document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const modal = document.getElementById("termsModal");
  const openBtn = document.querySelector(".footer-terms-btn");
  const closeBtn = document.querySelector(".terms-modal-close");
  if (!modal) return;

  const toggleTermsModal = () => {
    modal.classList.toggle("active");

    if (modal.classList.contains("active")) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
    }
  };

  openBtn.addEventListener("click", toggleTermsModal);
  closeBtn.addEventListener("click", toggleTermsModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      toggleTermsModal();
    }
  });
});
