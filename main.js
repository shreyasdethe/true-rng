var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// XMLHttpRequest function - promisified
requestWeatherData = function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function () {
            if (this.status == 200 & this.readyState == 4) {
                // retrieve weather data and store it in an object
                let weather = JSON.parse(this.responseText);
                resolve(weather);
            }
            else {
                reject(Error(this.statusText));
            }
        }

        xhr.onerror = function () {
            reject(Error(this.statusText));
        }

        xhr.send();
    });
}

// city ids to choose from
var ids = [88834, 699753, 735338, 788730, 912764, 1149975, 1269653, 1276328, 1636340, 1787129, 1793199, 1800348, 1814217, 1855973, 1914146, 2121126, 2143304, 2163398, 2176359, 2178971, 2440921, 2471915, 2473499, 2515672, 2654107, 2661305, 2764035, 2807051, 2827282, 2832598, 2850980, 2861646, 2878741, 2882879, 2892029, 2898704, 2904743, 2932748, 2936974, 2938662, 2946469, 2947958, 2948290, 2953526, 2963356, 2981912, 2983143, 3037113, 3061695, 3075493, 3082870, 3105757, 3106726, 3112784, 3117664, 3164577, 3173116, 3309508, 3458729, 3465083, 3465700, 3542965, 3975872, 3984680, 4349611, 4375229, 4409199, 4601167, 4643005, 4716826, 4998705, 5107257, 5111073, 6076966, 6358376, 6446325, 6453509, 6454846, 6459184, 6549699, 6549785, 6552730, 6555069, 7286307, 7645541, 7745074, 7766023, 7872905];

// set what happens when GET request
var app = express();
app.get('/', function (req, res) {

    // generate random city for url
    let url = "http://api.openweathermap.org/data/2.5/weather?id="
    url += ids[Math.floor(ids.length * Math.random())];
    url += "&appid=ebfc377193e3f70c830c4d82432bf9bf";

    // request weather data from that city
    requestWeatherData(url)
        .then(function (weather) {

            // if Promise resolved
            let w = weather;

            // Random generator ahead
            let params = [w.main.temp, w.main.feels_like, w.main.temp_min, w.main.temp_max, w.main.pressure, w.main.humidity, w.wind.speed, w.wind.deg];

            let n = params[Math.floor(Math.random() * params.length)];

            n *= Math.random();
            n = n - (Math.floor(n));
            n *= Math.random();

            let out = {"n" : n};

            res.end(JSON.stringify(out));

            // if Promise rejected
        }, function (error) {
            console.error("Failed: ", error);
        })

        // if network errors
        .catch(function (error) {
            console.error("Failed: ", error);
        });
});


// setup the server and start listening
var port = process.env.PORT || 8081;
var server = app.listen(port);