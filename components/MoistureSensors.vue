<template>
  <v-card class="moisture">
    <v-card-title>Moisture Sensors</v-card-title>
    <v-data-table
      @click:row="checkSettings"
      :items="sensors"
      :headers="headers"
      hide-default-footer
      class="elevation-0"
      :loading="loading"
    ></v-data-table>
    <v-card-actions>
      <v-alert
        v-if="disabled"
        color="grey"
        dark
        dense
        icon="mdi-wrench"
        width="100%"
        class="mx-1"
      >Moisture sensors have been disabled.</v-alert>
      <v-row v-if="!disabled && !loading" class="mx-1">
        <v-col cols="12" class="pa-0">
          <v-select
            @change="saveValue"
            persistent-hint
            full-width
            label="Select"
            v-model="defaultSelected"
            :items="arrayOfSensors"
            hint="Number of sensors that must be moist"
            outlined
          ></v-select>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "MoistureSensors",
  props: ["weatherSettings"],
  data() {
    return {
      headers: [
        {
          text: "Sensor",
          value: "sensor"
        },
        { text: "Currently Moist", value: "moist" },
        { text: "Last Check", value: "timestamp" }
      ],
      loading: true,
      rawSensorData: [],
      defaultSelected: null
    };
  },
  mounted() {
    this.getSettings();
  },
  methods: {
    checkSettings(val) {
      console.log(this.weatherSettings);
    },
    getSettings() {
      this.loading = true;
      return new Promise(resolve => {
        axios
          .get("/api/moisture-status")
          .then(response => {
            this.rawSensorData = JSON.parse(response.data.value);
            this.loading = false;
            this.defaultSelected = this.getActiveMoistureSensors();
          })
          .catch(error => {
            console.error(error);
          });
      });
    },
    saveValue(number) {
      console.log("saving", number);
      var value = JSON.stringify(this.changeValueOfMoistureSensors(number));
      return new Promise(resolve => {
        axios
          .post("/api/moisture-status", `&value=${value}`)
          .then(response => {
            console.log(response.data);
            this.getSettings();
          })
          .catch(error => {
            console.error(error);
          });
      });
    },
    changeValueOfMoistureSensors(number) {
      var saveArr = [];
      this.rawSensorData.forEach((el, n) => {
        if (n < number) {
          el.mustBeTrue = true;
        } else {
          el.mustBeTrue = false;
        }
        saveArr.push(el);
      });
      return saveArr;
    },
    getActiveMoistureSensors() {
      var count = 0;
      this.rawSensorData.forEach((el, n) => {
        if (el.mustBeTrue == true) {
          count++;
        }
      });
      return count;
    }
  },
  computed: {
    sensors() {
      if (!this.rawSensorData) {
        return [];
      }

      var arr = [];
      this.rawSensorData.forEach(element => {
        element.timestamp = moment(new Date(element.timestamp)).format("lll");
        arr.push(element);
      });

      return arr;
    },
    disabled() {
      if (this.weatherSettings.moistureSensors == undefined) {
        return false;
      }

      if (this.weatherSettings.moistureSensors.active == "disabled") {
        return true;
      }
      return false;
    },
    arrayOfSensors() {
      var bar = [];
      this.rawSensorData.forEach((el, n) => {
        bar.push(n + 1);
      });

      console.log(bar);
      return bar;
    }
  }
};
</script>

<style >
.moisture .v-data-table__wrapper {
  text-transform: capitalize;
}
</style>
