const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw { message: 'No token' };
    }
    jwt.verify(token, 'long_secret');
    next();
  } catch (error) {
    res.status(401).json(error);
  }
};
