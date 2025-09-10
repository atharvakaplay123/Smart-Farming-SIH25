// import { weather_obj } from "./weather.js";
// import { sensor_obj } from "./firebase.js";

const API_KEY = "AIzaSyAcasDyt0oP2NmFjW3HAMFoDruzsZu3_AU";  // ⚠️ Don't expose directly in production
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

// const weather_info = require("./weather.js");
// const sensor_info = require("./firebase.js");

// console.log(weather_info)
// console.log(sensor_info)

// Map <a> text → section id
const sectionMap = {
  "sensor data": "sensors",
  "weather": "weather",
  "recommendation": "recommendations"
};

function open_sidebar(){
  document.getElementById("side-menu").style.width="90%";
}
function close_sidebar(){
  document.getElementById("side-menu").style.width="0%";
}

document.querySelectorAll(".nav-btn").forEach(anchor => {
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
  sendMessage();
});

// Enter key support
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// const context = `
// you're a professional crop suggestor, and agriculture expert, suggest and answer my questions according to the following data
// sensors deployed at the feild:-
// temperature=${sensor_obj.temperature} degree C
// humidity=${sensor_obj.humidity} %
// soil moisture=${sensor_obj.soil_moisture}

// weather conditions in that region:-
// temperature=${weather_obj.temperature} degree C
// humidity=${weather_obj.humidity} %
// rainfall(in mm)=${weather_obj.precipetation} mm
// weather condition=${weather_obj.condition}
// `
// console.log(context)

async function sendMessage() {
  const input = chatInput.value.trim();
  if (!input) return;

  // Display user message
  addMessage("user", input); // user message
  chatInput.value = "";

  // const input1 = context + input
  // Send to Gemini
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: input }] }
      ]
    })
  });
  const data = await response.json();
  const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response";

  // Display bot reply
  addMessage("bot", botReply)
  // chatbox.innerHTML += `<div class="bot"><b>Bot:</b> ${botReply}</div>`;
  // chatbox.scrollTop = chatbox.scrollHeight;
}
