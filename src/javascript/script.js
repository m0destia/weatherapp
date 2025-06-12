import { cities } from './cities.js'

const form = document.getElementById("weatherform");
const formInput = document.getElementById("city");
const dropdown = document.getElementById("listed");
const display = document.getElementById("display");
const langButton = document.getElementById("language_button");
const backgroundImage = document.getElementById("background_image");

let lang = "en";

function changeLang() {
    if (langButton.textContent == "EN") {
        langButton.textContent = "PT";
        lang = "pt";
        document.querySelector("html").setAttribute("lang", "pt-br");
        loadLang()
    } else if (langButton.textContent == "PT") {
        langButton.textContent = "EN";
        lang = "en";
        document.querySelector("html").setAttribute("lang", "en");
        loadLang()
    }
}

function loadLang() {
    fetch(`src/lang/${lang}.json`)
        .then(res => {
            if (!res.ok) {
                throw new Error("File not found.")
            }

            return res.json();
        })
        .then((data) => {
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                
                if (key === "tooltip") {
                    if (data[key]) {
                        element.innerHTML = 
                        `
                        ${data[key]}<span data-i18n="tooltip-hirable" class="tooltip-hirable" style="color: gray;">${data["tooltip-hirable"]}</span>
                        `;
                    }
                } else {
                    if (data[key]) {
                        element.innerHTML = data[key];
                    }
                }   

                
            })
        })
}

langButton.addEventListener('click', changeLang)

export function putInputValue(value) {
    formInput.value = value
}

window.putInputValue = putInputValue;

formInput.addEventListener('input', function (event) {
    const value = formInput.value.toLowerCase();

    const filtered = cities.filter(city => city.toLowerCase().includes(value)).slice(0, 5);
        
    dropdown.innerHTML = '';
    filtered.forEach((city) => {
        dropdown.innerHTML += `<option>${city}</option>`;
    })
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const city = formData.get("city");

    const url = `https://weather-backend-tz19.onrender.com/clima?city=${city}`

    display.innerHTML = '';
    
    switch (lang) {
        case 'en':
            display.innerHTML += '<p id="message">Getting data! Please wait!</p>';
            break
        case 'pt':
            display.innerHTML += '<p id="message">Conseguindo informações! Espere por favor!</p>';
            break
    }

    display.style.backgroundColor = 'rgb(167, 233, 238)'

    fetch(url, {method: 'get'})
        .then(res => {
            if (!res.ok) {
                display.style.backgroundColor = 'rgb(170, 123, 123)'
                display.innerHTML = '';
                switch (lang) {
                    case 'en':
                        display.innerHTML += '<p id="message">An error occured.</p>';
                        break
                    case 'pt':
                        display.innerHTML += '<p id="message">Um erro ocorreu.</p>';
                        break
                }
                
                throw new Error(`HTTP ERROR! Status ${res.status}`)
            }
            
            return res.json();
        })
        .then((data) => {
            display.style.backgroundColor = 'rgb(255, 255, 255)'
            
            if (display.childElementCount <= 1) {
                display.innerHTML = '';
                display.innerHTML = 
                `
                    <h2 id="city_name">CITY NAME</h2>
                    <p id="city_degrees">45 C</p>
                    <p id="city_weather">WEATHER</p>
                    <span id="city_wind">all good.</span>
                `
            }

            console.log(data)

            const cityName = document.getElementById("city_name");
            const cityDegress = document.getElementById("city_degrees");
            const cityWeather = document.getElementById("city_weather");
            const cityWind = document.getElementById("city_wind");

            cityName.textContent = data.name + " - " + data.sys.country;
            
            switch (lang) {
                case 'en': 
                    cityDegress.textContent = "🌡️ Temperature: " + data.main.temp + " °C";
                    break
                case 'pt':
                    cityDegress.textContent = "🌡️ Temperatura: " + data.main.temp + " °C";
                    break
            }
            
            switch (data.weather['0'].main) {
                case 'Clouds':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌥️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.95)";
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.95)";

                            cityWeather.textContent = "🌥️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(167, 167, 167)';
                    break
                case 'Rain':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌧️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.9)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.9)"

                            cityWeather.textContent = "🌧️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(91, 100, 128)';
                    break
                case 'Clear':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "☀️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(1.1)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(1.1)"

                            cityWeather.textContent = "☀️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(118, 175, 228)';
                    break
                case 'Tornado':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌪️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.85)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.85)"

                            cityWeather.textContent = "🌪️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(75, 75, 75)';
                    break
                case 'Squall':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "💨 " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.88)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.88)"

                            cityWeather.textContent = "💨 " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(75, 82, 104)';
                    break
                case 'Ash':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌋 " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.83)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.83)"

                            cityWeather.textContent = "🌋 " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(95, 28, 28)';
                    break
                case 'Sand':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🏜️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.96)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.96)"

                            cityWeather.textContent = "🏜️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(168, 150, 111)';
                    break
                case 'Fog':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌫️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.9)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.9)"

                            cityWeather.textContent = "🌫️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(155, 155, 155)';
                    break
                case 'Dust':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🟤 " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.87)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.87)"

                            cityWeather.textContent = "🟤 " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(44, 34, 27)';
                    break
                case 'Haze':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌁 " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.88)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.88)"

                            cityWeather.textContent = "🌁 " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(121, 121, 121)';
                    break
                case 'Smoke':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌫️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.95)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.95)"

                            cityWeather.textContent = "🌫️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(204, 204, 204)';
                    break
                case 'Mist':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌫️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.9)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.9)"

                            cityWeather.textContent = "🌫️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(134, 134, 134)';
                    break
                case 'Snow':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌨️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.95)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.95)"

                            cityWeather.textContent = "🌨️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(226, 226, 226)';
                    break
                case 'Drizzle':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "🌦️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.97)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.97)"

                            cityWeather.textContent = "🌦️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(174, 185, 201)';
                    break
                case 'Thunderstorm':
                    switch (lang) {
                        case 'en':
                            cityWeather.textContent = "⛈️ " + data.weather['0'].main;
                            backgroundImage.style.filter = "brightness(0.75)"
                            break
                        case 'pt':
                            const description = data.weather['0'].description;
                            const captalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
                            backgroundImage.style.filter = "brightness(0.75)"

                            cityWeather.textContent = "⛈️ " + captalizedDesc;
                            break
                    }

                    document.body.style.backgroundColor = 'rgb(31, 30, 37)';
                    break
            }
            
            switch (lang) {
                case 'en':
                    cityWind.textContent = "🍃 Wind: " + data.wind.speed + " Km/H";
                    break
                case 'pt':
                    cityWind.textContent = "🍃 Vento: " + data.wind.speed + " Km/H";
                    break
            }
        })
        
        .catch(e => {
            console.error(e);
            display.innerHTML = '';

            switch (lang) {
                case 'en':
                    display.innerHTML += '<p id="message">An error occured, please check again your city.</p>';
                    break
                case 'pt':
                    display.innerHTML += '<p id="message">Um erro ocorreu, por favor cheque sua cidade.</p>';
                    break
            }

            display.style.backgroundColor = 'rgb(218, 144, 126)'
        });
        
});
