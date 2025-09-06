// Map <a> text → section id
const sectionMap = {
  "sensor data": "sensors",
  "weather": "weather",
  "recommendation": "recommendations",
  // "irrigation": "irrigation",
  // "crop manager": "crop-manager",
  "chat bot": "chat-toggle" // scrolls to chatbot button
};

document.querySelectorAll("#main a").forEach(anchor => {
  anchor.style.cursor = "pointer";
  anchor.addEventListener("click", () => {
    const key = anchor.textContent.trim().toLowerCase();
    const sectionId = sectionMap[key];
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });
});


// Chatbot toggle functionality
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chatbox");
const chatClose = document.getElementById("chat-close");

chatToggle.addEventListener("click", () => {
  chatBox.style.display = "flex"; // open chatbox
});

chatClose.addEventListener("click", () => {
  chatBox.style.display = "none"; // close chatbox
});

// Chatbot messaging
const chatBody = document.querySelector("#chatbox .chat-body");
const chatInput = document.querySelector("#chatbox .chat-footer input");
const chatSend = document.querySelector("#chatbox .chat-footer button");

// function to append message
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("msg", sender);
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight; // auto-scroll
}

// Send button click
chatSend.addEventListener("click", () => {
  const text = chatInput.value.trim();
  if (text !== "") {
    addMessage("user", text); // user message
    chatInput.value = "";

    // Fake bot reply after delay
    setTimeout(() => {
      addMessage("bot", "🤖 I’m just a demo bot! You said: " + text);
    }, 600);
  }
});

// Enter key support
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    chatSend.click();
  }
});


