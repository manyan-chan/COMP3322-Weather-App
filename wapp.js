//Start javascript after loading HTML
window.onload = main;

//main function
function main() {
  document.body.innerHTML += "<h1>My Weather Portal</h1>";
  cwRequest();
  ndwfRequest();
  wsifRequest();
  aqhiRequest();
}

//fetch current-weather API
function cwRequest() {
  fetch(
    "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en"
  ).then((response) => {
    if (response.status == 200) {
      //receive response successfully
      response.json().then((weather) => {
        // 1. temperature value of HKO
        // 2. humidity value of HKO
        // 3. the rainfall value of Yau Tsim Mong district
        // 4. the UVindex level of King’s Park
        // 5. icon weather icon
        // 6. updated time
        console.log(weather);
        let temperature = weather.temperature.data[1].value;
        let humidity;
        let rainfall;
        let UVindex;
        let weatherIcon;
        let lastUpdate;
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
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}