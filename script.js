document.addEventListener('DOMContentLoaded', function() {
    const clockElement = document.getElementById('clock');
    let timeZone = null;

    function updateClock() {
        const now = timeZone ? new Date(new Date().toLocaleString('en-US', { timeZone })) : new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    function updateGreeting() {
        const now = timeZone ? new Date(new Date().toLocaleString('en-US', { timeZone })) : new Date();
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
        const detailedIconMap = {
            '1000': '☀️', // Clear, Sunny
            '1100': '⛅', // Mostly Clear
            '1101': '🌤️', // Partly Cloudy
            '1102': '☁️', // Mostly Cloudy
            '1001': '☁️', // Cloudy
            '2000': '🌫️', // Fog
            '4000': '🌧️', // Drizzle
            '4001': '🌧️', // Rain
            '4200': '🌧️', // Light Rain
            '4201': '🌧️', // Heavy Rain
            '5000': '🌨️', // Snow
            '5001': '🌨️', // Flurries
            '5100': '🌨️', // Light Snow
            '5101': '🌨️', // Heavy Snow
            '6000': '🌧️', // Freezing Drizzle
            '6001': '🌧️', // Freezing Rain
            '6200': '🌧️', // Light Freezing Rain
            '6201': '🌧️', // Heavy Freezing Rain
            '7000': '🌨️', // Ice Pellets
            '7101': '🌨️', // Heavy Ice Pellets
            '7102': '🌨️', // Light Ice Pellets
            '8000': '⛈️', // Thunderstorm
        };

        const categoryMap = {
            '0': '🌡️', // Unknown
            '1': '☀️', // Clear or cloudy
            '2': '🌫️', // Fog, mist
            '3': '💨', // Wind
            '4': '🌧️', // Rain, drizzle
            '5': '🌨️', // Snow, ice
            '6': '🌧️', // Freezing rain or drizzle
            '7': '🌨️', // Ice pellets, hail
            '8': '⛈️', // Thunderstorm
        };

        if (detailedIconMap.hasOwnProperty(weatherCode)) {
            return detailedIconMap[weatherCode];
        }

        const category = weatherCode.toString()[0];
        return categoryMap[category] || '🌡️'; // Default to thermometer if no match found
    }

    function getWeather() {
        const apiKey = 'Zg1S3Z7rj790j4KKG7M7bfZAQxfjsU1v';
        let cityName = "Unknown Location";
        
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(locationData => {
                console.log('Location data:', locationData);
                const lat = locationData.latitude;
                const lon = locationData.longitude;
                cityName = locationData.city || "Unknown Location"; // Store the city name from ipapi.co
                timeZone = locationData.timezone; // Store the timezone
                updateGreeting(); // Update the greeting immediately after fetching the timezone
                const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}`;

                console.log('Weather API URL:', url);
                return fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Full Weather API response:', data);
                
                if (data.timelines && data.timelines.minutely && data.timelines.minutely[0]) {
                    const currentWeather = data.timelines.minutely[0].values;
                    const temp = Math.round(currentWeather.temperature);
                    const weatherCode = currentWeather.weatherCode.toString();
                    const icon = getWeatherIcon(weatherCode);
                    
                    if (!cityName && data.location) {
                        cityName = data.location.name || data.location.city || data.location.address || cityName;
                    }
                    
                    console.log('Location being used:', cityName);
                    
                    document.getElementById('weather-icon').textContent = icon;
                    document.getElementById('weather-text').textContent = `${cityName} ${temp}°C`;
                } else {
                    throw new Error('Unexpected API response structure');
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                document.getElementById('weather-text').textContent = `Weather data unavailable: ${error.message}`;
            });
    }

    if (document.getElementById('greeting') && document.getElementById('weather')) {
        getWeather();
        setInterval(updateGreeting, 60000); // Update the greeting every minute
        setInterval(getWeather, 600000);
    }

    setInterval(updateClock, 1000);
    updateClock();
});
