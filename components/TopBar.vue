<template>
  <v-app-bar app hide-on-scroll>
    <v-app-bar-nav-icon class="d-lg-none" @click.native="$store.commit('toggleNav')"></v-app-bar-nav-icon>
    <v-toolbar-title>Vuetify</v-toolbar-title>
    <div class="flex-grow-1"></div>

    <v-btn
      :dark="!loading"
      v-show="!areyousure"
      color="green darken-1"
      :loading="loading"
      :disabled="loading"
      @click="checkIfForceSystemRun()"
    >
      <v-icon>mdi-magnify</v-icon>Force System Run
    </v-btn>
    <v-btn
      v-show="areyousure"
      color="error"
      :loading="loading"
      :disabled="loading"
      @click="forceSystemRun()"
    >Are you sure?</v-btn>
  </v-app-bar>
</template>

<script>
import axios from "axios";

export default {
  name: "TopBar",
  data() {
    return {
      loading: false,
      disabled: false,
      areyousure: false
    };
  },
  methods: {
    forceSystemRun() {
    this.loading = true;
    this.disabled = true;

      axios.get(`http://localhost:3000/api/force-system-run`).then(res => {
        this.$store.commit("triggerRefresh"); //this will trigger a refresh
        this.loading = false;
            this.disabled = false;
      });
    },
    checkIfForceSystemRun() {
      this.loading = true;
      this.disabled = true;
      setTimeout(() => {
        this.areyousure = true;
        this.loading = false;
        this.disabled = false;
      }, 600);
      setTimeout(() => {
        this.areyousure = false;
      }, 2300);
    }
  }
};
</script>
