const express = require('express')

const router = express.Router()

const Post = require('../models/post')


router.
  post('', (req, res, next) => {
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
.put('/:id', (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body).then(() => {
    res.status(200).json({ message: 'Post updated' })
  })
})
.delete('/:id', (req, res, next) => {
  //Post.findByIdAndDelete()
  Post.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).json({ message: 'Post deleted' })
  })
})
.get('/:id', (req, res, next) => {
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
.get('', (req, res, next) => {
  Post.find().then(document => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: document
    })
  })
})

module.exports = router
