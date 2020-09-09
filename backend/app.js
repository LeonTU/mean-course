const express = require('express')
const { title } = require('process')
const bodyParser = require('body-parser')
const app = express()

app
  .use(bodyParser.json())
  //.use(bodyParser.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-requested-With, Content-Type, Accept'
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS'
    )
    next()
  })
  .post('/api/posts', (req, res, next) => {
    console.log(req.body)
    res.status(201).json({
      message: 'Post added successfully'
    })
  })
  .get('/api/posts', (req, res, next) => {
    const posts = [
      {
        id: 'dfjlsjflsjflsfjdlsfjl',
        title: 'title 1',
        content: 'content 1'
      },
      {
        id: 'dfjlsjflsjflsfjdlsfjl',
        title: 'title 2',
        content: 'content 2'
      },
      {
        id: 'dfjlsjflsjflsfjdlsfjl',
        title: 'title 3',
        content: 'content 3'
      }
    ]
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts
    })
  })

module.exports = app
