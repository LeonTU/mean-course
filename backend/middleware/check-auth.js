const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw { message: 'No token' };
    }
    const decodedToken = jwt.verify(token, 'long_secret');
    req.userData = { ...decodedToken };
    next();
  } catch (error) {
    res.status(401).json(error);
  }
};
