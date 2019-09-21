<template>
  <v-container>
    <v-row v-show="loading" justify="center" align="center">
      <div class="text-center ma-12">
        <v-progress-circular :size="50" :width="7" color="deep-purple accent-4" indeterminate></v-progress-circular>
      </div>
    </v-row>
    <v-dialog ref="dialog" v-model="modal2" :return-value.sync="time" persistent width="285px">
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="time"
          label="Start System Time"
          prepend-icon="mdi-access_time"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker v-if="modal2" v-model="time" full-width>
        <div class="flex-grow-1"></div>
        <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
        <v-btn text color="primary" @click="saveValue(time)">OK</v-btn>
      </v-time-picker>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      time: null,
      menu2: false,
      modal2: false,
      snackbar: false,
      text: "Hello, I'm a snackbar",
      loading: true
    };
  },
  mounted() {
    if (this.chartData) {
      setTimeout(() => {
        this.loading = false;
      }, 450);
    }
    this.getTime();
  },
  methods: {
    saveValue(value) {
      axios
        .post("/api/weather-settings", `query=time&value=${value}`)
        .then(response => {
          this.$refs.dialog.save(value);
          this.modal2 = false;
          if (response.data.status) {
            this.text = "Saved time: " + value;
          }
        })
        .catch(error => {
          this.saving = false;
        });
    },
    getTime() {
      console.log("Getting time");
      axios
        .get("/api/weather-settings?query=time")
        .then(response => {
          if (response.data.value.includes("Na")) {
            this.time = null;
          } else {
            this.time = response.data.value;
          }
          this.loading = false;
        })
        .catch(error => {});
    }
  }
};
</script>