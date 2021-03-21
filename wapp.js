//Start javascript after loading HTML, required so that javascript is loaded after html
window.onload = main;

//MAIN FUNCTION
function main() {
  fetchEveryting().then((value) => {
    //  value includes:
    //  cw: currentWeather,
    //  wf: weatherForecast,
    //  ws: weatherStation,
    //  aqhi: aqhi,
    //  loc: location,
    console.log(value);
    renderTitleBlock();
    renderHeader(value.cw);

    toggleNightMode();
  });
}

//SUB FUNCTIONS
//render title block
function renderTitleBlock() {
  createDiv("title");
  append("title", "<h1>My Weather Portal</h1>");
}

//render header block
function renderHeader(cw) {
  createDiv("headerBlock");
  switchPhoto(cw.rainfall.data[13].max);
  append("headerBlock", "<h2>Hong Kong</h2>");
  renderWeatherIcon(cw.icon[0]);
  append(
    "headerBlock",
    '<p id="temperature"><strong>' +
      cw.temperature.data[1].value +
      "</strong>°C</p>"
  );
  renderIcon(
    "humidityIcon",
    "headerBlock",
    "/images/drop-48.png",
    "waterdrop-icon"
  );
  append(
    "headerBlock",
    '<p id="humidity"><strong>' + cw.humidity.data[0].value + "</strong>%</p>"
  );
  renderIcon("rainIcon", "headerBlock", "/images/rain-48.png", "umbrella-icon");
  append(
    "headerBlock",
    '<p id="rainfall"><strong>' + cw.rainfall.data[13].max + "</strong>mm</p>"
  );
  renderIcon("uvIcon", "headerBlock", "/images/UVindex-48.png", "UV-icon");
  if (cw.uvindex == "") {
    var uv = 0;
  } else {
    var uv = cw.uvindex.data[0].value;
  }
  append("headerBlock", '<p id="uvIndex"><strong>' + uv + "</strong></p>");
  var time = cw.updateTime.substring(11, 16);
  append("headerBlock", '<p id="updateTime">Last Update: ' + time + "</p>");
}

//render icon
function renderWeatherIcon(num) {
  var img = new Image();
  img.id = "icon1";
  img.alt = "Weather Icon";
  img.src = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${num}.png`;
  append2("headerBlock", img);
}

//render icon with ID, destination, src and alt
function renderIcon(id, desID, src, alt) {
  var img = new Image();
  img.id = id;
  img.alt = alt;
  img.src = src;
  append2(desID, img);
}

//switch photos base on time of day and weather
function switchPhoto(rainfall) {
  var currentTime = new Date().getHours();
  var day = 7 <= currentTime && currentTime < 18;
  var img = new Image();
  img.id = "mainBlockImg";
  img.alt = "background image of main block";

  var rain = rainfall > 0;
  if (rain) {
    //raining
    img.src = day
      ? "/images/water-drops-glass-day.jpg"
      : "/images/water-drops-glass-night.jpg";
  } else {
    //not raining
    img.src = day ? "/images/blue-sky.jpg" : "/images/night-sky.jpg";
  }
  append2("headerBlock", img);
}

//toggle nightmode
function toggleNightMode() {
  var currentTime = new Date().getHours();
  var day = 7 <= currentTime && currentTime < 18;
  if (!day) {
    var x = document.getElementsByTagName("div");
    for (let index = 1; index < x.length; index++) {
      x[index].classList.toggle("nightMode");
    }
  }
}

//function to append element to the end with desire ID quickly by innerHTML
function append(idName, content) {
  var element = document.getElementById(idName);
  element.innerHTML += content;
}

//append with javascript object
function append2(idName, content) {
  var div = document.getElementById(idName);
  div.appendChild(content);
}

//function to create div, set an UNIQUE ID to it, and append it to end of <body>
function createDiv(id) {
  document.body.innerHTML += `<div id=${id}></div>`;
}

//fetch EVERYTHING
async function fetchEveryting() {
  const currentWeather = await fetch(
    "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en"
  ).then((response) => {
    return response.json();
  });

  const weatherForecast = await fetch(
    "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en"
  ).then((response) => {
    return response.json();
  });

  const weatherStation = await fetch(
    "https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json"
  ).then((response) => {
    return response.json();
  });
  const aqhi = await fetch(
    "https://dashboard.data.gov.hk/api/aqhi-individual?format=json"
  ).then((response) => {
    return response.json();
  });

  var lat, lon;
  const location = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      ).then((response) => {
        resolve(response.json());
      });
    });
  });

  return Promise.all([
    currentWeather,
    weatherForecast,
    weatherStation,
    aqhi,
    location,
  ]).then((value) => {
    var ret = {
      cw: value[0],
      wf: value[1],
      ws: value[2],
      aqhi: value[3],
      loc: value[4],
    };
    return ret;
  });
}
