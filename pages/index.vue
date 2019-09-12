<template>
  <v-app>
    <MySidebar></MySidebar>
    <TopBar></TopBar>

    <v-content class="mx-5">
      <v-container fluid>
        <v-row
          align="center"
        >
          <v-col>
            <CurrentSettings></CurrentSettings>
          </v-col>
        </v-row>

        <v-row
          align="center"
        >
          <v-col cols="6">
            <Weather></Weather>
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
import CurrentSettings from '@/components/CurrentSettings'
import MoistureSensors from '@/components/MoistureSensors'
import CurrentStatus from '@/components/CurrentStatus'
import Weather from '@/components/Weather'

export default {
  components: {
    MyFooter,
    MySidebar,
    TopBar,
    CurrentSettings,
    MoistureSensors,
    CurrentSettings,
    Weather
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