const apiKey = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key
const weatherInfo = document.getElementById("weatherInfo");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  } else {
    weatherInfo.innerHTML = `<p>Please enter a city name!</p>`;
  }
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
      return;
    }

    const { name, main, weather } = data;

    weatherInfo.innerHTML = `
      <h2>${name}</h2>
      <p>${weather[0].description}</p>
      <h3>${main.temp}°C</h3>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather icon">
      <p>Humidity: ${main.humidity}%</p>
      <p>Feels like: ${main.feels_like}°C</p>
    `;
  } catch (error) {
    weatherInfo.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
    console.error("Error:", error);
  }
}
