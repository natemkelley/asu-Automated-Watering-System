const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
  res.json({status:true})
})

app.get('/random-movie', async (req, res, next) => {
    const axios = require('axios')
    const movieOptions = [
      'tt3896198',
      'tt0071253',
      'tt0000111',
      'tt3774312'
    ]
    var movieID = 'tt' + Math.round(Math.random() * 9999999)
    var movie = await axios.get(
      `https://www.omdbapi.com/?i=${movieID}&apikey=9733f1df`
    )
    if(movie.data.Error){
        movieID = movieOptions[Math.floor(Math.random() * movieOptions.length)]
        movie = await axios.get(
            `https://www.omdbapi.com/?i=${movieID}&apikey=9733f1df`
        )
    }
    res.json(movie.data)
  })


// export the server middleware
module.exports = {
  path: '/api',
  handler: app
}