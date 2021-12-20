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
        var storedHistory=window.localStorage.getItem("history")
            var history=[]
            if (storedHistory !==null){
                history=JSON.parse(storedHistory)
            }
            history.push(cityName)
            window.localStorage.setItem("history", JSON.stringify(history))

            loadHistory();
    
        //clear old content
        currentCondEl.textContent='';
        nameInputEl.value='';
    } else {
        alert('Please enter a city name');
    }
};

//lat and lon for city searched
var getCityCoordinates = function(city) {
    var apiUrl= 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=6fe64c1e1151c44b37d2c3c0125e9f74'
    fetch (apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                getCityConditions (data[0].lat, data[0].lon, city)
            })
        
        }
    })
}

var loadHistory=function(){
    var historyEl=document.getElementById("history")
    historyEl.innerHTML=""
    var storedHistory=window.localStorage.getItem("history")
    var history=[]
    if (storedHistory !==null){
        history=JSON.parse(storedHistory)
    }
    console.log(history)
    for (var item of history)  {
        const historyButtonEl=document.createElement("button")
        historyButtonEl.classList.add("btn")
        historyButtonEl.classList.add("btn-block")
        historyButtonEl.classList.add("btn-secondary")
        historyButtonEl.innerText=item
        historyButtonEl.setAttribute ("onclick", "getCityCoordinates('" + item + "')")

        historyEl.appendChild(historyButtonEl)
    }

}

//passing lat and lon of searched city to get the conditions
var getCityConditions = function (latitute, longitude, city) {
    //format the weather api url
    var apiUrl= 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitute + '&lon=' + longitude + '&appid=6fe64c1e1151c44b37d2c3c0125e9f74&exlude=hourly,daily,alerts&units=imperial';

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
    let uviColorClass= 'badge-success';

    if (current.uvi > 2) {
        uviColorClass = 'badge-warning';
    }

    if (current.uvi > 5) {
        uviColorClass = 'badge-danger';
    }

    forecastEl.innerHTML=""
    //loop over forecast
    for (var i=0; i < 5; i++) {
        const day = forecast[i];
        const dayEl=document.createElement('div')
        var date=moment.unix(day.dt).format("MM/D/YYYY")
        var forecastIcon= "https://openweathermap.org/img/wn/" + forecast[i].weather[0].icon +"@2x.png"
        dayEl.classList.add("card")
        dayEl.classList.add("bg-dark")
        dayEl.classList.add("text-white")
        dayEl.classList.add("weather-card")
        dayEl.innerHTML = `
    
        <div> ${date}</div>
        <img src="${forecastIcon}"/>
        <div>Temp: ${forecast[i].temp.day}°F</div>
        <div>Wind:${forecast[i].wind_speed}MPH </div>
        <div>Humidity: ${forecast[i].humidity}</div>
        `

        forecastEl.appendChild(dayEl);
    }


//format for the current day 
var currentDay= moment.unix(current.dt).format("MM/D/YYYY")
var currentDayIcon= "https://openweathermap.org/img/wn/"+ current.weather[0].icon  +"@2x.png"




    currentCondEl.innerHTML=`
    <div class="">
        <div> ${city} ${currentDay}</div>
        <img src="${currentDayIcon}" />
        <div>Temperature: ${current.temp}°F </div>
        <div>Wind: ${current.wind_speed} MPH </div>
        <div>Humidity: ${current.humidity}%</div>
        <div>UV Index: <span class="badge ${uviColorClass}"> ${current.uvi}</span></div>
        
    </div>
    `
}

//add event listeners to forms
cityFormEl.addEventListener('submit', formSubmitHandler);

loadHistory();