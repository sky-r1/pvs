const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Role = require('../../models/Role');
const config = require('config');
const { check, validationResult } = require('express-validator');
const { verifySignUp } = require('../../middleware');


// @route   Post api/auth/signup
// @desc
// @access  Public
router.post('/signup', [
  check('username', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  verifySignUp.checkDuplicateUsernameOrEmail,
  verifySignUp.checkRolesExisted
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  // const { name, email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send({ errors: [ { message: 'User already exists' } ]});
    }
    const salt = await bcrypt.genSalt(10);
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt)
    });

    // Encrypt password
    // const salt = await bcrypt.genSalt(10);

    // user.password = await bcrypt.hash(user.password, salt);

    await user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles }
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              // console.log('User was registered successfully!');
              res.send({ message: 'User was registered successfully!' });
            });
          }
        );
      } else {
        Role.findOne({ name: 'user' }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = [role._id];
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: 'User was registered successfully!'});
          });
        });
      }
    });

    // const payload = {
    //   user: {
    //     id: user.id
    //   }
    // };

    // const payload = { id: user.id }

    // jwt.sign(
    //   payload,
    //   config.get('jwtSecret'),
    //   { expiresIn: 86400 },
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token });
    //   }
    // );

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error')
  }
});


// @route   Post api/auth/signin
// @desc
// @access  Public

router.post('/signin', [
  check('username', 'Name is required').not().isEmpty(),
  // check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // const { name, email, password } = req.body;

  User.findOne({
    username: req.body.username
  }).populate('roles', '-__v').exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.ststus(404).send({ message: 'User Not found'});
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!'
      });
    }
    // const payload = {
    //   user: {
    //     id: user.id
    //   }
    // };
    const payload = { id: user.id };

    const token = jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 86400 }
    );
    const authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  });
});


module.exports = router;