const Joi = require('joi');

const inputSchema = Joi.object({
  country: Joi.string().required(),
  type: Joi.string().valid('celsius', 'farenheit', 'kelvin').required()

});

module.exports = inputSchema;
