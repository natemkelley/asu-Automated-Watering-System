<template>
  <v-navigation-drawer v-model="drawer" :floating="false" overflow app>
    <v-list>
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <v-icon>mdi-{{item.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-switch v-model="$vuetify.theme.dark" primary right class="float-left ml-3" label="Dark"></v-switch>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  computed: {
    drawer: {
      get() {
        return this.$store.state.model;
      },
      set(state) {
        this.$store.commit("toggleNav", state);
      }
    }
  },
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "view-dashboard" },
        { title: "Account", icon: "account" },
        { title: "Admin", icon: "gavel" }
      ],
      storeModel: null
    };
  }
};
</script>
