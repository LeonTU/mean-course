const express = require('express')
const { Error } = require('mongoose')
const router = express.Router()
const multer = require('multer')
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const Post = require('../models/post')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error('Invalid mime type')
    cb(error, 'backend/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, `${name}-${Date.now()}.${ext}`)
  }
})


router.
  post('', multer({storage: storage}).single('image'), (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`
    })
    post.save().then(result => {
      res.status(201).json({
        message: 'Post added successfully',
        post: result
      })
    })
  })
  .put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
    if (req.file) {
      const url = `${req.protocol}://${req.get('host')}`
      const imagePath = `${url}/images/${req.file.filename}`
      req.body.imagePath = imagePath
    }
    Post.findByIdAndUpdate(req.params.id, req.body).then(() => {
      res.status(200).json({ message: 'Post updated' })
    })
  })
  .delete('/:id', (req, res, next) => {
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
