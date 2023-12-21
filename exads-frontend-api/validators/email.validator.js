const validator = require('email-validator');

const validate = function(email) {

  if (!validator.validate(email)) {
    return `Email '${email}' does not have a valid format`;
  }

  return null;
}

const EmailValidator = { validate };

module.exports = EmailValidator;
