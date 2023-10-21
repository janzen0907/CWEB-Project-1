const express = require('express');
const router = express.Router();

/*
* GET home page.
*/
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'We Love Cars',
  });
});

module.exports = router;
