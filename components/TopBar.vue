<template>
    <v-app-bar 
      app       
      hide-on-scroll
    >
      <v-toolbar-title>Vuetify</v-toolbar-title>
    </v-app-bar>
</template>

<script>
    export default {
        name: "TopBar",
        data() {
            return {
                isOpen: false,
            }
        }
    };
</script>
