<template>
  <v-app>
    <MySidebar></MySidebar>
    <TopBar></TopBar>

    <v-content>
      <v-container fluid>
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="7">
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

    <MyFooter></MyFooter>
  </v-app>
</template>

<script>
import axios from 'axios'
import MyFooter from '@/components/Footer'
import MySidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default {
  components: {
    MyFooter,
    MySidebar,
    TopBar
  },
  asyncData({ params }) {
    return axios.get(`http://localhost:3000/api/random-movie`).then(res => {
      //console.log(res.data)
    })
  },
  methods: {
    
    getRandomMovie() {

    }
  }
}
</script>

<style>

</style>