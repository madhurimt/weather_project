require("dotenv").config();

const APP_URL = "https://api.openweathermap.org/data/2.5/";
const api_key = process.env.API_KEY;

const user_input = document.querySelector(".search");
const msg = document.querySelector(".error_msg");

if (user_input !== null) {
  user_input.addEventListener("keypress", getResults);
}

let geo_code = {
  reverseGeocode: function (latitude, longitude) {
    let api_key_geo = process.env.API_KEY_GEO;
    let api_url = "https://api.opencagedata.com/geocode/v1/json";

    let request_url =
      api_url +
      "?" +
      "key=" +
      api_key_geo +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    let request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status === 200) {
        // Success!
        console.log("i m in here");
        let data = JSON.parse(request.responseText);
        console.log(data.results[0]); // get complete data
        lonlatResults(
          data.results[0].components.city,
          data.results[0].components.country_code
        );
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send(); // make the request
  },
  getLocation: function () {
    function success(data) {
      console.log(data);
      geo_code.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      console.log("i m in here");
      navigator.geolocation.getCurrentPosition(success, console.error);
    } else {
      fetch(`${APP_URL}q=melbourne&units=metric&appid=${api_key}`)
        .then(convertToJSObject)
        .then(getData);
    }
  },
};

function getResults(e) {
  if (e.keyCode == 13) {
    lonlatResults(user_input.value);
    console.log(user_input.value);
  }
}

function lonlatResults(query1, query2) {
  fetch(`${APP_URL}weather?q=${query1},${query2}&units=metric&appid=${api_key}`)
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
  console.log(data);
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

geo_code.getLocation();
