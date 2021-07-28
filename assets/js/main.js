const API_ID = "451cbdd4cba0b6dd65b15849696d733d"
const DEFAULT_VALUE = "__"

var searchInput = document.querySelector('.search-bar input');
var cityName  = document.querySelector('.city-name');
var weatherState = document.querySelector('.weather-state');
var weatherIcon = document.querySelector('.weather-icon');
var temple = document.querySelector('.temple');
var sunrise = document.querySelector('.sunrise');
var sunset = document.querySelector('.sunset');
var humidity = document.querySelector('.humidity');
var wind = document.querySelector('.wind');

setData('Ha Noi');

searchInput.onchange = (e)=>{
    setData(e.target.value)
}

function setData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_ID}&units=metric`)
        .then(async res => {
            const data = await res.json();
            console.log(data)
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temple.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;
            sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
            sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
            wind.innerHTML = data.wind.speed || DEFAULT_VALUE;
        })
        .then(() => {
            setTimeout(() => {
                document.querySelector('.loader').classList.add("hidden");
            }, 400);
        })
}