// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const weatherData = document.getElementById('weather-data');

// Weather Data Elements
const cityName = document.getElementById('city-name');
const date = document.getElementById('date');
const weatherIcon = document.getElementById('weather-icon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const feelsLike = document.getElementById('feels-like');
const pressure = document.getElementById('pressure');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        showError('Please enter a city name');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        } else {
            showError('Please enter a city name');
        }
    }
});

// Fetch Weather Data
async function getWeatherData(city) {
    try {
        // Show loading, hide previous data and errors
        showLoading();
        hideError();
        hideWeatherData();

        // Construct API URL
        const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        // Fetch data from API
        const response = await fetch(url);

        // Check if response is successful
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your configuration.');
            } else {
                throw new Error('Unable to fetch weather data. Please try again later.');
            }
        }

        // Parse JSON response
        const data = await response.json();

        // Display weather data
        displayWeatherData(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Display Weather Data
function displayWeatherData(data) {
    // Update city name and country
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    // Update current date
    const currentDate = new Date();
    date.textContent = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;

    // Update temperature
    temp.textContent = `${Math.round(data.main.temp)}°C`;

    // Update description
    description.textContent = data.weather[0].description;

    // Update weather details
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} hPa`;

    // Show weather data
    showWeatherData();
}

// UI Helper Functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showWeatherData() {
    weatherData.classList.remove('hidden');
}

function hideWeatherData() {
    weatherData.classList.add('hidden');
}

// Optional: Load weather for a default city on page load
window.addEventListener('load', () => {
    // Uncomment the line below to load a default city
    // getWeatherData('London');
});