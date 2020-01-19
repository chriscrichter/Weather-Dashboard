// Weather Dashboard

//Hides elements that will show once the first search goes through.
$(".current-box").hide();
$(".forecast-banner").hide();
var forecastdisplay;

//Pulls previous city searches from local storage.
function allStorage() {
	$(".enterCity").val('');
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while ( i-- ) {
        values.push(localStorage.getItem(keys[i]));
    }
    for (j = 0; j < values.length; j++) {
        $(".prev-list").prepend("<button class='prev-city mt-1'>" + values[j] + "</button>");
    }   
}
allStorage();

//This will search the weather stats for the previous city when said city is clicked on.
$(document).on("click", ".prev-city", function() {
	var subject = $(this).text();
    $(".enterCity").val(subject);
    $(".search").click();
    $(this).remove();
});

//Clears all local storage items and previous searches from the page.
$(".clear").on("click", function() {
    localStorage.clear();
    $(".prev-city").remove();
});

//This function collects all the info from the weather APIs to display on the page
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

//This first ajax request collects current weather data and converts info into what we want to display.
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
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $(".icon").attr('src', iconurl)
        lat = response.coord.lat;
        lon = response.coord.lon;
        $(".current-city").text(response.name + " " + moment().format('l'));
        var currentTemp = response.main.temp * (9/5) - 459.67;
        $(".current-temp").text("Temperature: " + currentTemp.toFixed(1) + " °F");
        $(".current-hum").text("Humidity: " + response.main.humidity + "%");
        $(".current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
        weatherNow = "http://api.openweathermap.org/data/2.5/uvi/forecast?&appid=3c34658c8e0e9fdb71064b81293a3704&lat=" + lat + "&lon=" + lon;
        
//This is nested ajax request that gets the UV index but uses longitude and latitude from the previous ajax request to do so.
        $.ajax({
            url: weatherNow,
            method: "GET"
        }).then(function(response){
            $(".current-uv").text("UV Index: " + response[0].value);
        })
    })

//This ajax request collects weather data for the next 5 days (specifically it is grabbing the stays from noon, as opposed to every few hours)
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
                var forecasticonurl = "http://openweathermap.org/img/w/" + forecasticon + ".png";
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