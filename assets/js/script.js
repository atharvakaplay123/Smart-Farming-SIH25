document.addEventListener("DOMContentLoaded", () => {
    // === 1. Anchor tag navigation ===
    const mainLinks = document.querySelectorAll("#main a");
  
    mainLinks.forEach(link => {
      link.style.cursor = "pointer"; // make it look clickable
      link.addEventListener("click", () => {
        const sectionId = link.textContent.trim().toLowerCase().replace(/\s+/g, "-");
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        } else {
          alert(`No details found for "${link.textContent.trim()}"`);
        }
      });
    });
  
    // === 2. Chatbot close button ===
    const chatBox = document.getElementById("chat-box");
    const closeBtn = document.getElementById("close-btn");
  
    if (closeBtn && chatBox) {
      closeBtn.addEventListener("click", () => {
        chatBox.classList.add("hidden");
      });
    }
  });
  
  