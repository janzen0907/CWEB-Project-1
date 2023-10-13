const express = require('express');
const router = express.Router();
// These 2 variables below bring over the car data from the car.js file
const carMakeData = require('../car.js');
const carModelData = require('../car.js');

/* GET home page.
* Didn't get it working properly displaying the lists of makes and models.
*/
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'We Love Cars',
    makes: carMakeData.hasOwnProperty('name'),
    models: carModelData.hasOwnProperty('make_id'),
  });
});

module.exports = router;
