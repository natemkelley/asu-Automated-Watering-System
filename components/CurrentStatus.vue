<template>
  <v-card height="100%">
    <v-card-title>Current Status</v-card-title>
    <div class="put-to-bottom mb-4 px-3">
      <v-btn block color="green darken-1 white--text" depressed :loading="loading" :disabled="loading" @click="check()">
        Run System Check
        <template v-slot:loader>
          <span class="custom-loader">
            <v-icon light>mdi-cached</v-icon>
          </span>
        </template>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import colors from "vuetify/es5/util/colors";

export default {
  name: "CurrentStatus",
  data() {
    return {
      isOpen: false,
      loading: false
    };
  },
  computed: {
    color() {
      return colors.green.darken1;
    }
  },
  methods: {
    check() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 1500);
    }
  }
};
</script>

<style scoped>
.put-to-bottom {
  position: absolute;
  width: 100%;
  bottom: 0;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

//https://haltu.github.io/muuri/
//https://interactjs.io/
//---- https://codepen.io/eljefedelrodeodeljefe/pen/vybegM
    <v-container fluid>
      <v-row style="height: 100%;" class="yellow lighten-3" align="end" justify="center">

      </v-row>
    </v-container>