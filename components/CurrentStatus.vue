<template>
  <v-card >
    <v-card-title>Current Status </v-card-title>
    <v-card-text>I'm card text</v-card-text>
    <v-card-actions>
      <v-btn text>Click</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CurrentStatus",
  data() {
    return {
      isOpen: false
    };
  }
};
</script>
