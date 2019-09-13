<template>
  <v-card>
    <v-tabs
      v-model="tab"
      class="elevation-2"
      background-color="deep-purple accent-4"
      dark
      :vertical="true"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`">
        Tab {{ i }}
      </v-tab>

      <v-tab-item v-for="i in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile>
          <v-card-text>this is some text</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
export default {
  name: "Weather",
  data() {
    return {
        tab: null,
        tabs: 3,
    };
  },
  mounted(){
    console.log(this.$vuetify)
  }
};
</script>
