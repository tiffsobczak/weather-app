var cityFormEl=document.querySelector('#city-form');
var nameInputEl = document.querySelector("#cityName");
var currentCondEl = document.querySelector("#current-conditions");

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
var getCityCoordinates = function(city) {
    var apiUrl= 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=d8a50e839877cad08e505ca47a0dd3aa'
    fetch (apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                getCityConditions (data[0].lat, data[0].lon)
            })
        }
    })
}

var getCityConditions = function (latitute, longitude) {
    //format the weather api url
    var apiUrl= 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitute + '&lon=' + longitude + '&appid=d8a50e839877cad08e505ca47a0dd3aa&exlude=hourly,daily,alerts&units=imperial';

    //make a request to url
    fetch (apiUrl)
    .then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayConditions(data.current, data.daily);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to Open Weather');
    });
};

var displayConditions = function(current, forecast) {
    
    console.log(current, forecast)

    let currentUviColor = 'green';

    if (current.uvi > 2) {
        currentUviColor = 'yellow';
    }

    if (current.uvi > 5) {
        currentUviColor = 'red';
    }

    currentCondEl.innerHTML=`
    <div class="">
        <div>Temperature: ${current.temp}</div>
        <div>Wind: ${current.wind_speed}</div>
        <div>Humidity: ${current.humidity}</div>
        <div style="background-color: ${currentUviColor}">UV Index: ${current.uvi}</div>
        
    </div>
    `
    

}

//add event listeners to forms
cityFormEl.addEventListener('submit', formSubmitHandler);

