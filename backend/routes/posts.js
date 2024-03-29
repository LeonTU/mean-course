const express = require('express');
const { Error } = require('mongoose');
const router = express.Router();
const multer = require('multer');
const authCheck = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const Post = require('../models/post');
const User = require('../models/user');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type');
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

router
  .get('/:id', (req, res, next) => {
    Post.findOne({ _id: req.params.id }).then(post => {
      if (post) {
        res.status(200).json({
          message: 'Post fetched successfully',
          data: post
        });
      } else {
        res.status(404).json({
          message: 'Post not found',
        });
      }
    });
  })
  .get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const postQuery = Post.find();
    let fetchedData;

    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
      .then(document => {
        fetchedData = document;
        return Post.count();
      })
      .then(document => {
        res.status(200).json({
          message: 'Posts fetched successfully',
          data: fetchedData,
          totalPosts: document
        });
      });
  })
  .post('', authCheck, multer({ storage: storage }).single('image'), (req, res, next) => {
    User.findById(req.userData.userId).then(user => {
      const url = `${req.protocol}://${req.get('host')}`;
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: `${url}/images/${req.file.filename}`,
        creator: user._id
      });
      post.save().then(result => {
        res.status(201).json({
          message: 'Post added successfully',
          post: result
        });
      });
    });
  })
  .put('/:id', authCheck, multer({ storage: storage }).single('image'), (req, res, next) => {
    if (req.file) {
      const url = `${req.protocol}://${req.get('host')}`;
      const imagePath = `${url}/images/${req.file.filename}`;
      req.body.imagePath = imagePath;
    }
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, req.body).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: 'Post updated' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    });
  })
  .delete('/:id', authCheck, (req, res, next) => {
    Post.findByIdAndDelete({
      _id: req.params.id, creator: req.userData.userId
    }).then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post deleted' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    });
  });

module.exports = router;
