<template>
  <v-app-bar app hide-on-scroll>
    <!-- <v-app-bar-nav-icon class="d-lg-none" @click.native="$store.commit('toggleNav')"></v-app-bar-nav-icon>-->
    <v-toolbar-title>Automated Watering System</v-toolbar-title>
    <div class="flex-grow-1"></div>

    <v-btn
      :dark="!loading"
      v-show="!areyousure"
      :color="color"
      :loading="loading"
      :disabled="loading"
      @click="checkIfForceSystemRun()"
    >Force System Run</v-btn>
    <v-btn
      v-show="areyousure"
      color="error"
      :loading="loading"
      :disabled="loading"
      @click="forceSystemRun()"
    >Are you sure?</v-btn>

    <v-snackbar v-model="snackbar" color="error" right="right" top="top">
      System has been forced to run
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app-bar>
</template>

<script>
import axios from "axios";

export default {
  name: "TopBar",
  props: ["color"],
  data() {
    return {
      loading: false,
      disabled: false,
      areyousure: false,
      snackbar: false
    };
  },
  methods: {
    forceSystemRun() {
      this.loading = true;
      this.disabled = true;

      axios.get(`http://localhost:3000/api/force-system-run`).then(res => {
        this.$store.commit("triggerRefresh"); //this will trigger a refresh
        setTimeout(() => {
          this.loading = false;
          this.disabled = false;
          this.areyousure = false;
          this.snackbar = true;
          this.$store.commit("triggerRefresh"); //this will trigger a refresh
        }, 1000);
      });
    },
    checkIfForceSystemRun() {
      this.loading = true;
      this.disabled = true;
      setTimeout(() => {
        this.areyousure = true;
        this.loading = false;
        this.disabled = false;
      }, 1000);
      setTimeout(() => {
        this.areyousure = false;
      }, 2300);
    }
  }
};
</script>
