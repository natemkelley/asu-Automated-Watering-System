<template>
  <v-card class="mx-auto" height="100%" :color="color">
    <v-card-title class="white--text">
      <v-icon large left color="white">mdi-tune</v-icon>
      <span class="title font-weight-light">Current Settings</span>
    </v-card-title>

    <TriggerComponent :triggerSettings="triggerSettings" v-if="triggerSettings"></TriggerComponent>
    <GridComponent :gridSettings="gridSettings"></GridComponent>

    <v-card-actions>
      <ExtraInformation :weatherSettings="weatherSettings" v-if="weatherSettings"></ExtraInformation>
    </v-card-actions>
  </v-card>
</template>

<script>
import colors from "vuetify/es5/util/colors";
import GridComponent from "@/components/settings/grid";
import TriggerComponent from "@/components/settings/trigger";
import ExtraInformation from "@/components/settings/extraInformation";

export default {
  name: "CurrentSettings",
  props: ["weatherSettings"],
  components: { GridComponent, TriggerComponent,ExtraInformation },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    color() {
      return colors.green.darken1;
    },
    triggerSettings() {
      if (!this.weatherSettings.time || !this.weatherSettings.timer) {
        return false;
      }
      return [this.weatherSettings.time, this.weatherSettings.timer];
    },
    gridSettings() {
      return this.weatherSettings;
    },
  }
};
</script>

<style >
.theme--light.v-expansion-panels .v-expansion-panel {
  background-color: transparent;
  color: white;
  box-shadow: none !important;
}
.v-expansion-panel::before {
    box-shadow: none!important;
}

.theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
    color: white!important;
}
</style>

//https://haltu.github.io/muuri/
//https://interactjs.io/
//---- https://codepen.io/eljefedelrodeodeljefe/pen/vybegM
