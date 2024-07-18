// script.js

document.addEventListener('DOMContentLoaded', function() {
    const clockElement = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Call updateClock every second
    setInterval(updateClock, 1000);
    
    // Initial call to display clock immediately
    updateClock();
});

function updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let greeting;
        if (hour < 12) {
            greeting = "Good Morning";
        } else if (hour < 18) {
            greeting = "Good Afternoon";
        } else {
            greeting = "Good Evening";
        }
        document.getElementById('greeting').textContent = greeting;
    }

    function getWeatherIcon(weatherCode) {
        // Map weather codes to Unicode weather symbols
        const iconMap = {
            '113': '☀️', // Sunny
            '116': '⛅', // Partly cloudy
            '119': '☁️', // Cloudy
            '122': '☁️', // Overcast
            '143': '🌫️', // Mist
            '176': '🌦️', // Patchy rain possible
            '179': '🌨️', // Patchy snow possible
            '182': '🌧️', // Patchy sleet possible
            '185': '🌧️', // Patchy freezing drizzle possible
            '200': '⛈️', // Thundery outbreaks possible
            '227': '🌨️', // Blowing snow
            '230': '🌨️', // Blizzard
            '248': '🌫️', // Fog
            '260': '🌫️', // Freezing fog
            '263': '🌦️', // Patchy light drizzle
            '266': '🌦️', // Light drizzle
            '281': '🌧️', // Freezing drizzle
            '284': '🌧️', // Heavy freezing drizzle
            '293': '🌦️', // Patchy light rain
            '296': '🌦️', // Light rain
            '299': '🌧️', // Moderate rain at times
            '302': '🌧️', // Moderate rain
            '305': '🌧️', // Heavy rain at times
            '308': '🌧️', // Heavy rain
            '311': '🌧️', // Light freezing rain
            '314': '🌧️', // Moderate or heavy freezing rain
            '317': '🌨️', // Light sleet
            '320': '🌨️', // Moderate or heavy sleet
            '323': '🌨️', // Patchy light snow
            '326': '🌨️', // Light snow
            '329': '🌨️', // Patchy moderate snow
            '332': '🌨️', // Moderate snow
            '335': '🌨️', // Patchy heavy snow
            '338': '🌨️', // Heavy snow
            '350': '🌧️', // Ice pellets
            '353': '🌦️', // Light rain shower
            '356': '🌧️', // Moderate or heavy rain shower
            '359': '🌧️', // Torrential rain shower
            '362': '🌧️', // Light sleet showers
            '365': '🌧️', // Moderate or heavy sleet showers
            '368': '🌨️', // Light snow showers
            '371': '🌨️', // Moderate or heavy snow showers
            '374': '🌧️', // Light showers of ice pellets
            '377': '🌧️', // Moderate or heavy showers of ice pellets
            '386': '⛈️', // Patchy light rain with thunder
            '389': '⛈️', // Moderate or heavy rain with thunder
            '392': '🌩️', // Patchy light snow with thunder
            '395': '⛈️'  // Moderate or heavy snow with thunder
        };
        return iconMap[weatherCode] || '🌡️'; // Default to thermometer if code not found
    }

    function getWeather() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(locationData => {
                console.log('Location data:', locationData);
                const city = locationData.city;
                const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

                console.log('Weather API URL:', url);
                return fetch(url);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Weather data:', data);
                if (data.current_condition && data.current_condition[0].temp_C) {
                    const temp = data.current_condition[0].temp_C;
                    const weatherCode = data.current_condition[0].weatherCode;
                    const icon = getWeatherIcon(weatherCode);
                    document.getElementById('weather').textContent = `${icon} ${temp}°C`;
                } else {
                    throw new Error('Unexpected API response structure');
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                document.getElementById('weather').textContent = `Weather data unavailable: ${error.message}`;
            });
    }

    // Only run these functions if the necessary elements exist
    if (document.getElementById('greeting') && document.getElementById('weather')) {
        updateGreeting();
        getWeather();
        setInterval(updateGreeting, 60000);
        setInterval(getWeather, 600000);
    }


