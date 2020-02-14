const { TestUser } = require('../model/models')
var express = require('express');
var router = express.Router();


router.get('/getdata', function (req, res, next) {
  res.send('axios getData Success');
});

router.post('/postdata', function (req, res, next) {
  res.send(req.body);
});

/*async await 异步调用*/
router.get('/findindb', async (req, res) => {
  const testusers = await TestUser.find()
  res.send(testusers);
});

router.post('/inserttodb', async (req, res) => {
  const testuser = await TestUser.create({
    username: req.body.data.username,
    password: req.body.data.password,
    location: req.body.data.location
  })
  // res.send(testuser);
  res.send(testuser);
});

module.exports = router;
