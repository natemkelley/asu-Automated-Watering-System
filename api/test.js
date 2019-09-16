const axios = require("axios");
const moment = require("moment");
const _ = require("underscore");
const fs = require("fs");

async function test() {
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

  return mapped;
}

test();
