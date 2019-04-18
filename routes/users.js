var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const userModel = require('../models/User');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/register', async function (req, res, next) {
  await userModel.create(req.body, function (err, user) {
    if (err) return next(createError(400, err.message));
    res.send(user);
  });
});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  const currentUser = await userModel.findOne({ email });
  if (!currentUser)
    return next(createError(401));

  const passwordMatch = await currentUser.verifyPassword(password);
  if (!passwordMatch)
    return next(createError(401));
  const token = currentUser.generateToken();
  res.send({
    profile: currentUser,
    token
  })
});

module.exports = router;