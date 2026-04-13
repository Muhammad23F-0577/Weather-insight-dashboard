// Selectors
const inputBox = document.querySelector('.Inputbox');
const searchBtn = document.getElementById('searchbtn');
const weatherImg = document.querySelector('.weatehrImg');
const temperature = document.querySelector('.Temperature');
const description = document.querySelector('.Description');
const humidity = document.getElementById('Humidity');
const windSpeed = document.getElementById('WindSpeed');
const inputAlert = document.getElementById('inputAlert');
const searchingAlert = document.getElementById('searchingAlert');

const locationNotFound = document.querySelector('.Location');
const weatherBody = document.querySelector('.weatherBody');

// Extra UI elements
const cityName = document.createElement("p");
const dateTime = document.createElement("p");
const historyList = document.createElement("ul");
const toggleBtn = document.createElement("button");

// Styling extra elements
cityName.className = "fw-bold fs-5 mb-1";
dateTime.className = "text-muted small mb-2";
historyList.className = "list-group mt-3";

// Add extra elements to UI
weatherBody.prepend(cityName);
weatherBody.appendChild(dateTime);
weatherBody.appendChild(historyList);

// Dark mode toggle button
toggleBtn.innerText = "🌙 Toggle Mode";
toggleBtn.className = "btn btn-sm btn-outline-secondary mt-3 w-100";
document.querySelector('.card').appendChild(toggleBtn);

let history = [];

// Dark and light mode toggle
// Dark and light mode toggle
$(toggleBtn).click(function () {

    $("body").toggleClass("bg-dark text-white");
    $(".card").toggleClass("bg-dark text-white");

    $(".weatherBody .p-3").toggleClass("bg-light bg-dark text-white");

    $(".hum, .wind").toggleClass("text-muted text-light");
    $(".Description").toggleClass("text-muted text-light");

    $(".list-group-item").toggleClass("bg-dark text-white border-light");
    $(".badge").toggleClass("bg-primary bg-light text-dark");

    $(humidity).toggleClass("text-white");
    $(windSpeed).toggleClass("text-white");
    $(temperature).toggleClass("text-white");
});

// Fetch weather data
async function checkWeather(city) {

    inputAlert.classList.add('d-none');
    searchingAlert.classList.add('d-none');

    // Validate input
    if (city.trim() === "" || !/^[a-zA-Z\s]+$/.test(city)) {
        inputBox.classList.add("border-danger");
        inputAlert.textContent = "Enter a valid city name (letters only)";
        inputAlert.classList.remove('d-none');
        return;
    } else {
        inputBox.classList.remove("border-danger");
        inputBox.classList.add("border-success");
    }

    // Show loading
    searchingAlert.classList.remove('d-none');

    const apiKey = "39dd6b384f3c10eb2b0f855b2022210d";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const weatherData = await response.json();

        searchingAlert.classList.add('d-none');

        // Handle city not found
        if (weatherData.cod !== 200 || weatherData.name.toLowerCase() !== city.toLowerCase()) {

            locationNotFound.classList.remove('d-none');
            weatherBody.classList.add('d-none');
            return;
        }

        $(".Location").addClass('d-none');
        $(".weatherBody").removeClass('d-none');

        // Show city name
        $(cityName).html(`<span class="badge bg-primary">${weatherData.name}</span>`);

        // Show date and time
        const now = new Date();
        $(dateTime).text(now.toLocaleString());

        // Show temperature
        $(temperature).html(`${Math.round(weatherData.main.temp - 273.15)}°C`);

        // Show description
        $(description).text(weatherData.weather[0].description);

        // Show humidity
        $(humidity).text(`${weatherData.main.humidity}%`);

        // Show wind speed
        const windKmH = (weatherData.wind.speed * 3.6).toFixed(1);
        $(windSpeed).text(`${windKmH} Km/H`);

        // Store history
        if (!history.includes(weatherData.name)) {
            history.push(weatherData.name);
        }

        $(historyList).html("");

        history.forEach(c => {
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action text-center";
            li.innerText = c;
            li.style.cursor = "pointer";
            li.onclick = () => checkWeather(c);
            historyList.appendChild(li);
        });

        // Update weather image
        switch (weatherData.weather[0].main) {
            case 'Clouds':
                weatherImg.src = "cloud.png";
                break;
            case 'Clear':
                weatherImg.src = "clear.png";
                break;
            case 'Rain':
                weatherImg.src = "rain.png";
                break;
            case 'Mist':
                weatherImg.src = "mist.png";
                break;
            case 'Snow':
                weatherImg.src = "snow.png";
                break;
            default:
                weatherImg.src = "cloud.png";
        }

    } catch (error) {
        searchingAlert.classList.add('d-none');
        inputAlert.textContent = "Something went wrong. Try again.";
        inputAlert.classList.remove('d-none');
    }
}

// Search button click
searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// Search on Enter key
inputBox.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        checkWeather(inputBox.value);
    }
});