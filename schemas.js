const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Custom validation to prevent HTML in string fields
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// joi schema to validate benches
module.exports.benchSchema = Joi.object({
  address: Joi.string().required().escapeHTML().label("Address"),
  description: Joi.string().required().escapeHTML().label("Description"),
  deleteImages: Joi.array(),
});

// joi schema to validate reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).label("Rating"),
    headline: Joi.string().required().escapeHTML().label("Review headline"),
    body: Joi.string().required().escapeHTML().label("Review body"),
  }).required(),
});

// joi schema to validate users
module.exports.userSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(4)
    .max(20)
    .escapeHTML()
    .label("Username"),
  email: Joi.string().email(),
  password: Joi.string().required().min(6).max(20).label("Password"),
}).required();
