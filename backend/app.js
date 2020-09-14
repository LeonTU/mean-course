const express = require('express')
const { title } = require('process')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const postsRoutes = require('./routes/posts')
const path = require('path')

mongoose.connect('mongodb+srv://Leon:03xfb9OR3TlOoF5J@cluster0.1sck0.mongodb.net/angular-node?retryWrites=true&w=majority')
  .then(() => {
    console.log('Database connected')
  })
  .catch(() => {
    console.log('Connection failed')
  })

app
  .use(bodyParser.json())
  //.use(bodyParser.urlencoded({ extended: false }))
  .use('/images', express.static(path.join('backend/images')))
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-requested-With, Content-Type, Accept'
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT,PATCH, DELETE, OPTIONS'
    )
    next()
  })
  .use('/api/posts', postsRoutes)


module.exports = app
