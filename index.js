const form = document.getElementById('city-form');

const title_weather = document.getElementById('title-weather');
const detail_location = document.getElementById('detail-location');
const lar_weather_icon = document.getElementById('lar-weather-icon');
const main_temp = document.getElementById('main-temp');
const main_temp_min = document.getElementById('main-temp-min');
const main_temp_max = document.getElementById('main-temp-max');
const main_pressure = document.getElementById('main-pressure');
const main_humidity = document.getElementById('main-humidity');
const main_windspeed = document.getElementById('main-windspeed');
const main_winddir = document.getElementById('main-winddir');
const main_feelslike = document.getElementById('main-feelslike');
const main_cloud = document.getElementById('main-cloud');

const sub_content_wrap = document.getElementById('sub-content-wrap');


const timeBuilder = (timezone) => {

  const nowInLocalTime = Date.now() + 1000 * (timezone / 3600);
  const millitime = new Date(nowInLocalTime);
  const dateFormat = millitime.toLocaleString();

  let day = millitime.toLocaleString("in-IN", { weekday: "long" });
  let month = millitime.toLocaleString("in-IN", { month: "long" });
  let date = millitime.toLocaleString("in-IN", { day: "numeric" });
  let year = millitime.toLocaleString("in-IN", { year: "numeric" });
  let hours = millitime.toLocaleString("in-IN", { hour: "numeric" });
  let minutes = millitime.toLocaleString("in-IN", { minute: "numeric" });
  // jika menit nya kurang dari 2 digit menit maka ditambahi 0 didepannya
  if (minutes < 10) {
    minutes = 0 + minutes;
  }
  return `${hours}:${minutes}`;
}

const dateBuilder = (for_dateBuilder) => {

  get_date = new Date(for_dateBuilder);

  let month = get_date.toLocaleString("default", { month: 'long' });
  let date = get_date.toLocaleString("in-IN", { day: "numeric" });
  let year = get_date.toLocaleString("in-IN", { year: "numeric" });

  return `${date} ${month} ${year}`;
}

