window.onload = function () {
  fetchEveryting().then(main);
};

function main({ cw, wf, ws, aqhi, loc, aqhiInfo }) {
  //  value includes:
  //  cw: currentWeather,
  //  wf: weatherForecast,
  //  ws: weatherStation,
  //  aqhi: aqhi,
  //  loc: location,
  console.log({ cw, wf, ws, aqhi, loc, aqhiInfo });
  renderTitleBlock();
  renderHeaderBlock(cw);
  renderWarningBlock(cw);
  renderForcast(wf);
  renderTBlock(cw);
  renderMyDataBlock(cw, aqhi, loc, ws, aqhiInfo);
  toggleNightMode();

  //event handler
  var selcPlace = document.getElementById('places');
  selcPlace.addEventListener('change', (event) => {
    for (key of cw.temperature.data) {
      //console.log(key.place, event.target.value)
      if (key.place == event.target.value) {
        var x = document.getElementById('tbTempBlock');
        x.innerHTML = `${key.value}<span>°C</span>`;
      }
    }
  });

  var button = document.getElementById('button');
  if (button != null) {
    button.addEventListener('click', () => {
      var x = document.getElementById('warning');
      if (x.style.display === 'none') {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    });
  }
}

//SUB FUNCTIONS
//render title block
function renderTitleBlock() {
  createDiv('title');
  append('title', '<h1>My Weather Portal</h1>');
}

//render header block
function renderHeaderBlock(cw) {
  createDiv('headerBlock');
  append('headerBlock', '<h2>Hong Kong</h2>');
  switchPhoto(cw.rainfall.data[13].max);
  renderBigIcon(cw.icon[0]);
  append(
    'headerBlock',
    `<p id="temperature"><strong>${cw.temperature.data[1].value}</strong><span>°C</span></p>`
  );
  renderIcon(
    'humidityIcon',
    'headerBlock',
    'images/drop-48.png',
    'waterdrop-icon'
  );
  append(
    'headerBlock',
    `<p id="humidity"><strong>${cw.humidity.data[0].value}</strong><span>%</span></p>`
  );
  renderIcon('rainIcon', 'headerBlock', 'images/rain-48.png', 'umbrella-icon');
  append(
    'headerBlock',
    `<p id="rainfall"><strong>${cw.rainfall.data[13].max}</strong><span>mm</span></p>`
  );
  renderIcon('uvIcon', 'headerBlock', 'images/UVindex-48.png', 'UV-icon');
  if (cw.uvindex == '') {
    var uv = 0;
  } else {
    var uv = cw.uvindex.data[0].value;
  }
  append('headerBlock', `<p id="uvIndex"><strong>${uv}</strong></p>`);
  var time = cw.updateTime.substring(11, 16);
  append('headerBlock', `<p id="updateTime">Last Update: ${time}</p>`);
}

function renderWarningBlock(cw) {
  var warning = cw.warningMessage;
  var warningBool = warning == '' ? false : true;
  if (warningBool == true) {
    append('headerBlock', "<button type='button' id='button'>Warning</button>");
    createDiv('warning');
    append('warning', `<p>${warning}</p>`);
  }
}

function renderMyDataBlock(cw, aqhi, loc, ws, aqhiInfo) {
  createDiv('myDataBlock');
  append('myDataBlock', '<h2>My Location</h2>');
  var pos = {
    longitude: (loc.lon * Math.PI) / 180,
    latitude: (loc.lat * Math.PI) / 180,
  };
  var address = loc.address;
  var suburb =
    'suburb' in address
      ? address.suburb
      : 'borough' in address
      ? address.borough
      : 'town' in address
      ? address.town
      : 'unknown';
  var district =
    'city_district' in address
      ? address.city_district
      : 'county' in address
      ? address.county
      : 'unknown';
  append('myDataBlock', `<p>${district} - ${suburb}</p>`);

  renderIcon('mdbRain', 'myDataBlock', 'mages/rain-48.png', 'umbrella');
  for (const item of cw.rainfall.data) {
    if (item.place == district) {
      append('myDataBlock', `<p id='first'>${item.max}<span>mm</span></p>`);
    }
  }
  var min = 100;
  var closest_station;

  for (const item of ws) {
    //console.log(`${item.longitude} ${item.latitude}`);

    var lat = (item.latitude * Math.PI) / 180;
    var lon = (item.longitude * Math.PI) / 180;

    const x = (lon - pos.longitude) * Math.cos((lat + pos.latitude) / 2);
    const y = lat - pos.latitude;
    const d = Math.sqrt(x * x + y * y);

    if (d < min) {
      min = d;
      closest_station = item.station_name_en;
    }
  }
  for (const item of cw.temperature.data) {
    if (item.place == closest_station) {
      append('myDataBlock', `<p id='second'>${item.value}<span>°C</span></p>`);
    }
  }

  min = 100;
  var closest_station2;
  for (const item of aqhiInfo) {
    var lat = (item.lat * Math.PI) / 180;
    var lon = (item.lng * Math.PI) / 180;
    closest_station;
    //console.log(item);

    const x = (lon - pos.longitude) * Math.cos((lat + pos.latitude) / 2);
    const y = lat - pos.latitude;
    const d = Math.sqrt(x * x + y * y);

    if (d < min) {
      min = d;
      closest_station2 = item.station;
    }
  }
  for (const item of aqhi) {
    if (item.station == closest_station2) {
      var value = item.aqhi;
      var risk = item.health_risk;
      var img = new Image();
      img.id = 'aqhiLogo';
      img.src =
        risk == 'Very High'
          ? 'images/aqhi-very_high.png'
          : risk == 'High'
          ? 'images/aqhi-high.png'
          : risk == 'Moderate'
          ? 'images/aqhi-moderate.png'
          : risk == 'Serious'
          ? 'images/aqhi-serious.png'
          : risk == 'Low'
          ? 'images/aqhi-low.png'
          : 'undefined';
      img.alt = 'aqhi_logo';
      append('myDataBlock', `<p id='aqhiValue'>${value}</p>`);
      append('myDataBlock', `<p id='aqhiStr'>${risk}</p>`);
      append2('myDataBlock', img);
    }
  }
}

//render temperatureBlock
function renderTBlock(cw) {
  createDiv('tempBlock');
  append('tempBlock', '<h2>Temperatures</h2>');
  append('tempBlock', '<p>Select the location</p>');
  append('tempBlock', "<select id='places' name='places'></select>");
  var list = [];
  var dict = new Object();
  var leng = Object.keys(cw.temperature.data).length;
  for (let index = 0; index < leng; index++) {
    list.push(cw.temperature.data[index].place);
    dict[cw.temperature.data[index].place] = cw.temperature.data[index].value;
  }
  list.sort();
  list.forEach((element) => {
    append('places', `<option value="${element}">${element}</option>`);
  });
  var selcPlace = document.getElementById('places');
  for (key in dict) {
    if (key == selcPlace.value) {
      append(
        'tempBlock',
        `<p id='tbTempBlock'>${dict[key]}<span>°C</span></p>`
      );
    }
  }
}

//render weather forcast
function renderForcast(wf) {
  createDiv('weatherForecast');
  append('weatherForecast', '<h2>9-Day Forcast</h2>');
  append('weatherForecast', "<div id='flexbox'></div>");
  wfSubBlock(wf.weatherForecast);
}

//weatherForecast subBlocks
function wfSubBlock(wf) {
  for (const item of wf) {
    var temp = {
      week: item.week.substring(0, 3),
      date: parseDate(item.forecastDate),
      icon: item.ForecastIcon,
      temperature: [item.forecastMintemp.value, item.forecastMaxtemp.value],
      humidity: [item.forecastMinrh.value, item.forecastMaxrh.value],
    };
    var elem = document.createElement('div');
    elem.classList.add('wfSubBlock');
    elem.innerHTML += `<p>${temp.week} ${temp.date.getDate()}/${
      temp.date.getMonth() + 1
    }</p>`;
    renderSmallIcon(elem, temp.icon);
    elem.innerHTML += `<p>${temp.temperature[0]}-${temp.temperature[1]} °C</p>`;
    elem.innerHTML += `<p>${temp.humidity[0]}-${temp.humidity[1]} %</p>`;
    append2('flexbox', elem);
  }
}

function parseDate(str) {
  var y = str.substr(0, 4),
    m = str.substr(4, 2),
    d = str.substr(6, 2);
  return new Date(y, m, d);
}

//render icon
function renderBigIcon(num) {
  var img = new Image();
  img.id = 'icon1';
  img.alt = 'Weather Icon';
  img.src = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${num}.png`;
  append2('headerBlock', img);
}

//render icon
function renderSmallIcon(div, num) {
  var img = new Image();
  img.alt = 'Weather Icon';
  img.src = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${num}.png`;
  div.appendChild(img);
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
  img.id = 'mainBlockImg';
  img.alt = 'background image of main block';

  var rain = rainfall > 0;
  if (rain) {
    //raining
    img.src = day
      ? 'images/water-drops-glass-day.jpg'
      : 'images/water-drops-glass-night.jpg';
  } else {
    //not raining
    img.src = day ? 'images/blue-sky.jpg' : 'images/night-sky.jpg';
  }
  append2('headerBlock', img);
}

//toggle nightmode
function toggleNightMode() {
  var currentTime = new Date().getHours();
  var day = 7 <= currentTime && currentTime < 18;
  if (!day) {
    var x = document.getElementsByTagName('div');
    for (let index = 1; index < x.length; index++) {
      x[index].classList.toggle('nightMode');
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
    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en'
  ).then((response) => {
    return response.json();
  });

  const aqhiInfo = await fetch('data/aqhi-station-info.json').then(
    (response) => {
      return response.json();
    }
  );

  const weatherForecast = await fetch(
    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en'
  ).then((response) => {
    return response.json();
  });

  const weatherStation = await fetch(
    'https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json'
  ).then((response) => {
    return response.json();
  });
  const aqhi = await fetch(
    'https://dashboard.data.gov.hk/api/aqhi-individual?format=json'
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
    aqhiInfo,
  ]).then((value) => {
    var ret = {
      cw: value[0],
      wf: value[1],
      ws: value[2],
      aqhi: value[3],
      loc: value[4],
      aqhiInfo: value[5],
    };
    return ret;
  });
}
