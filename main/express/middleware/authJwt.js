const jwt = require('jsonwebtoken');
// const config = require('../config/auth.config.js');
const config = require('config');
// const db_index = require('../models');
// const User = db_index.user;
// const Role = db_index.role;
const User = require('../models/User');
const Role = require('../models/Role');

verifyToken = (req, res, next) => {
  // Get token from header
  const token = req.headers['x-access-token'];
  // const token = req.header('x-access-token');

  // Check if not token
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }
  // jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
  //   if (err) {
  //     return res.status(401).send({ message: 'Unauthorized!' });
  //   }
  //   req.userId = decoded.id;
  //   next();
  // });

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // req.user = decoded.user; 
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized!' });
  }

};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.ststus(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }
        res.status(403).send({ message: 'Require Admin Role!' });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.ststus(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            next();
            return;
          }
        }
        res.status(403).send({ message: 'Require Moderator Role!' });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

module.exports = authJwt;