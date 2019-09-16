<template>
  <section class="container">
      <div class="movie" v-if="movie">
        <img :src="movie.Poster">
        <h1>{{movie.Title}}</h1>
        <h3>{{movie.Year}}</h3>
        <button @click="getRandomMovie">Get Random Movie</button>
      </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  asyncData({ params }) {
    return axios.get(`http://localhost:3000/api/random-movie`).then(res => {
      console.log(res.data)
      return { movie: res.data }
    })
  },
  methods: {
    getRandomMovie() {
      axios.get(`api/random-movie`).then(res => {
        console.log(res.data)
        this.movie = res.data
      })
    }
  }
}
</script>

<style>