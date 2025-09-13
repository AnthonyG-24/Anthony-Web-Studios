document.addEventListener("DOMContentLoaded", () => {
  // FAQ Accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(faqItem => {
        faqItem.classList.remove('active');
      });
      
      // Open clicked item if it wasn't already active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});