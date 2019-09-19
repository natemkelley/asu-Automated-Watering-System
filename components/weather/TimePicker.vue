<template>
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
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      time: null,
      menu2: false,
      modal2: false
    };
  },
  mounted() {
    if (this.chartData) {
      setTimeout(() => {
        this.loading = false;
      }, 450);
    }
    axios
      .get("/api/weather-settings?query=time")
      .then(response => {
        console.log(response.data.results.value);
        this.time = response.data.results.value;
      })
      .catch(error => {
      });
  },
  methods: {
    saveValue(value) {
      axios
        .post("/api/weather-settings", `query=time&value=${value}`)
        .then(response => {
          //console.log(response.data);
          this.$refs.dialog.save(value);
          this.modal2 = false;
        })
        .catch(error => {
          this.saving = false;
        });
    }
  },
  watch: {
    time() {
      if (this.time) {
        //console.log(this.$refs.dialog);
      } else {
      }
    }
  }
};
</script>