<template>
  <v-card>
    <v-tabs
      v-model="tab"
      class="elevation-2"
      :background-color="color"
      dark
      :vertical="true"
      :grow="true"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab
        v-for="(tab,i) in tabs"
        :key="i"
        :href="`#tab-${i}`"
        v-bind:class="{ strikethrough: !checkIfActive(tab) }"
      >
        <div>{{ tab }}</div>
      </v-tab>
      <v-tab-item v-for="(tab,i) in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile height="245px" :disabled="!checkIfActive(tab)">
          <DraggableWeatherChart
            v-if="tab === 'Temperature'"
            :color="color"
            :tab="tab"
            :chartData="chartTempData"
            type="Line"
            maxSlider="110"
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
            :settings="weatherSettings.rain"
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
  props: ["weatherSettings", "weather"],
  components: { DraggableWeatherChart, TimesWithSwitch },
  data() {
    return {
      tab: null,
      tabs: ["Temperature", "Rain", "Humidity", "Sun"],
      chartTempData: {},
      chartData: {},
      chartHumidityData: {},
      chartRainData: {},
      chartTime: {}
    };
  },
  methods: {
    createLabels(data) {
      return data.map(element => moment(new Date(element.date)).format("l"));
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
    setWeatherCharts(data) {
      console.log(data)
      this.chartTempData = {
        labels: this.createLabels(data),
        datasets: [
          {
            label: "Highs",
            backgroundColor: colors.red.accent2 + "1d",
            borderColor: colors.red.accent2,
            data: this.createHighs(data),
            fill: true
          },
          {
            label: "Lows",
            backgroundColor: colors.blue.accent1 + "1d",
            borderColor: colors.blue.accent1,
            data: this.createLows(data),
            fill: true
          }
        ]
      };
      this.chartHumidityData = {
        labels: this.createLabels(data),
        datasets: [
          {
            label: "Humidity",
            backgroundColor: colors.green.accent4 + "33",
            borderColor: colors.green.accent4,
            data: this.createHumidity(data),
            fill: true
          }
        ]
      };
      this.chartRainData = {
        labels: this.createLabels(data),
        datasets: [
          {
            label: "Rain",
            backgroundColor: colors.yellow.accent4 + "58",
            borderColor: colors.yellow.accent4,
            data: this.createRain(data),
            fill: true
          }
        ]
      };
      this.chartTime = this.createTime(data);
    },
    checkIfActive(objectName) {
      objectName = objectName.toLowerCase();
      if (this.weatherSettings.hasOwnProperty(objectName)) {
        return objectName, this.weatherSettings[objectName].active;
      } else {
        return true; //default to true I guess?
      }
    }
  },
  computed: {
    color() {
      return colors.green.darken1;
    }
  },
  watch: {
    weather(newData, oldData) {
      this.setWeatherCharts(newData);
    }
  }
};
</script>

<style scoped>
.strikethrough {
  text-decoration: line-through !important;
}
</style>
