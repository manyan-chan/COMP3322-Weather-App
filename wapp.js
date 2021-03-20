//Start javascript after loading HTML, required so that javascript is loaded after html
window.onload = main;

//MAIN FUNCTION
function main() {
  renderTitleBlock();
  renderHeader();
  nightMode();
  ndwfRequest();
  wsifRequest();
  aqhiRequest();
  getLocation();
}

//SUB FUNCTIONS
//render title block
function renderTitleBlock() {
  createDiv("title");
  append("title", "<h1>My Weather Portal</h1>");
}

//render header block
function renderHeader() {
  createDiv("headerBlock");
  cwRequest().then((json) => {
    renderPhoto(json.rainfall);
    append("headerBlock", "<h2>Hong Kong</h2>");
    renderDynamicIcon(json.icon);
    append(
      "headerBlock",
      '<p id="temperature"><strong>' + json.temperature + "</strong>°C</p>"
    );
    renderIcon(
      "humidityIcon",
      "headerBlock",
      "/images/drop-48.png",
      "waterdrop-icon"
    );
    append(
      "headerBlock",
      '<p id="humidity"><strong>' + json.humidity + "</strong>%</p>"
    );
    renderIcon(
      "rainIcon",
      "headerBlock",
      "/images/rain-48.png",
      "umbrella-icon"
    );
    append(
      "headerBlock",
      '<p id="rainfall"><strong>' + json.rainfall + "</strong>mm</p>"
    );
    renderIcon("uvIcon", "headerBlock", "/images/UVindex-48.png", "UV-icon");
    if (json.UVindex == "") {
      var uv = 0;
    } else {
      var uv = json.UVindex;
    }
    append("headerBlock", '<p id="uvIndex"><strong>' + uv + "</strong></p>");
  });
}
//render icon
function renderDynamicIcon(num) {
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
function renderPhoto(rainfall) {
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
function nightMode() {
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
//fetch current-weather API
function cwRequest() {
  return fetch(
    "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en"
  ).then((response) => {
    if (response.status == 200) {
      //receive response successfully
      return response.json().then((WR) => {
        // 1. temperature value of HKO
        // 2. humidity value of HKO
        // 3. the rainfall value of Yau Tsim Mong district
        // 4. the UVindex level of King’s Park
        // 5. icon weather icon
        // 6. updated time
        // 7. warning
        // 8. districts' info
        var ret_object = {
          temperature: WR.temperature.data[1].value,
          humidity: WR.humidity.data[0].value,
          rainfall: WR.rainfall.data[13].max,
          UVindex: WR.uvindex, //can be empty
          icon: WR.icon[0],
          time: WR.updateTime,
          warning: WR.warningMessage, //can be empty
          districts: WR.temperature.data,
        };
        return ret_object;
      });
    }
  });
}

//fetch nine-day-weather-forcast API
function ndwfRequest() {
  fetch(
    "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en"
  ).then((response) => {
    if (response.status == 200) {
      //receive response successfully
      response.json().then((weather) => {
        //
        //
        console.log(weather);
      });
    }
  });
}

//fetch weather-station-info API
function wsifRequest() {
  fetch(
    "https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json"
  ).then((response) => {
    if (response.status == 200) {
      //receive response successfully
      response.json().then((weather) => {
        //
        //
        console.log(weather);
      });
    }
  });
}

//fetch AQHI API
function aqhiRequest() {
  fetch("https://dashboard.data.gov.hk/api/aqhi-individual?format=json").then(
    (response) => {
      if (response.status == 200) {
        //receive response successfully
        response.json().then((weather) => {
          //
          //
          console.log(weather);
        });
      }
    }
  );
}

//get user location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      getLocationSuccess,
      getLocationError
    );
  } else {
    console.log("Your broweser does not support getting geolocation.");
  }
}

//getLocation:Success
function getLocationSuccess(loc) {
  // var coords = loc.coords;
  rgReuqest(loc.coords);
}

//getLocation:Error
function getLocationError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

//fetch reverseGeolocation API
function rgReuqest(coords) {
  let lat = coords.latitude;
  let lon = coords.longitude;
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
  ).then((response) => {
    if (response.status == 200) {
      response.json().then((place) => {
        console.log(place);
      });
    }
  });
}
