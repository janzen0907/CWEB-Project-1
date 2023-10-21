/**
 * This file will contain the routes needed for our forms and our home page
 * @Authors John J, Adam G
 * path of http://localhost:3000/projectOne
 * home page has the path of http://localhost:3000
 * home page is using the index.js and index.hbs files
 */

// TODO: Remove unneeded files from this project before we submit

// Needed packages for the project
const express = require('express');
const router = express.Router();
const fs = require('fs'); // file system
const multer = require('multer');
const {body, validationResult} = require('express-validator');
// Brings the car data from the api into this file


const make1 = require('express/lib/view');
const make2 = require('express/lib/view');


// Multer object with destination for images
const upload = multer( {
  dest: 'public/uploads/',
});

// const to help with the Error messages
const onlyMsgErrorFormatter = ({location, msg, param, value, nestedErrors}) => {
  return msg; // only return the message
};


// Code for first form
// Path for http://localhost:3000/projectOne/form1
router.get('/form1', function(req, res, next) {
  const violations = validationResult(req);
  const errorMessages = violations.formatWith(onlyMsgErrorFormatter).mapped();
  console.log(errorMessages);

  // Render the form to the user with any error messages they may have
  res.render('form1', {
    title: 'Show Us Your Car',
    err: errorMessages,
  });
});


// Post for our first form, Car Contest
router.post('/form1', upload.fields([{name: 'file1', maxCount: 1}]),
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
      res.render('form1', {
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

// End Code for first form


// Code for second form
// Path for http://localhost:3000/projectOne/form2
router.get('/form2', function(req, res, next) {
  const violations = validationResult(req);
  const errorMessages = violations.formatWith(onlyMsgErrorFormatter).mapped();
  console.log(errorMessages);
  res.render('form2', {
    title: 'Compare Vehicle Specifications',
    err: errorMessages,
  });
});


// Post for form 2
// TODO: Add code to determine if the vehicle they are looking for exists in the API
// After spending countless hours on this we were not able to get it to fully display properly :(
router.post('/form2',
    // [
    //
    //   body('make1').trim().notEmpty().withMessage('Must be a valid car make'),
    //   body('model1').trim().notEmpty().withMessage('Must be a valid car model'),
    //   body('year1').isNumeric().withMessage('Must be a number'),
    //   body('make2').trim().notEmpty().withMessage('Must be a valid car make'),
    //   body('model2').trim().notEmpty().withMessage('Must be a valid car model'),
    //   body('year2').isNumeric().withMessage('Must be a number'),
    //
    // ],
    function(req, res, next) {
      const violations = validationResult(req);
      const errorMessages = violations.formatWith(onlyMsgErrorFormatter).mapped();

      // log the error messages, more for my testing
      console.log(errorMessages);

      const car = {
        make: req.body.make1,
        model: req.body.model1,
        year: req.body.year1,
        engine: carEngineData.engine,
        horsepower: carEngineData.horsepower_hp,
        torque: carEngineData.torque_ft_lbs,
      };

      // TODO: Add code here to show the users the information returned from our API
      res.render('form2', {
        title: 'Form successfully Posted',
        isSubmitted: true,
        engine: carEngineData.engine,
        engineOne: make1.engine,
        horsepowerOne: make1.horsepower,
        torqueOne: make1.torque,
        engineTwo: make2.engine,
        horsepowerTwo: make2.horsepower,
        torqueTwo: make2.torque,
        err: errorMessages,
      });
    });


// Little function to help us move our file
function moveFile(tempFile, newPath) {
  newPath += tempFile.filename + '-' + tempFile.originalname;
  fs.renameSync(tempFile.path, newPath);
}

module.exports = router;
