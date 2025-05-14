//joi is npm package used to validate schema at server side
//clent side validations are added inside the form.
// we did three steps 1) defined schema for validation
// 2) require that to app.js and define fuction validateschema as middle ware
// 3) put this middleware func in side the post route
const Joi = require("joi");
const reviews = require("./models/reviews");
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), 
   comment: Joi.string().trim().min(1).required().messages({
    'string.empty': '"review.comment" cannot be empty or just spaces.',
  }),

  }).required(),
});
