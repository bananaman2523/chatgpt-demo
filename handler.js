'use strict';
const inputSchema = require('./schema');
const axios = require('axios');

module.exports.hello = async (event) => {
  let parsedBody = JSON.parse(event.body);

  const { error, value } = inputSchema.validate(parsedBody);
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.details[0].message })
    };
  }
  
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: parsedBody.country,
        appid: '555efb4d0a29dfdac9d9166fd346aa51'
      }
    });

    const { name, sys, weather, main } = response.data;
    const { country } = sys;

    const customResponse = {
      city: name,
      country: country,
      weather: weather[0].description,
      temperature: convertTemp(main.temp,parsedBody.type),
      temp_min: convertTemp(main.temp_min,parsedBody.type),
      temp_max: convertTemp(main.temp_max,parsedBody.type)
    };
    return {
      statusCode: 200,
      body: JSON.stringify(customResponse)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
  
  function convertTemp(temp,type) {
    if (type === 'celsius') {
      const cel = temp - 273.15
      return Math.floor(cel*100)/ 100
    } else if (type === 'farenheit') {
      const far = temp * 1.8 - 459.67
      return Math.floor(far*100)/ 100
    } else if (type === 'kelvin'){
      return temp
    }
  }
  
};


// Celsius = (Kelvin – 273.15)
// 0r
// Kelvin = (Celsius + 273.15)