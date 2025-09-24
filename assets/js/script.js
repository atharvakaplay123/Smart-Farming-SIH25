let sensor_data = {}

const API_KEY = "AIzaSyAcasDyt0oP2NmFjW3HAMFoDruzsZu3_AU";  // ⚠️ Don't expose directly in production
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

// Map <a> text → section id
const sectionMap = {
  "sensor data": "sensors",
  "weather": "weather",
  "recommendation": "recommendations"
};

function open_sidebar() {
  document.getElementById("side-menu").style.width = "90%";
}
function close_sidebar() {
  document.getElementById("side-menu").style.width = "0%";
}

document.querySelectorAll(".nav-btn").forEach(anchor => {
  anchor.style.cursor = "pointer";
  anchor.addEventListener("click", () => {
    const key = anchor.textContent.trim().toLowerCase();
    const sectionId = sectionMap[key];
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionTop - headerHeight,
        behavior: "smooth"
      });
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
  const prompt = `
  You are an agricultural advisory assistant developed by team ByteCraft. You will always analyze the given sensor data before answering. The data includes soil nutrients (N, P, K in %), soil pH, rainfall (mm), humidity (%), and temperature (°C).

Use this data as the primary reference to give personalized insights, recommendations, and explanations about crop health, fertilizer requirements, irrigation, disease risk, and suitable crops.

When responding:

Acknowledge the sensor values briefly.

Explain what the values mean for soil and crop conditions.

Provide recommendations (e.g., which fertilizer to use, water requirements, suitable crops, possible risks).

Keep responses clear, professional, and practical for farmers.

If the data is insufficient for a definite recommendation, politely state the limitation and suggest additional information.
  ` + JSON.stringify(sensor_data) + input
  // Send to Gemini
  // console.log(sensor_data)
  console.log(prompt)
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: prompt }] }
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

function hide_cre_controls() {
  document.getElementById("cre_inputs").style.display = "none"
}
hide_cre_controls();
function show_cre_controls() {
  document.getElementById("cre_inputs").style.display = "flex"
}
let cre_disp_state = false
function control_cre_cp() {
  if (!cre_disp_state) {
    show_cre_controls()
    cre_disp_state = !cre_disp_state
  } else {
    hide_cre_controls()
    cre_disp_state = !cre_disp_state
  }
}
function feed_data() {
  sensor_data.N = Number(document.getElementById("N").value)
  sensor_data.P = Number(document.getElementById("P").value)
  sensor_data.K = Number(document.getElementById("K").value)
  sensor_data.temperature = Number(document.getElementById("temp").value)
  sensor_data.humidity = Number(document.getElementById("Hu").value)
  sensor_data.ph = Number(document.getElementById("ph").value)
  sensor_data.rainfall = Number(document.getElementById("rain").value)
  // sensor_data.soil_moisture = Number(document.getElementById("ph").value)
  console.log(sensor_data)
}
setTimeout(() => {
  feed_data()
}, 3000)

//ml model
async function show_crops() {
  feed_data()
  const data = await fetch("https://web-production-37278.up.railway.app/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sensor_data)
  });
  const ml_response = await data.json()
  // return ml_response;
  document.getElementById("crop-cards").innerHTML = `
  <div id="crop-card" class="crop-card">
          <h3>${Object.keys(ml_response)[0]}</h3>
          <img src="assets/crops/${Object.keys(ml_response)[0]}.jpg" alt="${Object.keys(ml_response)[0]}">
          <p>${Number(Object.values(ml_response)[0]*100).toFixed(2)}%</p>
        </div>
        <div class="crop-card">
          <h3>${Object.keys(ml_response)[1]}</h3>
          <img src="assets/crops/${Object.keys(ml_response)[1]}.jpg" alt="${Object.keys(ml_response)[1]}">
          <p>${Number(Object.values(ml_response)[1]*100).toFixed(2)}%</p>
        </div>
        <div class="crop-card">
          <h3>${Object.keys(ml_response)[2]}</h3>
          <img src="assets/crops/${Object.keys(ml_response)[2]}.jpg" alt="${Object.keys(ml_response)[2]}">
          <p>${Number(Object.values(ml_response)[2]*100).toFixed(2)}%</p>
        </div>
  `
// console.log(get_crops())
}
