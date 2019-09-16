const express = require("express");
const app = express();
const axios = require("axios");
const localStorage = require("../server/localStorage.js");

app.get("/", (req, res, next) => {
  res.json({ status: true });
});

app.get("/weather", async (req, res, next) => {
  const access = "31d95b55c973a21c020ae5235b73d16e";
  var weather = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=Phoenix&appid=${access}&units=imperial`
  );
  localStorage.saveLocalStorage("weatherAge", new Date());
  localStorage.saveLocalStorage("weather", weather.data);
  res.json(weather.data);
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
