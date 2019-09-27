<template>
  <v-text-field
    v-model="number"
    type="number"
    class="mx-5 mt-2"
    label="Minutes"
    prepend-icon="mdi-timer"
    :loading="loading"
    @change="inputValidate"
    clearable
    @click:clear="inputValidate"
  ></v-text-field>
</template>

<script>
import axios from "axios";

export default {
  name: "Timer",
  data() {
    return {
      loading: false,
      min: 15,
      max: 24 * 60 * 265,
      inputVal: null,
      number: 15
    };
  },
  methods: {
    inputValidate(val) {
      if (isNaN(val)) {
        this.number = this.min;
      }

      if (!this.number) {
        this.number = this.min;
      } else if (this.number < this.min) {
        this.number = this.min;
      } else if (this.number > this.max) {
        this.number = this.max;
      }
      this.startSavingValue(val);
    },
    startSavingValue(value) {
      this.saveValue("timer", value);
    },
    saveValue(objectName, value, active) {
      return new Promise(resolve => {
        axios
          .post("/api/weather-settings", `query=${objectName}&value=${value}`)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      });
    }
  },
  mounted() {
    axios
      .get("/api/weather-settings?query=timer")
      .then(response => {
        this.number = response.data.value;
      })
      .catch(error => {});
  }
};
</script>
