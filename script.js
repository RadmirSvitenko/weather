// const API_KEY = "b067377a72c98ae6963cdae2e35408d9";
const API_KEY = "54a33f5b2a77e72f522c2b60e3ae3674";

const API = ({
  lon = "",
  lat = "",
  units = "metric",
  lang = "en",
  q = "",
  appid = API_KEY,
}) =>
  `http://api.openweathermap.org/data/2.5/weather?&units=${units}&q=${q}&lat=${lat}&lon=${lon}&lang=${lang}&appid=${appid}`;

const API_FIVE_DAY = ({ appid = API_KEY, lat, lon }) =>
  `http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${appid}`;

// const API_ABOUT_INFO = ({ appid = API_KEY, lat, lon }) =>
//   `http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${appid}`;

const IMAGE_ID = "dl-M7oCYSYebRyLirzKYEEjyvaJsgzHyGNh-dd_ldUA";

const wrapper = document.getElementById("wrapper");
const content = document.getElementById("content");
const input = document.getElementById("input");
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const maxTemp = document.getElementById("max_temp");
const feelTemp = document.getElementById("feel_temp");
const weatherDescription = document.getElementById("weather_description");
const humidity = document.getElementById("humidity");
const widnSpeed = document.getElementById("wind_speed");
const time = document.getElementById("time");
const icon = document.getElementById("icon");
const jumpyBars = document.getElementById("jumpy-bars");
const days = document.getElementById("days");
const daysContent = document.getElementById("days_content");
const daysWeek = document.getElementById("days_week");
const day = document.getElementById("day");
const aboutWeather = document.getElementById("about_weather");
const aboutWeatherSub = document.getElementById("about_weather_sub");
const weatherAboutIcon = document.getElementById("weather_about_icon");
const weatherAboutCountry = document.getElementById("weather_about_country");
const weatherAboutSunrise = document.getElementById("weather_about_sunrise");
const weatherAboutSunset = document.getElementById("weather_about_sunset");

jumpyBars.style.display = "none";
content.style.display = "none";

async function getCurrentWeather() {
  jumpyBars.style.display = "flex";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const response = await fetch(
        API({ lon: position.coords.longitude, lat: position.coords.latitude })
      );
      const weather = await response.json();
      jumpyBars.style.display = "none";
      content.style.display = "flex";

      showWeather(weather);
    },
    () => {}
  );
}

getCurrentWeather();

async function getWeatherBySearch() {
  event.preventDefault();
  try {
    const response = await fetch(API({ q: input.value }));
    const weather = await response.json();
    console.log("weather: ", weather);

    const res = await getWeatherFiveDays({
      lat: weather.coord.lat,
      lon: weather.coord.lon,
    });

    showWeather(weather);
    getAboutInfo(weather);
  } catch (error) {
    console.log("error: ", error);
    // alert('Данного города нет!');
  }
}

async function showWeather(weather) {
  const nowDateTimeValue = new Date();
  let nowDateTime = [
    nowDateTimeValue.getDate(),
    nowDateTimeValue.getMonth() + 1,
    nowDateTimeValue.getFullYear(),
  ];

  if (nowDateTime[1] < 10) {
    nowDateTime[1] = "0" + nowDateTime[1];
  } else {
    nowDateTime[1] = nowDateTimeValue.getMonth() + 1;
  }
  nowDateTime = String(nowDateTime);
  // finalNowTime - nowDateTime.replace(",", ".");
  console.log(nowDateTime);

  city.innerHTML = weather.name;
  temp.innerHTML = `${weather.main.temp} °C`;
  maxTemp.innerHTML = `${weather.main.temp_max} °C`;
  feelTemp.innerHTML = `на ${weather.main.feels_like} °C`;
  weatherDescription.innerHTML = weather.weather[0].description.toUpperCase();
  humidity.innerHTML = `${weather.main.humidity}%`;
  widnSpeed.innerHTML = `${weather.wind.speed} м/с`;
  time.innerHTML = `${nowDateTime}`;

  icon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  icon.style.width = "150px";
  icon.style.height = "150px";

  try {
    const responseImage = await fetch(
      `https://api.teleport.org/api/urban_areas/slug:${weather.name.toLowerCase()}/images/`
    );

    const dataImage = await responseImage.json();
    if (weather.name === "Bishkek") {
      wrapper.style.background = "url(images/00_bishkek.jpg)";
      wrapper.style.backgroundSize = "100% 100vh";
    } else {
      const image = dataImage.photos[0].image.web;
      wrapper.style.background = `url(${image})`;
      wrapper.style.backgroundSize = "100% 100vh";
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

async function getWeatherFiveDays({ lat, lon }) {
  daysContent.removeChild(document.getElementById("days_week"));

  const response = await fetch(API_FIVE_DAY({ lat, lon }));
  const weather = await response.json();
  console.log(weather.list);

  const list = weather.list.filter((item, index) => index % 8 == 0);
  console.log("list: ", list);
  const newDaysWeek = document.createElement("div");
  newDaysWeek.id = "days_week";
  newDaysWeek.classList.add("days-week");
  list.forEach((item) => {
    const day = document.createElement("h2");
    day.style.color = "black";
    newDaysWeek.appendChild(day);

    day.innerHTML = `${item.main.temp} °C`;

    weatherAboutIcon.style.width = "300px";
    weatherAboutIcon.style.height = "300px";

    daysContent.style.position = "static";
    daysContent.style.visibility = "visible";
    daysContent.style.marginLeft = "20px";

    aboutWeather.style.position = "static";
    aboutWeather.style.visibility = "visible";
    aboutWeather.style.marginRight = "20px";
  });
  daysContent.appendChild(newDaysWeek);
}

async function getAboutInfo(weather) {
  weatherAboutIcon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  weatherAboutCountry.style.fontWeight = "bold";
  weatherAboutSunrise.style.fontWeight = "bold";
  weatherAboutSunset.style.fontWeight = "bold";

  const weatherTimeZone = weather.timezone;

  const sunriseTime = new Date(weather.sys.sunrise * 1000);
  const formattedSunriseTime = sunriseTime.toLocaleTimeString();
  console.log(sunriseTime);

  const sunsetTime = new Date(weather.sys.sunset * 1000);
  const formattedSunsetTime = sunsetTime.toLocaleTimeString();
  console.log(sunsetTime);

  const finalSunriseTime = formattedSunriseTime.substring(0, 5);
  const finalSunsetTime = formattedSunsetTime.substring(0, 5);

  weatherAboutCountry.innerHTML = `${weather.sys.country}`;
  weatherAboutSunrise.innerHTML = `${finalSunriseTime} UTC`;
  weatherAboutSunset.innerHTML = `${finalSunsetTime} UTC`;
}
