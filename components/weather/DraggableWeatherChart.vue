<template>
  <v-container>
    <v-row v-show="loading" justify="center" align="center">
      <div class="text-center ma-12">
        <v-progress-circular :size="50" :width="7" color="deep-purple accent-4" indeterminate></v-progress-circular>
      </div>
    </v-row>
    <v-row class="mx-1" v-show="!loading">
      <v-slider
        track-color="#f1f1f1"
        :track-fill-color="color"
        :thumb-color="color"
        height="220px"
        thumb-label="always"
        :max="maxTemp"
        :min="minTemp"
        v-model="sliderValue"
        vertical
        style="position: relative; height:220px; width:10%"
      ></v-slider>
      <LineChartWithAnnotation
        style="position: relative; height:220px; width:80%"
        :chart-data="chartData"
        :options="options"
      ></LineChartWithAnnotation>
    </v-row>
  </v-container>
</template>

<script>
import LineChartWithAnnotation from "@/components/weather/LineChartWithAnnotation";
import axios from "axios";

export default {
  components: { LineChartWithAnnotation },
  props: ["chartData", "color"],
  data() {
    return {
      maxTemp: 115,
      minTemp: 50,
      sliderValue: 75,
      loading: true,
      saving: false
    };
  },
  computed: {
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        annotation: {
          annotations: [
            {
              type: "line",
              mode: "horizontal",
              scaleID: "y-axis-0",
              value: this.sliderValue,
              borderColor: "black",
              borderWidth: 5
            }
          ],
          drawTime: "afterDraw"
        },
        tooltips: {
          mode: "index",
          intersect: true
        }
      };
    }
  },
  watch: {
    chartData() {
      this.loading = false;
    },
    sliderValue() {
      this.saveValue(this.sliderValue);
    }
  },
  mounted() {
    if (this.chartData) {
      setTimeout(() => {
        this.loading = false;
      }, 450);
    }
  },
  methods: {
    saveValue(value) {
      console.log(value);
      this.saveVal = value;
      if (!this.saving) {
        this.saving = true;
        setTimeout(() => {
          axios
            .post(
              "/api/weather-settings",
              `query=temperature&value=${this.saveVal}`
            )
            .then(response => {
              this.saving = false;
              console.log(response.data);
            })
            .catch(error => {
              this.saving = false;
            });
        }, 500);
      }
    }
  }
};
</script>
