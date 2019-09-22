<template>
  <v-app>
    <MySidebar></MySidebar>
    <TopBar></TopBar>

    <v-content class="mx-3">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <CurrentSettings :weatherSettings="weatherSettings"></CurrentSettings>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <Weather :weatherSettings="weatherSettings" :weather="weather"></Weather>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <MoistureSensors></MoistureSensors>
          </v-col>
          <v-col>
            <CurrentStatus></CurrentStatus>
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
      console.log(state.refresh)
    });
  }
};
</script>

<style>
</style>