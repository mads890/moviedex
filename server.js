require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())

app.use(function validateKey(req, res, next) {
    const apiKey = process.env.API_TOKEN
    const authToken = req.get('Authorization')
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

app.use((err, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { err }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000
app.listen(PORT)