const express = require('express');
const router = express.Router();

/*
* GET home page.
*/

const images = [];
for (let i = 0; i < 4; i++) {
  images.push({
    img: `/homeImages/`,
  });
}

router.get('/', function(req, res, next) {
  res.render('home', {
    title: 'We Love Cars',
    images,
  });
});

module.exports = router;
