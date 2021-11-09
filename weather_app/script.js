
const wrapper = document.querySelector(".wrapper");
const inputPart = document.querySelector(".input_part");
const infoTxt = inputPart.querySelector(".input_txt");
const inputFied = inputPart.querySelector("input");
const locationButton = inputPart.querySelector("button");
const arrowBack = wrapper.querySelector("header i");
const weatherIcon = document.querySelector(".weather_part img");
let api;
inputFied.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputFied.value != "") {
        requestApi(inputFied.value);
    }
});

locationButton.addEventListener("click", () => {
    if(navigator.geolocation) { // neu trinh duyet ho tro lay vi tri thi lay vi tri hien tai
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else {
        alert("Trinh duyet khong ho tro lay vi tri cua ban");
    }
});

function onSuccess(position) {
    console.log(position);
    const {latitude,longitide} = position.coords; //latitude: vi do,  longititude: kinh do, coords: toa do
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitide}&units=metric&appid=${apiKey}`
    fetchData();
}
function onError(error) {
    infoTxt.textContent = error.message;
    infoTxt.classList.add("error");
}
function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData()
}

function fetchData() {
    infoTxt.textContent = "Getting weather details..." 
    infoTxt.classList.add("pending");
    //nhận được phản hồi api và trả lại nó vào đối tượng js và trong một đối tượng khác
    //sau đó hàm gọi hàm WeatherDetails với việc truyền kết quả api làm đối số
    fetch(api).then(response => response.json().then(result => weatherDetails(result)));
    // result la moi object gom cac thong tin cua thoi tiet
}
function weatherDetails(info) {
    if(info.cod == "404") {
        infoTxt.classList.replace("pending","error");
        infoTxt.textContent = `${inputFied.value} isn't a valid city name`;
    }else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;
        if(id == 800) weatherIcon.src = "Weather Icons/clear.svg";
        if(id == 801) weatherIcon.src = "Weather Icons/cloud_sun.svg";
        else if(id >= 200 && id <= 232) weatherIcon.src = "Weather Icons/storm.svg";
        else if(id >=300 && id <= 321) weatherIcon.src = "Weather Icons/drizzle.svg";
        else if(id >= 500 && id <= 531) weatherIcon.src = "Weather Icons/rain.svg";
        else if(id >= 600 && id <= 622) weatherIcon.src = "Weather Icons/snow.svg";
        else if(id >= 700 && id <= 781) weatherIcon.src = "Weather Icons/haze.svg";
        else if(id > 800 && id <= 802) weatherIcon.src = "Weather Icons/cloud.svg";
        else if(id > 803 && id <= 804) weatherIcon.src = "Weather Icons/cloud_overcast.svg";
        description.charAt(0).toUpperCase();
        wrapper.querySelector(".temp .num").textContent = Math.floor(temp);
        wrapper.querySelector(".weather").textContent = description;
        wrapper.querySelector(".location span").textContent = `${city}, ${country}`;
        wrapper.querySelector(".temp .num_2").textContent = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").textContent = `${humidity}%`;
        wrapper.classList.add("active");
        infoTxt.classList.remove("pending","error");
        console.log(info);
    }
    arrowBack.addEventListener("click",() => {
       wrapper.classList.remove("active"); 
    });
}