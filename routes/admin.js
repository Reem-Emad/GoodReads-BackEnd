var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const adminModel = require('../models/Admin');
const authMiddleware = require('../middlewares/Admin_Authentication');

router.post('/register', async function (req, res, next) {
  //debugs

  await adminModel.create(req.body, function (err, admin) {
    if (err) return next(createError(400, err.message));
    res.send(admin);
  });
});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  const currentAdmin = await adminModel.findOne({ email });
  if (!currentAdmin)
    return next(createError(401));

  const passwordMatch = await currentAdmin.verifyPassword(password);
  if (!passwordMatch)
    return next(createError(401));
  const token = currentAdmin.generateToken();
  res.send({
    profile: currentAdmin,
    token
  })
});
router.use(authMiddleware);


module.exports = router;

