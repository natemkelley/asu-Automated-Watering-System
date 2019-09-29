<template>
  <v-app>
    <MySidebar></MySidebar>
    <TopBar :color="color"></TopBar>

    <v-content class="mx-3">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <CurrentSettings :color="color" :weatherSettings="weatherSettings"></CurrentSettings>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <Weather :color="color" :weatherSettings="weatherSettings" :weather="weather"></Weather>
          </v-col>
        </v-row>
        <v-row align="stretch" justify="start">
          <v-col cols="5">
            <MoistureSensors :weatherSettings="weatherSettings"></MoistureSensors>
          </v-col>
          <v-col cols="7">
            <CurrentStatus :color="color" :weatherSettings="weatherSettings"></CurrentStatus>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <RecentUpdates></RecentUpdates>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <MyFooter></MyFooter>
  </v-app>
</template>

<script>
import axios from "axios";
import MyFooter from "@/components/Footer";
import MySidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import CurrentSettings from "@/components/CurrentSettings";
import MoistureSensors from "@/components/MoistureSensors";
import CurrentStatus from "@/components/CurrentStatus";
import Weather from "@/components/Weather";
import RecentUpdates from "@/components/RecentUpdates";
import colors from "vuetify/es5/util/colors";

export default {
  components: {
    MyFooter,
    MySidebar,
    TopBar,
    CurrentSettings,
    MoistureSensors,
    CurrentStatus,
    Weather,
    RecentUpdates
  },
    computed: {
    color() {
      return colors.blue.darken2;
    }
  },
  data() {
    return {
      weatherSettings: {},
      weather: {}
    };
  },
  mounted() {
    //console.log(this.$store.state);
  },
  methods: {
    getSettings() {
      axios
        .get("/api/weather-settings?query=")
        .then(response => {
          this.weatherSettings = response.data;
          //console.log(this.weatherSettings)
        })
        .catch(error => {});
    },
    getWeather() {
      axios.get(`http://localhost:3000/api/weather`).then(res => {
        this.weather = res.data;
      });
    }
  },
  created() {
    this.getSettings();
    this.getWeather();
    this.$store.subscribe((mutation, state) => {
      this.getSettings();
    });
  }
};
</script>

<style>
</style>