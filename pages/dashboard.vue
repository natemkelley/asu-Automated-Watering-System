<template>
  <v-app id="sandbox">
    <v-navigation-drawer
      :floating="false"
      permanent="permanent"
      app
    >
      <v-switch
        v-model="$vuetify.theme.dark"
        primary
        label="Dark"
      ></v-switch>
    </v-navigation-drawer>

    <v-app-bar 
      app       
      hide-on-scroll
    >
      <v-toolbar-title>Vuetify</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="4">
            <v-card>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn text>Cancel</v-btn>
                <v-btn
                  text
                  color="primary"
                >Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn text>Cancel</v-btn>
                <v-btn
                  text
                  color="primary"
                >Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer
      :inset="true"
      app
    >
      <span class="px-4">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    }),
  }
</script>