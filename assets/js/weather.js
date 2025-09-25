// export const weather_obj={
//     condition:" ",
//     temperature:0,
//     humidity:0,
//     precipetation:0
// }

async function getWeather() {
  let city = document.getElementById("region").value;
  const apikey = "c14347e9386d48f7bb4155436250609"
  const url = `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}&days=2`
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log(data)
    document.getElementById("rain").value = data.current.precip_mm
    // weather_obj.condition=data.current.condition.text
    // weather_obj.temperature=Number(data.current.temp_c)
    // weather_obj.humidity=Number(data.current.condition.humidity)
    // weather_obj.precipetation=Number(data.current.precip_mm)
    //${data.location.name}
    document.getElementById("weather-data").innerHTML = `
       <div class="temp">${data.current.temp_c}°C</div>
            <div class="details">
              <p>Condition: ${data.current.condition.text}</p>
              <p>Humidity: ${data.current.humidity}%</p>
              <p>Wind: ${data.current.wind_kph} km/h</p>
              <p>Precipitation: ${data.current.precip_mm} mm</p>
            </div>
        `;
  } catch (error) {
    console.log(error.message)
  }
}
getWeather()
document.getElementById("region").addEventListener("change",getWeather)