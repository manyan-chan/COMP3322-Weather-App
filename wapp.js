//Start javascript after loading HTML
window.onload = main;

//main function
function main() {
  document.body.innerHTML = "<h1>My Weather Portal</h1>";
  crRequest;
}

//fetch current weather
function crRequest() {
  fetch(
    `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`
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
        let temperature = weather.temperature.data[1].value;
        console.log(temperature);
      });
    }
  });
}