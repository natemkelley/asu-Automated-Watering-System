<template>
  <v-container>
    <v-row v-show="loading" justify="center" align="center">
      <div class="text-center ma-12">
        <v-progress-circular :size="50" :width="7" color="deep-purple accent-4" indeterminate></v-progress-circular>
      </div>
    </v-row>
    <v-row class="mx-1" v-show="!loading" justify="center" align="center">
      <v-col cols="2">
        <v-slider
          track-color="#f1f1f1"
          :track-fill-color="color"
          :thumb-color="color"
          height="80%"
          thumb-label="always"
          :max="maxVal"
          :min="minVal"
          v-model="sliderValue"
          vertical
          style="position: relative;"
        ></v-slider>
        <p v-if="label" class="text-center" style="height:20%">{{label}}</p>
      </v-col>
      <v-col cols="10">
        <LineChartWithAnnotation
          v-if="type === 'Line'"
          style="position: relative; height:210px; "
          :chart-data="chartData"
          :options="options"
        ></LineChartWithAnnotation>
        <BarChartWithAnnotation
          v-if="type === 'Bar'"
          style="position: relative; height:210px; "
          :chart-data="chartData"
          :options="options"
        ></BarChartWithAnnotation>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BarChartWithAnnotation from "@/components/weather/BarChartWithAnnotation";
import LineChartWithAnnotation from "@/components/weather/LineChartWithAnnotation";
import axios from "axios";

export default {
  components: { LineChartWithAnnotation, BarChartWithAnnotation },
  props: [
    "chartData",
    "color",
    "tab",
    "type",
    "maxSlider",
    "minSlider",
    "settings",
    "label"
  ],
  data() {
    return {
      loading: true,
      saving: false,
      sliderValue: null
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
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: this.minVal,
                suggestedMax: this.maxVal
              }
            }
          ]
        }
      };
    },
    maxVal() {
      if (this.maxSlider) {
        return this.maxSlider;
      }
      return 115;
    },
    minVal() {
      if (this.minSlider) {
        return this.minSlider;
      }
      return 32;
    }
  },
  watch: {
    chartData() {
      this.loading = false;
    },
    sliderValue(oldVal, newVal) {
      if (!this.loading && !(oldVal == newVal) && !(newVal == "null")) {
        if (newVal == "null") {
          return
        }
        if (oldVal == "null") {
          return
        }

        this.saveValue(this.sliderValue);
      }
    },
    settings() {
      this.setSliderValue();
    }
  },
  mounted() {
    if (this.chartData) {
      setTimeout(() => {
        this.setSliderValue();
        this.loading = false;
      }, 450);
    }
  },
  methods: {
    saveValue(value) {
      if (!(value == null) && !this.saving && !this.loading && this.settings) {
        this.saving = true;
        console.log("Saving", value);
        setTimeout(() => {
          axios
            .post(
              "/api/weather-settings",
              `query=${this.settings.objectName}&value=${value}`
            )
            .then(response => {
              this.saving = false;
              this.$store.commit("triggerRefresh"); //this will trigger a refresh
            })
            .catch(error => {
              this.saving = false;
            });
        }, 600);
      }
    },
    setSliderValue() {
      if (this.settings) {
        this.sliderValue = this.settings.value;
      }
    }
  }
};
</script>
