<template>
  <v-expansion-panels v-if="!loading">
    <v-expansion-panel inset>
      <v-expansion-panel-header>Extra Information</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item class="grow">
          <v-list-item-avatar color="grey darken-3">
            <v-img class="elevation-6" :src="robot"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{triggerText}}</v-list-item-title>
            <v-list-item-title
              class="white--text"
            >The AND above implies that all those conditions must be true when it is checked.</v-list-item-title>
            <v-list-item-title
              class="white--text"
            >The OR implies that if any of those conditions is true, the system will run.</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import robot from "@/assets/myimg/robot.jpg";

export default {
  name: "ExtraInformation",
  props: ["weatherSettings"],
  data() {
    return {
      loading: true,
      robot: robot
    };
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  computed: {
    triggerText() {
      if (!this.weatherSettings.hasOwnProperty("currentTriggers")) {
        return "";
      }
      var pipelinetext = "The system will trigger";

      JSON.parse(this.weatherSettings.currentTriggers.value).forEach(
        element => {
          if (element == "timer") {
            if (pipelinetext.includes(":")) {
              pipelinetext += " or ";
            }
            pipelinetext +=
              " every " + this.weatherSettings.timer.value + " minutes";
          }
          if (element == "time") {
            pipelinetext += " at ";
            JSON.parse(this.weatherSettings.time.value).forEach(el => {
              if (pipelinetext.includes(":")) {
                pipelinetext += " and ";
              }
              pipelinetext += el;
            });
          }
        }
      );

      return pipelinetext;
    }
  }
};
</script>