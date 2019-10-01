<template>
  <v-card>
    <v-card-title>Recent Updates</v-card-title>
    <v-data-table class="px-2" :loading="!renderTable" :headers="headers" :items="logsParsed">
      <template v-slot:item.systemRan="{ item }">
        <v-chip :color="getColor(item.systemRan)" dark>{{ item.systemRan }}</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>
    <v-data-table :headers="headers" :items="headers" :items-per-page="10" class="elevation-1"></v-data-table>

<script>
import moment from "moment";
export default {
  name: "RecentUpdates",
  props: ["logs"],
  data() {
    return {
      loading: false,
      headers: [
        {
          text: "Timestamp",
          align: "left",
          sortable: true,
          value: "timestamp"
        },
        { text: "System Ran", value: "systemRan" },
        { text: "Temp", value: "temperature.value" },
        { text: "Temp Thresh", value: "temperature.threshhold" },
        { text: "Humidity", value: "humidity.value" },
        { text: "Humidity Thresh", value: "humidity.threshhold" },
        { text: "Rain", value: "rain.value" },
        { text: "Rain Thresh", value: "rain.threshhold" },
        { text: "Sensor 1", value: "sensors[0].value" },
        { text: "Sensor 2", value: "sensors[1].value" },
        { text: "Sensor 3", value: "sensors[2].value" },
        { text: "Sensors Activated", value: "sensorsThreshold.value" },
        { text: "Sensor Threshold", value: "sensorsThreshold.threshhold" }
      ]
    };
  },
  computed: {
    logsParsed() {
      if (this.logs.value != undefined) {
        var logsparsed = JSON.parse(this.logs.value);
        var returnArray = [];
        logsparsed.forEach(element => {
          element.timestamp = moment(new Date(element.timestamp)).format("lll");
          returnArray.push(element);
        });
        console.log(returnArray);

        return returnArray.reverse();
      }
      return [{}];
    },
    renderTable() {
      if (this.logs.value != undefined) {
        return true;
      }
      return false;
    }
  },
  methods: {
    getColor(value) {
      if (value == "true") {
        return "green lighten-1";
      } else if (value == "forced") {
        return "green lighten-1";
      } else if (value == "check") {
        return "amber darken-1";
      } else {
        return "grey lighten-1";
      }
    }
  }
};
</script>

<style>
.v-data-table td {
  text-transform: capitalize !important;
}
</style>
