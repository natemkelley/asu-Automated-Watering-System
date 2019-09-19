<template>
  <v-card>
    <v-tabs
      v-model="tab"
      class="elevation-2"
      background-color="deep-purple accent-4"
      dark
      :vertical="true"
      :grow="true"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(tab,i) in tabs" :key="i" :href="`#tab-${i}`">{{ tab }}</v-tab>
      <v-tab-item v-for="(tab,i) in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile height="245px">
          <DraggableWeatherChart
            v-if="tab === 'Temperature'"
            :color="color"
            :tab="tab"
            :chartData="chartTempData"
            type="Line"
            maxSlider="115"
            minSlider="32"
            :settings="weatherSettings.temperature"
            label="Temperature"
          ></DraggableWeatherChart>
          <DraggableWeatherChart
            v-else-if="tab === 'Rain'"
            :color="color"
            :tab="tab"
            :chartData="chartRainData"
            type="Bar"
            maxSlider="100"
            minSlider="0"
            :settings="weatherSettings.Clouds"
            label="% of Rain"
          ></DraggableWeatherChart>
          <DraggableWeatherChart
            v-else-if="tab === 'Humidity'"
            :color="color"
            :tab="tab"
            :chartData="chartHumidityData"
            type="Bar"
            maxSlider="100"
            minSlider="0"
            :settings="weatherSettings.humidity"
            label="% Humidity"
          ></DraggableWeatherChart>
          <TimesWithSwitch
            v-else-if="tab === 'Sun'"
            :color="color"
            :tab="tab"
            :chartData="chartTime"
          ></TimesWithSwitch>
          <!--<DraggableWeatherChart
            v-else-if="tab === 'Clouds'"
            :color="color"
            :tab="tab"
            :chartData="chartData"
          ></DraggableWeatherChart>-->
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import DraggableWeatherChart from "@/components/weather/DraggableWeatherChart";
import colors from "vuetify/es5/util/colors";
import axios from "axios";
import moment from "moment";
import TimesWithSwitch from "@/components/weather/TimesWithSwitch";

export default {
  name: "Weather",
  components: { DraggableWeatherChart, TimesWithSwitch },
  data() {
    return {
      tab: null,
      tabs: ["Temperature", "Rain", "Humidity", "Sun"],
      chartTempData: {},
      chartData: {},
      chartHumidityData: {},
      chartRainData: {},
      chartTime: {},
      weatherSettings: {}
    };
  },
  methods: {
    createLabels(data) {
      return data.map(element => moment(element.date).format("l"));
    },
    createHighs(data) {
      return data.map(element => element.maxTemp);
    },
    createLows(data) {
      return data.map(element => element.minTemp);
    },
    createHumidity(data) {
      return data.map(element => element.humidity);
    },
    createRain(data) {
      return data.map(element => element.clouds.all);
    },
    createTime(data) {
      return data.map(function(element) {
        return {
          sunrise: element.sunrise,
          sunset: element.sunset,
          date: element.date
        };
      });
    },
    getWeatherSettings() {
      axios
        .get("/api/weather-settings?query=")
        .then(response => {
          console.log(response.data.results);
          this.weatherSettings = response.data.results;
        })
        .catch(error => {});
    },
    getWeather() {
      axios.get(`http://localhost:3000/api/weather`).then(res => {
        console.log(res.data);
        this.chartTempData = {
          labels: this.createLabels(res.data),
          datasets: [
            {
              label: "Highs",
              backgroundColor: colors.red.accent4 + "1d",
              borderColor: colors.red.accent4,
              data: this.createHighs(res.data),
              fill: true
            },
            {
              label: "Lows",
              backgroundColor: colors.blue.accent4 + "1d",
              borderColor: colors.blue.accent4,
              data: this.createLows(res.data),
              fill: true
            }
          ]
        };
        this.chartHumidityData = {
          labels: this.createLabels(res.data),
          datasets: [
            {
              label: "Humidity",
              backgroundColor: colors.green.accent4 + "1d",
              borderColor: colors.green.accent4,
              data: this.createHumidity(res.data),
              fill: true
            }
          ]
        };
        this.chartRainData = {
          labels: this.createLabels(res.data),
          datasets: [
            {
              label: "Rain",
              backgroundColor: colors.pink.accent4 + "1d",
              borderColor: colors.pink.accent4,
              data: this.createRain(res.data),
              fill: true
            }
          ]
        };

        this.chartTime = this.createTime(res.data);
      });
    }
  },
  mounted() {
    this.getWeather();
    this.getWeatherSettings();
  },
  computed: {
    color() {
      return colors.deepPurple.accent4;
    }
  }
};
</script>
