var cityFormEl=document.querySelector('#city-form');
var nameInputEl = document.querySelector("#cityName");
var currentCondEl = document.querySelector("#current-conditions");
var forecastEl= document.querySelector("#fiveday");

var formSubmitHandler = function(event) {
    //prevent page from refresshing
    event.preventDefault();

    //get value from input element
    var cityName = nameInputEl.value.trim();

    if (cityName) {
        getCityCoordinates(cityName)
    
        //clear old content
        currentCondEl.textContent='';
        nameInputEl.value='';
    } else {
        alert('Please enter a city name');
    }
};

//lat and lon for city searched
var getCityCoordinates = function(city) {
    var apiUrl= 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=d8a50e839877cad08e505ca47a0dd3aa'
    fetch (apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                getCityConditions (data[0].lat, data[0].lon, city)
            })
        }
    })
}

//passing lat and lon of searched city to get the conditions
var getCityConditions = function (latitute, longitude, city) {
    //format the weather api url
    var apiUrl= 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitute + '&lon=' + longitude + '&appid=d8a50e839877cad08e505ca47a0dd3aa&exlude=hourly,daily,alerts&units=imperial';

    //make a request to url
    fetch (apiUrl)
    .then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayConditions(data.current, data.daily, city);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to Open Weather');
    });
};

var displayConditions = function(current, forecast, city) {
    
    console.log(current, forecast)
//format for UV conditions
    let currentUviColor = 'green';

    if (current.uvi > 2) {
        currentUviColor = 'yellow';
    }

    if (current.uvi > 5) {
        currentUviColor = 'red';
    }

    forecastEl.innerHTML=""
    //loop over forecast
    for (var i=0; i < 5; i++) {
        const day = forecast[i];
        const dayEl=document.createElement('div')
        var date=moment.unix(day.dt).format("MM/D/YYYY")
        var forecastIcon= "http://openweathermap.org/img/wn/" + forecast[i].weather[0].icon +"@2x.png"

        dayEl.innerHTML = `
        <div class="">
            <div> ${date}</div>
            <img src="${forecastIcon}"/>
            <div>Temp: ${forecast[i].temp.day}°F</div>
            <div>Wind:${forecast[i].wind_speed}MPH </div>
            <div>Humidity: ${forecast[i].humidity}
        </div>
        `

        forecastEl.appendChild(dayEl);
    }


//format for the current day 
var currentDay= moment.unix(current.dt).format("MM/D/YYYY")
var currentDayIcon= "http://openweathermap.org/img/wn/"+ current.weather[0].icon  +"@2x.png"




    currentCondEl.innerHTML=`
    <div class="">
        <div> ${city} ${currentDay}</div>
        <img src="${currentDayIcon}" />
        <div>Temperature: ${current.temp}°F </div>
        <div>Wind: ${current.wind_speed} MPH </div>
        <div>Humidity: ${current.humidity}%</div>
        <div style="background-color: ${currentUviColor}">UV Index: ${current.uvi}</div>
        
    </div>
    `
}

//add event listeners to forms
cityFormEl.addEventListener('submit', formSubmitHandler);

