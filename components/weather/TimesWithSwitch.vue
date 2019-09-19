<template>
  <v-container>
    <v-row v-show="loading" justify="center" align="center">
      <div class="text-center ma-12">
        <v-progress-circular :size="50" :width="7" color="deep-purple accent-4" indeterminate></v-progress-circular>
      </div>
    </v-row>
    <v-row class="mx-1" v-show="!loading">
      <v-col cols="2" class="ml-0 pl-0">
        <v-row align="center" justify="center" style="min-height: 220px;">
          <TimePicker></TimePicker>
        </v-row>
      </v-col>
      <v-col cols="10">
        <v-row class="ml-3" align="center" justify="center">
          <v-col v-for="(day,n) in chartData" :key="n">
            <strong>{{day.date | momentY}}</strong>
            <br />
            <br />
            <strong>SUNRISE:</strong>
            <br />
            {{day.sunrise | momentX}}
            <br />
            <br />
            <strong>SUNSET:</strong>
            <br />
            {{day.sunset | momentX}}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import TimePicker from "@/components/weather/TimePicker";
import moment from "moment";

export default {
  components: { TimePicker },
  props: ["chartData", "color", "tab"],
  data() {
    return {
      loading: true
    };
  },
  watch: {
    chartData() {
      //console.log(this.chartData);
      this.loading = false;
    }
  },
  mounted() {
    if (this.chartData) {
      setTimeout(() => {
        //console.log(this.chartData);
        this.loading = false;
      }, 450);
    }
  },
  methods: {
  },
  filters: {
    momentX: function(value) {
      return moment(value).format("hh:mm a");
    },
    momentY: function(value) {
      return moment(value).format("MMM Do");
    }
  }
};
</script>
