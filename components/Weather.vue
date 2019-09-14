<template>
  <v-card>
    <v-tabs
      v-model="tab"
      class="elevation-2"
      background-color="deep-purple accent-4"
      dark
      :vertical="true"
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(tab,i) in tabs" :key="tab" :href="`#tab-${tab}`">{{ tab }}</v-tab>
      <v-tab-item v-for="tab in tabs" :key="tab" :value="'tab-' + tab">
        <v-card flat tile height="245px">
          <DraggableWeatherChart :color="color" :chartData="chartData"></DraggableWeatherChart>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import DraggableWeatherChart from "@/components/weather/DraggableWeatherChart";
import colors from 'vuetify/es5/util/colors'

export default {
  name: "Weather",
  components: { DraggableWeatherChart },
  data() {
    return {
      tab: null,
      tabs: ['Temperature','Rain','Likelihood','Humidity','Sun'],
      chartData: {}
    };
  },
  methods: {
    generateData() {
      let newArray = [];
      for (let i = 0; i < 10; i++) {
        let randomValue = Math.floor(Math.random() * 80) + 32;
        newArray.push(randomValue);
      }
      this.chartData = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: colors.deepPurple.accent4,
            data: newArray
          }
        ]
      };
    }
  },
  mounted() {
    setInterval(this.generateData, 5000);
  },
  computed:{
    color(){
      return colors.deepPurple.accent4
    }
  }
};
</script>
