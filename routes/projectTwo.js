/**
 * This file will contain the routes needed for our forms and our home page
 * @Authors John J, Adam G
 * path of http://localhost:3000/projectTwo
 * home page has the path of http://localhost:3000
 * home page is using the home.js and home.hbs files
 */

// TODO: Remove unneeded files from this project before we submit

// Needed packages for the project
const express = require('express');
const session = require('express-session');
const router = express.Router();
const fs = require('fs'); // file system
const multer = require('multer');
const {body, validationResult} = require('express-validator');

const passport = require('passport');


// Multer object with destination for images
const upload = multer( {
  dest: 'public/uploads/',
});

// const to help with the Error messages
const onlyMsgErrorFormatter = ({location, msg, param, value, nestedErrors}) => {
  return msg; // only return the message
};

router.get('/contest', passport.authenticate('google', {
  scope: ['email'],
}));

router.get('/oauth2/redirect',
    passport.authenticate('google', {
      successRedirect: '/projectTwo/contest',
      failureRedirect: '/localhost:3000',
    }));

router.get('/contest', (req, res, next) => {
  const violations = validationResult(req);
  const errorMessages = violations.formatWith(onlyMsgErrorFormatter).mapped();
  console.log(errorMessages);

  // Render the form to the user with any error messages they may have
  res.render('contestSession', {
    title: 'Show Us Your Car',
    err: errorMessages,
  });
});

router.get('/contestSession', (req, res, next) => {
  const violations = validationResult(req);
  const errorMessages = violations.formatWith(onlyMsgErrorFormatter).mapped();
  console.log(errorMessages);

  // Render the form to the user with any error messages they may have
  res.render('contestSession', {
    title: 'Show Us Your Car',
    err: errorMessages,
  });
});

// Post for Car Contest
// Change this back if we get passport working
router.post('/contestSession', upload.fields([{name: 'file1', maxCount: 1}]),
    [
    // Validation for the form
      body('fName').trim().isAlpha().withMessage('First name must only contain letters'),
      body('lName').trim().isAlpha().withMessage('Last name must only contain letters'),
      body('phone').isMobilePhone('en-CA').withMessage('Must be a canadian phone number'),
      body('address').notEmpty().withMessage('Address cannot be left empty'),
      body('province').notEmpty().withMessage('Province cannot be left empty'),
      body('city').notEmpty().withMessage('City cannot be left empty'),
      body('title1').trim().if((value, {req})=> req.files.file1)
          .notEmpty().withMessage('Title is required when uploading a file'),
      body('file1').custom((value, {req}) => {
      // if file exists and the mimetype is not an image than we will throw an error
        if (req.files.file1 && !req.files.file1[0].mimetype.startsWith('image/')) {
          throw new Error('Car image must be an image file');
        }
        // If the file exists byt the title does not then we will throw an error
        if (!req.files.file1 && req.body.title1.trim().length) {
          throw new Error('File Name is required to enter the contest');
        }
        return true;
      }),
    ],
    function(req, res, next) {
    // variable to hold the violations
      const violations = validationResult(req);
      const errorMessages = violations.formatWith(onlyMsgErrorFormatter).mapped();
      const carImage = [];
      // log the error messages, more for testing
      console.log(errorMessages);

      // Name the file we got in and either move it or get rid of it
      for (const [field, fileArray] of Object.entries(req.files)) {
        for (const tempFile of fileArray) {
          const tempNum = field.substring(field.length -1);
          if (errorMessages['title1' + tempNum] || errorMessages['file1' + tempNum]) {
            fs.unlinkSync(tempFile.path);
          } else {
            carImage.push({
              img: `/images/${tempFile.filename}-${tempFile.originalname}`,
            });
            moveFile(tempFile, __dirname + '/../public/images/');
          }
        }
      }
      // show the image to the user
      res.render('contest', {
        title: 'You have successfully entered the contest',
        isSubmitted: true,
        carImage,
        err: errorMessages,
        submittedFName: req.body.fName,
        submittedLName: req.body.lName,
        submittedPhone: req.body.phone,
        submittedAddress: req.body.address,
        submittedProvince: req.body.province,
        submittedCity: req.body.city,
      });
    });

// End Code for contest form

// Little function to help us move our file
function moveFile(tempFile, newPath) {
  newPath += tempFile.filename + '-' + tempFile.originalname;
  fs.renameSync(tempFile.path, newPath);
}

module.exports = router;
