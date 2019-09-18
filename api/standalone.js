const express = require("express");
const app = express();
const axios = require("axios");
const localStorage = require("../server/localStorage.js");
const moment = require('moment')
var port = process.env.PORT || 8080;

app.get("/", (req, res, next) => {
  res.json({ status: true });
});

app.get("/current-weather", async (req, res, next) => {
  const access = "31d95b55c973a21c020ae5235b73d16e";
  var weather = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=Phoenix&appid=${access}&units=imperial`
  );
  localStorage.saveLocalStorage("current-weather", weather.data);
  res.json(weather.data);
});

app.get("/weather", async (req, res, next) => {
  const _ = require("underscore");
  const access = "31d95b55c973a21c020ae5235b73d16e";
  
  var weather = await axios.get(
    `http://api.openweathermap.org/data/2.5/forecast?q=Phoenix&appid=${access}&units=imperial&mode=json`
  );

  var groups = _.groupBy(weather.data.list, function(date) {
    return moment.unix(date.dt).format("LL");
  });
  var result = _.map(groups, function(group, day) {
    return {
      day: day,
      times: group
    };
  });

  var mapped = _.map(result, function(item, key) {
    let min = _.min(item.times, function(time) {
      return time.main.temp_max;
    });
    let max = _.max(result[key].times, function(time) {
      return time.main.temp_max;
    });
    return { 
        maxTemp: max.main.temp_max, 
        minTemp: min.main.temp_min, 
        date: moment.unix(max.dt).format("LL"),
        humidity: max.main.humidity,
        desc: max.weather.description,
        wind: max.wind,
        clouds: max.clouds
    };
  });

  res.json(mapped);
});

app.post("/weather-settings", async (req, res, next) => {
  console.log('----',req.query.query);
  localStorage.saveLocalStorage(req.query.query, req.query.value);
  res.json({status:true, results: localStorage.getLocalStorage(req.query.query)});
});

app.get("/weather-settings", async (req, res, next) => {
  let results = localStorage.getLocalStorage(req.query.query);
  res.json({status:true, results: results});
});

app.get("/random-movie", async (req, res, next) => {
  const movieOptions = ["tt3896198", "tt0071253", "tt0000111"];
  var movieID = "tt" + Math.round(Math.random() * 9999999);
  var movie = await axios.get(
    `https://www.omdbapi.com/?i=${movieID}&apikey=9733f1df`
  );
  if (movie.data.Error) {
    movieID = movieOptions[Math.floor(Math.random() * movieOptions.length)];
    movie = await axios.get(
      `https://www.omdbapi.com/?i=${movieID}&apikey=9733f1df`
    );
  }
  res.json(movie.data);
});

// export the server middleware
module.exports = {
  path: "/api",
  handler: app
};

app.listen(port);
console.log('Server started! At http://localhost:' + port);
