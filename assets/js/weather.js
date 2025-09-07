// export const weather_obj={
//     condition:" ",
//     temperature:0,
//     humidity:0,
//     precipetation:0
// }

async function getWeather() {
    const city = document.getElementById("region").value;
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
        console.log(error.message)
    }
}
getWeather()