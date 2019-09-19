<template>
  <v-container>
    <v-row v-show="loading" justify="center" align="center">
      <div class="text-center ma-12">
        <v-progress-circular :size="50" :width="7" color="deep-purple accent-4" indeterminate></v-progress-circular>
      </div>
    </v-row>
    <v-row class="mx-1" v-show="!loading">
      <v-col cols="3">
        <v-row align="center" justify="center" style="min-height: 220px;">
          <TimePicker></TimePicker>
        </v-row>
      </v-col>
      <v-col cols="9">{{chartData}}</v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import TimePicker from "@/components/weather/TimePicker";

export default {
  components: { TimePicker },
  props: ["chartData", "color", "tab"],
  data() {
    return {
      loading: true,
    };
  },
  watch: {
    chartData() {
      console.log(this.chartData);
      this.loading = false;
    }
  },
  mounted() {
    if (this.chartData) {
      setTimeout(() => {
        this.loading = false;
      }, 450);
    }
  },
  methods: {}
};
</script>
