require("dotenv").config();

const APP_URL = "https://api.openweathermap.org/data/2.5/weather?";
const api_key = process.env.API_KEY;

const user_input = document.querySelector(".search");
const msg = document.querySelector(".error_msg");

user_input.addEventListener("keypress", getResults);

//getting melbourne results directly on the landing page
fetch(`${APP_URL}q=melbourne&units=metric&appid=${api_key}`)
  .then(convertToJSObject)
  .then(getData);

function getResults(e) {
  if (e.keyCode == 13) {
    lonlatResults(user_input.value);
    console.log(user_input.value);
  }
}

function lonlatResults(query) {
  fetch(`${APP_URL}q=${query}&units=metric&appid=${api_key}`)
    .then(convertToJSObject)
    .then(getData)
    .catch(() => {
      msg.textContent = "Please search for a valid city";
    });
}

function convertToJSObject(res) {
  return res.json();
}

function getData(data) {
  msg.textContent = "";
  let city = document.querySelector(".city");
  city.textContent = `${data.name.toUpperCase()}, ${data.sys.country}`;
  let date = new Date().toDateString().toUpperCase();
  document.querySelector(".date").textContent = date;
  let temp = document.querySelector(".temp");
  temp.textContent = `${data.main.temp}°C`;
  let desc = document.querySelector(".weather");
  desc.textContent = data.weather[0].description.toUpperCase();
  let range = document.querySelector(".temp_range");
  range.textContent = `${data.main.temp_min}°C/ ${data.main.temp_max}°C`;
}