$(document).ready(function () {
  $(".suggestion-search-wrap").hide();
  var suggesti_wrap = $(".suggestion-search-wrap");
  var inputan = $("#city-input");

  window.onclick = function (event) {
    if (event.target != suggesti_wrap && event.target != inputan) {
      $(".suggestion-search-wrap").hide(200);
    }
  }


  // DEFAUlT HIDE
  $(".title-weather").hide();
  $(".detail-location").hide();
  $(".lar-weather-icon").hide();
  $(".sub-info-wrap").hide();
  $(".sub-content-wrap").hide();
  $("footer").hide();

  // $("#city-input").focus(function(){
  //   $(".suggestion-search-wrap").show(200);
  // });

  $("#city-input").on('input', function () {
    const apiKey = 'c0c083bc03d9f002ce678129d69335ba';
    const city = $("#city-input").val();
    var suggestion_wrap = document.querySelector(".suggestion-search-wrap");
    suggestion_wrap.innerHTML = `
    <div class="suggestion-search">
    <div class="dot-pack">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    `;

    if (city != '') {

      $.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`, function (data) {
        $(".suggestion-search-wrap").show(200);
        var suggestion_wrap = document.querySelector(".suggestion-search-wrap");
        suggestion_wrap.innerHTML = ``;
        console.log(data);
        if (data.length < 1) {
          suggestion_wrap.innerHTML = `<div class="suggestion-search">Not Found</div>`;
        }
        for (let ind = 0; ind < data.length; ind++) {
          const result_city = data[ind].name;
          var result_country = data[ind].country;
          var result_country_id = result_country;
          const convert_country = new Intl.DisplayNames(
            ['id'], { type: 'region' }
          );
          result_country = convert_country.of(result_country);
          suggestion_wrap.innerHTML += `
        <div onclick="search_for('${result_city}', '${result_country_id}')" class="suggestion-search">${result_city}, ${result_country}</div>
        `;
        }

      }, "json").fail(cityNotFound);

    }

  });
});


form.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = document.getElementById("city-input").value;
  const apiKey = 'c0c083bc03d9f002ce678129d69335ba';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      get_data_city(data);
      cityFound();
    })
    .catch(error => {
      cityNotFound();
    });
});

function search_for(mycity, mycountry) {
  console.log(mycity);
  const apiKey = 'c0c083bc03d9f002ce678129d69335ba';
  const get_country = mycountry.split('_').join(' ');
  $.get(`https://api.openweathermap.org/data/2.5/forecast?q=${mycity},${get_country}&appid=${apiKey}`, function (data) {
    console.log("SEARCH FOR: ", data);

    get_data_city(data);
    cityFound();
  }, "json");
}





// FISRT OPEN GET RANDOM CITY IN THE WORLD

$(document).ready(function () {
  const apiKey = 'c0c083bc03d9f002ce678129d69335ba';
  $.get('https://raw.githubusercontent.com/icyrockcom/country-capitals/master/data/country-list.json', function (data) {
    var rand_num = Math.floor(Math.random() * data.length);
    const rand_city = data[rand_num].capital;
    $.get(`https://api.openweathermap.org/data/2.5/forecast?q=${rand_city}&appid=${apiKey}`, function (data_city) {

      get_data_city(data_city);
      cityFound();
    }, "json").fail(cityNotFound);
  }, "json").fail(cityNotFound);
});

function cityNotFound() {
  $(".title-weather").show(200);
  $(".title-weather").text("404 Not Found");
  $(".detail-location").hide();
  $(".lar-weather-icon").hide();
  $(".sub-info-wrap").hide();
  $(".sub-content-wrap").show(200);
  $(".date-forecast").text("404 Not Found");
}

function cityFound(params) {
  $(".title-weather").hide();
  $(".detail-location").hide();
  $(".lar-weather-icon").hide();
  $(".sub-info-wrap").hide();
  $(".sub-content-wrap").hide();
  setTimeout(() => {
    $(".title-weather").show(200);
    $(".detail-location").show(200);
    $(".lar-weather-icon").show(200);
    $(".sub-info-wrap").show(200);
    $(".sub-content-wrap").show(200);
    $("footer").show(200);
  }, 250);
}








function get_data_city(data_city) {
  const convert_country = new Intl.DisplayNames(
    ['id'], { type: 'region' }
  );

  // AUTO UPDATE FORECAST LIST
  sub_content_wrap.innerHTML = '';

  const get_main_weather = data_city.list[0].weather[0].main;
  const get_city = data_city.city.name;
  const get_country_id = data_city.city.country;
  const get_country = convert_country.of(get_country_id);
  const get_main_time = timeBuilder(data_city.city.timezone);
  const get_icon = data_city.list[0].weather[0].icon;
  const get_weather_icon = `http://openweathermap.org/img/w/${get_icon}.png`;
  const temp = Math.round(data_city.list[0].main.temp - 273.15);
  const temp_min = Math.round(data_city.list[0].main.temp_min - 273.15);
  const temp_max = Math.round(data_city.list[0].main.temp_max - 273.15);
  const pressure = data_city.list[0].main.pressure;
  const humidity = data_city.list[0].main.humidity;
  const wind_speed = data_city.list[0].wind.speed;
  const wind_dir = data_city.list[0].wind.deg;

  // get direction compass
  var wind_direct = "";
  if (wind_dir == 360 || wind_dir == 0) {
    wind_direct = "N";
  } else if (wind_dir < 90) {
    wind_direct = "NE";
  } else if (wind_dir == 90) {
    wind_direct = "E";
  } else if (wind_dir < 180) {
    wind_direct = "SE";
  } else if (wind_dir == 180) {
    wind_direct = "S";
  } else if (wind_dir < 270) {
    wind_direct = "SW";
  } else if (wind_dir == 270) {
    wind_direct = "W";
  } else if (wind_dir < 360) {
    wind_direct = "NW";
  }

  const feelslike = Math.round(data_city.list[0].main.feels_like - 273.15);
  const cloud = data_city.list[0].clouds.all;

  title_weather.innerHTML = get_main_weather;
  detail_location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${get_city}, ${get_country}<br>${get_main_time}`;
  lar_weather_icon.src = get_weather_icon;
  main_temp.innerHTML = temp + "&deg;C";
  main_temp_min.innerHTML = temp_min + "&deg;C";
  main_temp_max.innerHTML = temp_max + "&deg;C";
  main_pressure.innerHTML = pressure + "hPa";
  main_humidity.innerHTML = humidity + "%";
  main_windspeed.innerHTML = wind_speed + "m/s";
  main_winddir.innerHTML = wind_dir + "&deg;" + wind_direct;
  main_feelslike.innerHTML = feelslike + "&deg;C";
  main_cloud.innerHTML = cloud + "%";

  for (let day = 0; day < data_city.list.length; day += 1) {

    console.log("SHOW ALL DAY", data_city.list[day]);

    var get_date_forecast = data_city.list[day].dt_txt;
    get_date_forecast = get_date_forecast.split(' ');
    get_date_forecast = dateBuilder(get_date_forecast[0]);

    var get_temp_min_forecast = data_city.list[day].main.temp_min;
    var get_temp_max_forecast = data_city.list[day].main.temp_max;

    get_temp_min_forecast = Math.round(get_temp_min_forecast - 273.15);
    get_temp_max_forecast = Math.round(get_temp_max_forecast - 273.15);

    if (get_temp_min_forecast < 0) {
      get_temp_min_forecast = `(${get_temp_min_forecast})`;
    }

    if (get_temp_max_forecast < 0) {
      get_temp_max_forecast = `(${get_temp_max_forecast})`;
    }

    if (day % 8 == 0) {

      console.log("DAY: ", day);
      console.log("SHOW EVERY 8 TIMES", data_city.list[day]);

      function get_weather(ke) {
        var get_weather_next_time = data_city.list[day + ke].weather[0].main;
        return get_weather_next_time;
      }

      function get_clouds(ke) {
        var get_clouds_next_time = data_city.list[day + ke].clouds.all;
        return get_clouds_next_time;
      }

      function get_tempmax(ke) {
        var get_tempmax_next_time = Math.round(data_city.list[day + ke].main.temp_max - 273.15);
        if (get_tempmax_next_time < 0) {
          return `(${get_tempmax_next_time})`;
        } else {
          return get_tempmax_next_time;
        }
      }

      function get_tempmin(ke) {
        var get_tempmin_next_time = Math.round(data_city.list[day + ke].main.temp_min - 273.15);
        if (get_tempmin_next_time < 0) {
          return `(${get_tempmin_next_time})`;
        } else {
          return get_tempmin_next_time;
        }
      }

      function take_time(ke) {
        var tk_tm = data_city.list[day + ke].dt_txt.split(' ');
        tk_tm = tk_tm[1];
        tk_tm = tk_tm.split(':');
        tk_tm = tk_tm[0] + ":" + tk_tm[1];
        return tk_tm;
      }
      sub_content_wrap.innerHTML += `
        <div class="sub-content glassMorph">
        <h5 class="date-forecast">${get_date_forecast}</h5>

        <div id="forecast-wrap" class="forecast-wrap">
          <h4 class="title-forecast">${data_city.list[day].weather[0].main}</h4>
          <img class="sm-weather-icon" src="http://openweathermap.org/img/w/${data_city.list[day].weather[0].icon}.png" alt="Weather Icon">
          <h3 class="degree-forecast">${get_temp_min_forecast}&deg;C - ${get_temp_max_forecast}&deg;C</h3>
          
          <table class="timelist-forecast-wrap">
            <tr>
              <td>${take_time(1)}</td>
              <td>-</td>
              <td>${get_weather(1)}</td>
            </tr>
            <tr>
              <td>${take_time(2)}</td>
              <td>-</td>
              <td>${get_weather(2)}</td>
            </tr>
          </table>

          <hr>
          <h5 class="timelist-title">Timelist</h5>

          <div class="time-hourly-forecast">
            <h4 class="title-forecast">${take_time(1)}</h4>
            <p class="subtitle-hourly-forecast">${get_weather(1)}<br>${get_tempmin(1)}&deg;C - ${get_tempmax(1)}&deg;C<br>${get_clouds(1)}% Cloudiness</p>
          </div>

          <div class="time-hourly-forecast">
            <h4 class="title-forecast">${take_time(2)}</h4>
            <p class="subtitle-hourly-forecast">${get_weather(2)}<br>${get_tempmin(2)}&deg;C - ${get_tempmax(2)}&deg;C<br>${get_clouds(2)}% Cloudiness</p>
          </div>

          <div class="time-hourly-forecast">
            <h4 class="title-forecast">${take_time(3)}</h4>
            <p class="subtitle-hourly-forecast">${get_weather(3)}<br>${get_tempmin(3)}&deg;C - ${get_tempmax(3)}&deg;C<br>${get_clouds(3)}% Cloudiness</p>
          </div>

          <div class="time-hourly-forecast">
            <h4 class="title-forecast">${take_time(4)}</h4>
            <p class="subtitle-hourly-forecast">${get_weather(4)}<br>${get_tempmin(4)}&deg;C - ${get_tempmax(4)}&deg;C<br>${get_clouds(4)}% Cloudiness</p>
          </div>
          

        </div>

      </div>
        `;


    }

  }

}
