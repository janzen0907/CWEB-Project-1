// const axios = require('axios');

const carURLEngine = 'https://car-api2.p.rapidapi.com/api/engines';
const carURLMakes = 'https://car-api2.p.rapidapi.com/api/makes';
const carURLModels = 'https://car-api2.p.rapidapi.com/api/models';

// Engine Specs fetch from the API
fetch(carURLEngine, {
  method: 'GET',
  params: {
    verbose: 'yes',
    direction: 'asc',
    sort: 'id',
  },
  headers: {
    'X-RapidAPI-Key': 'c0005bf572mshcc50c2c57f60ef5p1771e2jsnffca76d95e72',
    'X-RapidAPI-Host': 'car-api2.p.rapidapi.com',
  },
})
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      const carEngineData = data;
      module.exports = carEngineData;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch', error);
    });

// Car Makes fetch from the API
fetch(carURLMakes, {
  method: 'GET',
  params: {
    direction: 'asc',
    sort: 'name',
  },
  headers: {
    'X-RapidAPI-Key': 'c0005bf572mshcc50c2c57f60ef5p1771e2jsnffca76d95e72',
    'X-RapidAPI-Host': 'car-api2.p.rapidapi.com',
  },
})
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      const carMakeData = data;
      module.exports = carMakeData;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch', error);
    });

// Car Models fetch from the API
fetch(carURLModels, {
  method: 'GET',
  params: {
    sort: 'id',
    direction: 'asc',
    year: '2020',
    verbose: 'yes',
  },
  headers: {
    'X-RapidAPI-Key': 'c0005bf572mshcc50c2c57f60ef5p1771e2jsnffca76d95e72',
    'X-RapidAPI-Host': 'car-api2.p.rapidapi.com',
  },
})
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      const carMakeData = data;
      module.exports = carMakeData;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch', error);
    });

// Tried using this type of api fetch, but it wasn't working

// const options = {
//   method: 'GET',
//   url: 'https://car-api2.p.rapidapi.com/api/engines',
//   params: {
//     verbose: 'yes',
//     direction: 'asc',
//     sort: 'id',
//   },
//   headers: {
//     'X-RapidAPI-Key': 'c0005bf572mshcc50c2c57f60ef5p1771e2jsnffca76d95e72',
//     'X-RapidAPI-Host': 'car-api2.p.rapidapi.com',
//   },
// };

// async function fetchData() {
//   try {
//     const response = await axios.request(options);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// }
//
// fetchData();


