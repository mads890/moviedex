require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies.json')

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
    let moviesToReturn = MOVIES
    if(genre) {
        moviesToReturn = moviesToReturn.filter(movie => {
            return movie.genre.toLowerCase().includes(genre.toLowerCase())
        })
    }
    if(country) {
        moviesToReturn = moviesToReturn.filter(movie => {
            return movie.country.toLowerCase().includes(country.toLowerCase())
        })
    }
    if(avg_vote) {
        moviesToReturn = moviesToReturn.filter(movie => {
            return movie.avg_vote >= Number(avg_vote)
        })
    }
    res.json(moviesToReturn)
}

app.get('/movie', handleGetMovie)

const PORT = 8000
app.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
})