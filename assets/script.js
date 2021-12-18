var cityFormEl=document.querySelector('#city-form');
var nameInputEl = document.querySelector("#cityName");
var currentCondEl = document.querySelector("#current-conditions");

var formSubmitHandler = function(event) {
    //prevent page from refresshing
    event.preventDefault();

    //get value from input element
    var cityName = nameInputEl.value.trim();

    if (cityName) {
        getCityCond(cityName);

        //clear old content
        currentCondEl.textContent='';
        nameInputEl.value='';
    } else {
        alert('Please enter a city name');
    }
};

var getCityCond = function (city) {
    //format the weather api url
    var apiUrl= 'api.openweathermap.org/data/2.5/weather?q=' + cityName +'&appid=d8a50e839877cad08e505ca47a0dd3aa';

    //make a request to url
    fetch (apiUrl)
    .then(function(response) {
        //request was successful
        if (response.ok) {
            console.log (reponse);
            response.json().then(function(data) {
                console.log(data);
                displayConditions(data, city);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to Open Weather');
    });
};

var displayConditions = function(conditions, searchTerm) {
    //check if api returned any conditions
    if (conditions ===0) {
        currentCondEl.textContent = "No conditions found.";
        return;
    }
    conditionSearchTerm.textContent = searchTerm;

}

//add event listeners to forms
cityFormEl.addEventListener('submit', formSubmitHandler);

