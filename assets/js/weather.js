async function getWeather() {
    const city = document.getElementById("region").value;
    // const city = "indore";
    // const apiKey = "46c773c392ba46cb461571de2a38ec9d"; // Replace with your OpenWeatherMap API key
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const apikey = "c14347e9386d48f7bb4155436250609"
    const url = `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}&days=2`
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        console.log(data)
        document.getElementById("weather-data").innerHTML = `
        <tr>
            <td>Today</td>
            <td>${data.current.condition.text}</td>
            <td>${data.current.temp_c} °C</td>
            <td>${data.current.humidity} %</td>
            <td>${data.current.precip_mm} mm</td>
            <td>${data.current.wind_kph} km/h</td>
        </tr>

      
    `;
    } catch (error) {
        // document.getElementById("weatherResult").innerHTML = `<p style="color:red">${error.message}</p>`;
        console.log(error.message)
    }
}
getWeather()
    //   <h2>${data.name}, ${data.sys.country}</h2>
    //   <p>🌡️ Temperature: ${data.main.temp} °C</p>
    //   <p>🌡️ Humidity: ${data.main.humidity} %</p>