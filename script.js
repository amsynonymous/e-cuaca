async function getWeather() {

    const city = document.getElementById("city").value

    if (city === "") {
        alert("Please select a district")
        return
    }

    document.getElementById("loading").style.display = "block"
    document.getElementById("weatherContent").style.display = "none"

    try {

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`

        const geoResponse = await fetch(geoUrl)

        const geoData = await geoResponse.json()

        console.log(geoData)

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found")
        }

        const lat = geoData.results[0].latitude
        const lon = geoData.results[0].longitude

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`

        const weatherResponse = await fetch(weatherUrl)

        const weatherData = await weatherResponse.json()
        const dates = weatherData.daily.time
        const maxTemp = weatherData.daily.temperature_2m_max
        const minTemp = weatherData.daily.temperature_2m_min
        const codes = weatherData.daily.weathercode

        console.log("Weather Data:", weatherData)

        const weatherCode = weatherData.current.weather_code
        const isDay = weatherData.current.is_day

        const body = document.body

        body.classList.remove("sunny", "cloudy", "rainy", "night")

        document.querySelector(".sun").style.display = "none"
        document.querySelector(".rain").style.display = "none"
        document.querySelector(".stars").style.display = "none"

        if (isDay === 0) {

            body.classList.add("night")

            document.querySelector(".stars").style.display = "block"

        }
        else if (weatherCode === 0) {

            body.classList.add("sunny")

            document.querySelector(".sun").style.display = "block"

        }
        else if (weatherCode <= 3) {

            body.classList.add("cloudy")

        }
        else {

            body.classList.add("rainy")

            document.querySelector(".rain").style.display = "block"

        }

        document.getElementById("cityName").innerText = city

        document.getElementById("temperature").innerText =
            Math.round(weatherData.current.temperature_2m) + "°C"

        document.getElementById("humidity").innerText =
            weatherData.current.relative_humidity_2m + "%"

        document.getElementById("wind").innerText =
            weatherData.current.wind_speed_10m + " km/h"

        document.getElementById("weatherText").innerText =
            getWeatherText(weatherCode)

        const forecastContainer = document.getElementById("forecast")

        forecastContainer.innerHTML = ""

        for (let i = 0; i < 7; i++) {

            const date = new Date(dates[i])

            const day = date.toLocaleDateString("en-US", { weekday: "short" })

            const card = document.createElement("div")

            card.classList.add("forecast-card")

            card.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-icon">${getWeatherIcon(codes[i])}</div>
            <div class="forecast-temp">
            ${Math.round(maxTemp[i])}° / ${Math.round(minTemp[i])}°
            </div>
            `

            forecastContainer.appendChild(card)

        }
    }
    catch (error) {

        alert("Unable to load weather")

    }

    document.getElementById("loading").style.display = "none"

    document.getElementById("weatherContent").style.display = "block"

}

function getWeatherText(code) {

    if (code === 0) return "Clear Sky"

    if (code <= 3) return "Cloudy"

    if (code <= 48) return "Fog"

    if (code <= 67) return "Rain"

    if (code <= 77) return "Snow"

    return "Storm"

}

const malaysiaLocations = {

    Terengganu: [
        "Kuala Terengganu",
        "Kemaman",
        "Dungun",
        "Besut",
        "Marang",
        "Hulu Terengganu",
        "Setiu"
    ],

    Kelantan: [
        "Kota Bharu",
        "Pasir Mas",
        "Pasir Puteh",
        "Tumpat",
        "Bachok",
        "Tanah Merah",
        "Kuala Krai",
        "Gua Musang"
    ],

    Pahang: [
        "Kuantan",
        "Temerloh",
        "Bentong",
        "Pekan",
        "Raub",
        "Jerantut",
        "Maran",
        "Rompin"
    ],

    Selangor: [
        "Shah Alam",
        "Petaling Jaya",
        "Klang",
        "Gombak",
        "Hulu Langat",
        "Kuala Selangor",
        "Sepang",
        "Kuala Langat"
    ],

    Johor: [
        "Johor Bahru",
        "Muar",
        "Batu Pahat",
        "Kluang",
        "Segamat",
        "Kota Tinggi",
        "Pontian"
    ],

    Sabah: [
        "Kota Kinabalu",
        "Sandakan",
        "Tawau",
        "Lahad Datu",
        "Keningau",
        "Semporna"
    ],

    Sarawak: [
        "Kuching",
        "Miri",
        "Sibu",
        "Bintulu",
        "Samarahan",
        "Serian"
    ],

    Perak: [
        "Ipoh",
        "Taiping",
        "Teluk Intan",
        "Kampar",
        "Manjung"
    ],

    "Pulau Pinang": [
        "George Town",
        "Butterworth",
        "Bukit Mertajam"
    ],

    Kedah: [
        "Alor Setar",
        "Sungai Petani",
        "Kulim",
        "Langkawi"
    ],

    Perlis: [
        "Kangar"
    ],

    Melaka: [
        "Melaka",
        "Alor Gajah",
        "Jasin"
    ],

    "Negeri Sembilan": [
        "Seremban",
        "Port Dickson",
        "Kuala Pilah",
        "Tampin"
    ],

    "Kuala Lumpur": [
        "Kuala Lumpur"
    ],

    Putrajaya: [
        "Putrajaya"
    ],

    Labuan: [
        "Labuan"
    ]

}

function updateCities() {

    const state = document.getElementById("state").value

    const cityDropdown = document.getElementById("city")

    cityDropdown.innerHTML = '<option value="">Select District</option>'

    if (state === "") {

        cityDropdown.disabled = true

        return

    }

    cityDropdown.disabled = false

    malaysiaLocations[state].forEach(city => {

        const option = document.createElement("option")

        option.value = city

        option.textContent = city

        cityDropdown.appendChild(option)

    })

}

function getWeatherIcon(code) {

    if (code === 0) return "☀️"

    if (code <= 3) return "☁️"

    if (code <= 48) return "🌫"

    if (code <= 67) return "🌧"

    if (code <= 77) return "❄️"

    return "⛈"

}