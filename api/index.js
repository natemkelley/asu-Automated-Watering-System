const express = require("express");
const app = express();
const axios = require("axios");
const moment = require("moment");
const bodyParser = require("body-parser");
import { getSunrise, getSunset } from "sunrise-sunset-js";
import colors from "vuetify/es5/util/colors";

//these are custom files used to write to a stratch space and talk to the raspberry pi
const localStorage = require("../server/localStorage.js");
const raspberryPi = require("./raspberryPi.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.json({ status: true });
});

app.get("/force-system-run", async (req, res, next) => {
  console.log("forcing system run");
  raspberryPi.forceSystemRun();
  res.json({ status: true });
});

app.get("/system-check", async (req, res, next) => {
  console.log("system check api");
  await raspberryPi.systemCheck('check');
  res.json({ status: true }); //this will trigger a refresh on the front end
});

app.get("/logs", async (req, res, next) => {
  var updates = localStorage.getLocalStorage('recentUpdates');
  res.json(updates);
});

app.get("/current-weather", async (req, res, next) => {
  const access = "31d95b55c973a21c020ae5235b73d16e";
  var weather = await axios.get(
    `http://api.openweathermap.org/data/2.5/weather?q=Phoenix&appid=${access}&units=imperial`
  );
  var futureweather = await axios.get(
    `http://api.openweathermap.org/data/2.5/forecast?q=Phoenix&appid=${access}&units=imperial&mode=json`
  );
  weather.data.futureweather = futureweather.data;
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
      clouds: max.clouds,
      sunrise: moment(
        getSunrise(
          33.4484,
          -112.074,
          new Date(moment.unix(max.dt).format("LL"))
        )
      ).format("LLLL"),
      sunset: moment(
        getSunset(33.4484, -112.074, new Date(moment.unix(max.dt).format("LL")))
      ).format("LLLL")
    };
  });

  res.json(mapped);
});

app.post("/weather-settings", async (req, res, next) => {
  let value = localStorage.saveLocalStorage(
    req.body.query,
    req.body.value,
    req.body.active
  );
  if (value.error === false) {
    res.json(value);
  } else {
    res.json({
      status: true,
      results: localStorage.getLocalStorage(req.query.query)
    });
  }
});

app.get("/weather-settings", async (req, res, next) => {
  res.json(localStorage.getLocalStorage(req.query.query));
});

app.get("/moisture-status", async (req, res, next) => {
  res.json(localStorage.getLocalStorage("moistureSensors"));
});

app.post("/moisture-status", async (req, res, next) => {
  localStorage.saveLocalStorage("moistureSensors", req.body.value);
  res.json(localStorage.getLocalStorage("moistureSensors"));
});

app.get("/recent-updates", async (req, res, next) => {
  res.json({ stauts: true });
});

// export the server middleware
module.exports = {
  path: "/api",
  handler: app
};
