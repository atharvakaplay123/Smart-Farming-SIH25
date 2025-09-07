// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";


// export const sensor_obj={
//     temperature:0,
//     humidity:0,
//     soil_moisture:0
// }

// Your Firebase project config (replace with yours from console)
const firebaseConfig = {
    apiKey: "AIzaSyDGuDMWwY-0BK5FW64eJ18kpgUZeFArVs4",
    authDomain: "smart-farming-system-fa125.firebaseapp.com",
    databaseURL: "https://smart-farming-system-fa125-default-rtdb.firebaseio.com",
    projectId: "smart-farming-system-fa125",
    storageBucket: "smart-farming-system-fa125.firebasestorage.app",
    messagingSenderId: "399513527033",
    appId: "1:399513527033:web:cffb1416f8f4e02634f828",
    measurementId: "G-RR1KN00VDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Listen for live updates
onValue(ref(db, "/smart_farming"), (snapshot) => {
    const sen_data = snapshot.val();
    let stat = ""
    let stat_txt = ""
    let stat_txt1 = ""
    if (Number(sen_data.Soil_Moisture) > 80) { stat = "good"; stat_txt = "Optimal"; stat_txt1 = "On Track"}
    else if (Number(sen_data.Soil_Moisture) > 60 && Number(sen_data.Soil_Moisture) < 79) { stat = "warn"; stat_txt = "Stressed"; stat_txt1 = "Monitor"}
    else { stat = "bad"; stat_txt = "Critical"; stat_txt1 = "Needs attention" }
    const avg = (Number(sen_data.Soil_Moisture) + Number(sen_data.Humidity)) / 2
    // sensor_obj.humidity = Number(sen_data.Humidity)
    // sensor_obj.temperature = Number(sen_data.Temperature)
    // sensor_obj.soil_moisture = Number(sen_data.Soil_Moisture)
    document.getElementById("sensor-data").innerHTML = `
    <tr>
        <td>Node-01</td>
        <td>North Field</td>
        <td>${sen_data.Soil_Moisture}%</td>
        <td>${sen_data.Humidity}%</td>
        <td>${sen_data.Temperature}°C</td>
        <td><span class="status ${stat}">${stat_txt}</span></td>
    </tr>
    `

    document.getElementsByClassName("kpis")[0].innerHTML = `
    <div class="kpi" role="listitem">
        <div class="label">Avg. Crop Health</div>
        <div class="value">${avg}%</div>
        <div class="bar" aria-hidden="true"><i style="width:${avg}%"></i></div>
        <div class="trend" style="color:var(--good)">▲ +3% this week</div>
    </div>
    <div class="kpi" role="listitem">
        <div class="label">Soil Moisture</div>
        <div class="value">${sen_data.Soil_Moisture}%</div>
        <div class="bar" aria-hidden="true"><i style="width:${sen_data.Soil_Moisture}%"></i></div>
        <div class="trend" style="color:var(--${stat})">● ${stat_txt1}</div>
    </div>
    `
});

