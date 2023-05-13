// handlebars-helpers.js

const Handlebars = require('handlebars');

Handlebars.registerHelper('isEqual', function(a, b, options) {
  if (parseInt(a) === parseInt(b)) {
    return options.fn(this); // Executes the content within the if block
  } else {
    return options.inverse(this); // Executes the content within the else block
  }
});

module.exports = Handlebars;
