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
        thumb-label
        :max="maxTemp"
        :min="minTemp"
        v-model="sliderValue"
        vertical
        style="position: relative; height:220px; width:10%"
      ></v-slider>
      <BarChartWithAnnotation
        style="position: relative; height:220px; width:80%"
        :chart-data="chartData"
        :options="options"
      ></BarChartWithAnnotation>
    </v-row>
  </v-container>
</template>

<script>
import BarChartWithAnnotation from "@/components/weather/BarChartWithAnnotation";

export default {
  components: { BarChartWithAnnotation },
  props: ["chartData", "color"],
  data() {
    return {
      maxTemp: 115,
      minTemp: 50,
      sliderValue: 75,
      loading: true
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
        }
      };
    }
  },
  watch: {
    chartData() {
        this.loading = false;
    }
  }
};
</script>
