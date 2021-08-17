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

//search with speech---------------------------------------------------------

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.lang = 'vi-VI';
recognition.continuous = false;// du lieu tra ve ngay

const microphone = document.querySelector('.microphone');

const speak = (text) => {
    if (synth.speaking) {
        console.error('Busy. Speaking...');
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utter.onerror = (err) => {
        console.error('SpeechSynthesisUtterance.onerror', err);
    }

    synth.speak(utter);
};

const handleVoice = (text) => {
    console.log('text', text);

    // "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
    const handledText = text.toLowerCase();
    if (handledText.includes('thời tiết tại')) {
        const location = handledText.split('tại')[1].trim();

        console.log('location', location);
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;
    }
    
    const container = document.querySelector('.container');
    if (handledText.includes('thay đổi màu nền')) {
        const color = handledText.split('màu nền')[1].trim();
        container.style.background = color;
        return;
    }

    if (handledText.includes('màu nền mặc định')) {
        container.style.background = '';
        return;
    }

    if (handledText.includes('mấy giờ')) {
        const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
        speak(textToSpeech);
        return;
    }

    speak('Try again');
}

microphone.addEventListener('click', (e) => {
    e.preventDefault();

    recognition.start();
    microphone.classList.add('recording');
});

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerror = (err) => {
    console.error(err);
    microphone.classList.remove('recording');
}

recognition.onresult = (e) => {
    console.log('onresult', e);
    const text = e.results[0][0].transcript;
    handleVoice(text);
}