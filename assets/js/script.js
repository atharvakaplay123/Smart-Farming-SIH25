const API_KEY = "AIzaSyAcasDyt0oP2NmFjW3HAMFoDruzsZu3_AU";  // ⚠️ Don't expose directly in production
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

// Map <a> text → section id
const sectionMap = {
  "sensor data": "sensors",
  "weather": "weather",
  "recommendation": "recommendations"
};

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

async function sendMessage() {
  const input = chatInput.value.trim();
  if (!input) return;

  // Display user message
  addMessage("user", input); // user message
  chatInput.value = "";

  // input = contxt + input
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

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "46c773c392ba46cb461571de2a38ec9d"; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log(data)
    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>🌡️ Temperature: ${data.main.temp} °C</p>
      <p>🌡️ Humidity: ${data.main.humidity} %</p>
      <p>☁️ Weather: ${data.weather[0].description}</p>
      <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
    `;
    return data
  } catch (error) {
    // document.getElementById("weatherResult").innerHTML = `<p style="color:red">${error.message}</p>`;
    console.log(error.message)
  }
}
