<template>
  <v-container app fluid>
    <v-row align="stretch" justify="start" height="300px">
      <v-col md="4">
        <v-card>
          <v-card-title>Current Triggers</v-card-title>
          <v-card-text>I'm card text</v-card-text>
          <v-card-actions>
            <v-select
              class="px-1 mb-n3 caps"
              v-model="trigger"
              :items="choices"
              chips
              label="Triggers"
              multiple
              outlined
            ></v-select>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-show="trigger.includes('timer')">
        <v-card height="100%">
          <v-card-text>lorem</v-card-text>
        </v-card>
      </v-col>
      <v-col v-show="trigger.includes('time')">
        <v-card height="100%">
          <v-card-text>lorem</v-card-text>
        </v-card>
      </v-col>
      <v-col v-show="trigger.length == 0">
          <v-alert
            prominent
            width="100%"
            border="left"
            type="error"
          >You should have at least Time or Timer enabled. The automation pipeline has been disabled</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: ["triggerSettings"],
  data() {
    return {
      loading: true,
      trigger: [],
      choices: ["time", "timer"]
    };
  },
  methods: {
    saveValue(objectName, value, active) {
      return new Promise(resolve => {
        axios
          .post(
            "/api/weather-settings",
            `query=${objectName}&value=${value}&active=${active}`
          )
          .then(response => {
            //console.log(response.data);
            resolve(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      });
    }
  },
  mounted(){
    console.log(this.triggerSettings)
    this.triggerSettings.forEach(element => {
        if(element.active){
            this.trigger.push(element.objectName)
        }
        console.log(element)
    });
  }
};
</script>

<style scoped>
.allcaps {
  text-transform: uppercase;
}

.caps {
  text-transform: capitalize;
}
</style>

https://codepen.io/niklasramo/pen/YveqNN