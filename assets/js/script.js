// Function to search weather for a city
function searchWeather() {
  const cityInput = document.getElementById('cityInput').value.trim();
  if (cityInput === '') {
    alert('Please enter a city name.');
    return;
  }

  fetchWeatherData(cityInput);
}

// Function to fetch weather data from the API
function fetchWeatherData(city) {
  const apiKey = 'cd15b5288ecd041fe1e3658581b790cd'; // Replace with your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      displayForecast(data);
      addToSearchHistory(city);
      saveSearchHistory(city); // Save the search history to local storage
    })
    .catch(error => console.error('Error fetching weather data:', error));
}
  
  // Function to display current weather
  function displayCurrentWeather(data) {
    const currentWeatherContainer = document.getElementById('currentWeather');
    currentWeatherContainer.innerHTML = '';
  
    const city = data.city.name;
    const currentDate = new Date(data.list[0].dt * 1000).toLocaleDateString();
    const temperature = Math.round(data.list[0].main.temp - 273.15); 
    const humidity = data.list[0].main.humidity;
    const windSpeed = (data.list[0].wind.speed * 2.237).toFixed(2); 
    const weatherIcon = data.list[0].weather[0].icon;
    const currentWeatherHTML = `
    <div class="current-weather">
      <div class="weather-header">
        <h2>${city} <span>(${currentDate})</span></h2>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
      </div>
      <div class="weather-info">
        <p>Temp: ${temperature}°C</p>
        <p>Wind: ${windSpeed} MPH</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    </div>
  `;
  
    currentWeatherContainer.innerHTML = currentWeatherHTML;
  }

// Function to display 5-day forecast
function displayForecast(data) {
  const forecastHeadingContainer = document.getElementById('forecastHeading');
  forecastHeadingContainer.innerHTML = `<h2>5-Day Forecast</h2>`; 

  const forecastItemsContainer = document.getElementById('forecastItems');
  forecastItemsContainer.innerHTML = ''; 

  const forecasts = data.list.filter((item, index) => index % 8 === 0); 

  const forecastHTML = forecasts.map(forecast => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const temperature = Math.round(forecast.main.temp - 273.15); 
    const humidity = forecast.main.humidity;
    const windSpeed = (forecast.wind.speed * 2.237).toFixed(2); 
    const weatherIcon = forecast.weather[0].icon;

    return `
      <div class="forecast-item" style="background-color: #00224D; color: white">
        <p>${date}</p>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
        <p>Temp: ${temperature}°C</p>
        <p>Wind: ${windSpeed} MPH</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
  }).join('');

  forecastItemsContainer.innerHTML = forecastHTML;
}

  // Function to add city to search history
function addToSearchHistory(city) {
  const searchHistoryContainer = document.getElementById('searchHistory');
  const searchHistoryItem = document.createElement('div');
  searchHistoryItem.classList.add('search-history-item');
  searchHistoryItem.textContent = city;

  searchHistoryItem.addEventListener('click', () => {
    fetchWeatherData(city);
  });

  searchHistoryContainer.appendChild(searchHistoryItem);
}

// Function to save search history to local storage
function saveSearchHistory(city) {
  let searchHistory = localStorage.getItem('weatherSearchHistory');
  if (!searchHistory) {
    searchHistory = [];
  } else {
    searchHistory = JSON.parse(searchHistory);
  }

  // Add the new city to the search history
  searchHistory.push(city);
  
  // Save the updated search history back to local storage
  localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
}

