const express = require('express')
const { title } = require('process')
const bodyParser = require('body-parser')
const app = express()
const Post = require('./models/post')
const mongoose = require('mongoose')

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
  .post('/api/posts', (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    })
    post.save().then(result => {
      res.status(201).json({
        message: 'Post added successfully',
        postId: result._id
      })
    })
  })
  .put('/api/posts/:id', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, req.body).then(() => {
      res.status(200).json({ message: 'Post updated' })
    })
  })
  .delete('/api/posts/:id', (req, res, next) => {
    //Post.findByIdAndDelete()
    Post.findByIdAndDelete(req.params.id).then(() => {
      res.status(200).json({ message: 'Post deleted' })
    })
  })
  .get('/api/posts/:id', (req, res, next) => {
    Post.findOne({_id: req.params.id}).then(post => {
      if (post) {
        res.status(200).json({
          message: 'Post fetched successfully',
          data: post
        })
      } else {
        res.status(404).json({
          message: 'Post not found',
        })
      }
    })
  })
  .get('/api/posts', (req, res, next) => {
    Post.find().then(document => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        data: document
      })
    })
  })

module.exports = app
