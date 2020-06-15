require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies.json')
console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateKey(req, res, next) {
    const apiKey = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log(req.get('Authorization'))
    if(!authToken || authToken.split(' ')[1] !== apiKey) {
        return res.status(401).json({ error: "unauthorized request" })
    }
    next()
})

function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query;
    let moviesToReturn = MOVIES.movies
    if(genre) {
        moviesToReturn = moviesToReturn.filter(movie => {
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        })
    }
    if(country) {
        moviesToReturn = moviesToReturn.filter(movie => {
            movie.country.toLowerCase().includes(country.toLowerCase())
        })
    }
    if(avg_vote) {
        const voteNum = parseFloat(avg_vote)
        moviesToReturn = moviesToReturn.filter(movie => {
            movie.avg_vote >= voteNum
        })
    }
    res.json(moviesToReturn)
}

app.get('/movie', handleGetMovie)

const PORT = 8000
app.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
})