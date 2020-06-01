// Weather Dashboard

// Hides weather info boxes until a city search is performed
$(".current-box").hide();
$(".forecast-banner").hide();
var forecastdisplay;

// Populates city buttons with city names in local storage
function allStorage() {
     $(".enterCity").val('');
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }
    for (j = 0; j < values.length; j++) {
        $(".prev-list").prepend("<button class='prev-city mt-1'>" + values[j] + "</button>");
    }   
}
allStorage();

// Gathers weather info and populates the weather boxes for previous cities
$(document).on("click", ".prev-city", function() {
     var subject = $(this).text();
    $(".enterCity").val(subject);
    $(".search").click();
    $(this).remove();
});

// Clears all previous cities from local storage and city buttons
$(".clear").on("click", function() {
    localStorage.clear();
    $(".prev-city").remove();
});

// Gathers weather info and populates the weather boxes for previous cities
$(".search").on("click", function() {
    var subject = $(".enterCity").val();
    var weatherNow = "https://api.openweathermap.org/data/2.5/weather?q=" + subject + "&APPID=d29f8828b393da220279ceb632cfc259";
    var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + subject + "&APPID=d29f8828b393da220279ceb632cfc259";
    var lat;
    var lon;
    $(".enterCity").val('');
    if (forecastdisplay === true) {
        $(".forecast-day").remove();
        forecastdisplay = false;
    }

// Current weather ajax request
    $.ajax({
        url: weatherNow,
        method: "GET",
    }).then(function(response){
        console.log(response);
        $(".prev-list").prepend("<button class='prev-city mt-1'>" + subject + "</button>");
        localStorage.setItem(subject, subject);
        $(".current-box").show();
        $(".forecast-banner").show();
        var iconcode = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
        $(".icon").attr('src', iconurl)
        lat = response.coord.lat;
        lon = response.coord.lon;
        $(".current-city").text(response.name + " " + moment().format('l'));
        var currentTemp = response.main.temp * (9/5) - 459.67;
        $(".current-temp").text("Temperature: " + currentTemp.toFixed(1) + " °F");
        $(".current-hum").text("Humidity: " + response.main.humidity + "%");
        $(".current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
        weatherNow = "https://api.openweathermap.org/data/2.5/uvi/forecast?&appid=3c34658c8e0e9fdb71064b81293a3704&lat=" + lat + "&lon=" + lon;
        
// UV Index ajax request
        $.ajax({
            url: weatherNow,
            method: "GET"
        }).then(function(response){
            $(".current-uv").text("UV Index: " + response[0].value);
        })
    })

// Five day forecast ajax request
    $.ajax({
        url: fiveDay,
        method: "GET"
    }).then(function(response){
        var forecastTimes = response.list;
        for (i = 0; i < forecastTimes.length; i++) {
            if (forecastTimes[i].dt_txt[12] === "2") {
                var forecastdate = forecastTimes[i].dt_txt;
                var forecastdatedisplay = forecastdate.charAt(5) + forecastdate.charAt(6) + "/" + forecastdate.charAt(8) + forecastdate.charAt(9) +
                "/" + forecastdate.charAt(0) + forecastdate.charAt(1) + forecastdate.charAt(2) + forecastdate.charAt(3);
                var forecasticon = forecastTimes[i].weather[0].icon;
                var forecasticonurl = "https://openweathermap.org/img/w/" + forecasticon + ".png";
                var forecastTemp = forecastTimes[i].main.temp * (9/5) - 459.67;
                var forecastHum = forecastTimes[i].main.humidity;
                if (forecastdisplay === false || forecastdisplay === undefined) {
                    $(".forecast-list").append("<div class='my-3 pb-3 col-md-2 col-lg-2 forecast-day'>" +
                    "<h5>" + forecastdatedisplay + "<h5>" +
                    "<img class='ficon' src=" + forecasticonurl + " alt='Weather icon'>" + 
                    "<div>Temp: " + forecastTemp.toFixed(1) + " °F" + 
                    "</div><div>Humidity: " + forecastHum + 
                    "%</div></div></div>");
                } 
            }
        }
        forecastdisplay = true;
    });
  });
  