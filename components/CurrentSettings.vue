<template>
  <v-card class="mx-auto" height="100%" :color="color">
    <v-card-title class="white--text">
      <v-icon large left color="white">mdi-tune</v-icon>
      <span class="title font-weight-light">Current Settings</span>
    </v-card-title>

    <TriggerComponent :triggerSettings="triggerSettings" v-if="triggerSettings"></TriggerComponent>
    <GridComponent :gridSettings="gridSettings"></GridComponent>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" src="https://image.flaticon.com/icons/svg/147/147144.svg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Evan You</v-list-item-title>
        </v-list-item-content>

        <v-row align="center" justify="end">
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
import colors from "vuetify/es5/util/colors";
import GridComponent from "@/components/settings/grid";
import TriggerComponent from "@/components/settings/trigger";

export default {
  name: "CurrentSettings",
  props: ["weatherSettings"],
  components: { GridComponent, TriggerComponent },
  data() {
    return {
      isOpen: false
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
    }
  }
};
</script>

//https://haltu.github.io/muuri/
//https://interactjs.io/
//---- https://codepen.io/eljefedelrodeodeljefe/pen/vybegM
