const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../../models/User');
// const Role = require('../../models/Role');
// const config = require('config');
// const { check, validationResult } = require('express-validator');
// const { verifySignUp } = require('../middleware');
const { authJwt } = require('../../middleware');


// @route   Get api/users/all
// @desc
// @access  Public
router.get('/all', async (req, res) => {
  res.status(200).send('Public Content.');
});


// @route   Get api/users/user
// @desc
// @access  User
router.get('/user', [
  authJwt.verifyToken
], async (req, res) => {
  res.status(200).send('User Content.');
});


// @route   Get api/users/mod
// @desc
// @access  Moderator
router.get('/mod', [
  authJwt.verifyToken,
  authJwt.isModerator
], async (req, res) => {
  res.status(200).send('Moderator Content.');
});


// @route   Get api/users/admin
// @desc
// @access  Admin
router.get('/admin', [
  authJwt.verifyToken,
  authJwt.isAdmin
], async (req, res) => {
  res.sendStatus(200).send('Admin Content.');
});

module.exports = router;