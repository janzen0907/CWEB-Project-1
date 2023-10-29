const express = require('express');
const router = express.Router();

/*
* GET for home page.
*/

router.get('/', function(req, res, next) {
  res.render('home', {
    title: 'We Love Cars',
  });
});

module.exports = router;
