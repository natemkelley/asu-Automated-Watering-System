<template>
  <v-container>
    <v-row v-show="loading" justify="center" align="center">
      <div class="text-center ma-12">
        <v-progress-circular :size="50" :width="7" color="deep-purple accent-4" indeterminate></v-progress-circular>
      </div>
    </v-row>
    <v-row>
      <v-chip
        v-for="(chip,n) in chips"
        :key="n"
        v-model="chip.isOpen"
        class="ma-2"
        close
        @click:close="removeTime(chip)"
      >{{chip}}</v-chip>
      <v-alert
        class="mx-3"
        v-show="(chips.length < 1) && !this.loading"
        prominent
        width="100%"
        border="left"
        type="error"
      >You should have at least one time.</v-alert>
    </v-row>
    <v-dialog ref="dialog" v-model="modal2" :return-value.sync="time" persistent width="285px">
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="time"
          label="Start System Time"
          prepend-icon="mdi-timer"
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
      loading: true,
      chips: [],
      receivedTime: false
    };
  },
  created() {
    this.getTime();
  },
  methods: {
    saveValue(value) {
      if (value == null) {
        return;
      }
      this.chips.push(value);
      axios
        .post(
          "/api/weather-settings",
          `query=time&value=${JSON.stringify(this.chips)}`
        )
        .then(response => {
          this.$refs.dialog.save(value);
          this.modal2 = false;
          this.getTime();
        })
        .catch(error => {
          this.saving = false;
        });
    },
    getTime() {
      axios
        .get("/api/weather-settings?query=time")
        .then(response => {
          if (response.data.value.includes("Na")) {
            this.time = null;
          } else {
            this.time = null;
            this.chips = JSON.parse(response.data.value);
          }
          this.loading = false;
        })
        .catch(error => {});
    },
    removeTime(value) {
      let index = this.chips.indexOf(value);
      if (index !== -1) this.chips.splice(index, 1);
      axios
        .post(
          "/api/weather-settings",
          `query=time&value=${JSON.stringify(this.chips)}`
        )
        .then(response => {
          this.$refs.dialog.save(value);
          this.modal2 = false;
          this.getTime();
        })
        .catch(error => {
          this.saving = false;
        });
    }
  }
};
</script>