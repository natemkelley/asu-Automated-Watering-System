<template>
  <v-card class="mx-auto" height="100%" :color="color" dark>
    <v-card-title>
      <v-icon large left>mdi-tune</v-icon>
      <span class="title font-weight-light">Current Settings</span>
    </v-card-title>

    <GridComponent :weatherSettings="weatherSettings"></GridComponent>



    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" src="https://www.w3schools.com/w3images/avatar2.png"></v-img>
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
import GridComponent from '@/components/settings/grid'

export default {
  name: "CurrentStatus",
  props:["weatherSettings"],
  components:{GridComponent},
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    color() {
      return colors.green.darken1;
    }
  }
};
</script>

//https://haltu.github.io/muuri/
//https://interactjs.io/
//---- https://codepen.io/eljefedelrodeodeljefe/pen/vybegM
