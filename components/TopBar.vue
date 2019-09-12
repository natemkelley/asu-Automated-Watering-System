<template>
    <v-app-bar 
      app       
      hide-on-scroll
    >
        <v-app-bar-nav-icon class="d-lg-none"
            @click.native="$store.commit('toggleNav')"
        ></v-app-bar-nav-icon>
      <v-toolbar-title>Vuetify</v-toolbar-title>
    </v-app-bar>
</template>

<script>
    export default {
        name: "TopBar"
    };
</script>
