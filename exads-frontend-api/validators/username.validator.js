const DB = require('../DB/db');

const MAX_CHARACTERS_AMOUNT = 20;
const MIN_CHARACTERS_AMOUNT = 3;
const NOT_ALLOWED_CHARACTERS = /[\{\}\'\[\]\.\!]/;

const validate = function({ username, id }) {

  if (username.length > MAX_CHARACTERS_AMOUNT) {
    return `Username '${username}' has more than ${MAX_CHARACTERS_AMOUNT} characters`;
  }
  if (username.length < MIN_CHARACTERS_AMOUNT) {
    return `Username '${username}' has less than ${MIN_CHARACTERS_AMOUNT} characters`;
  }

  if (username.match(NOT_ALLOWED_CHARACTERS)) {
    return `Username '${username}' cannot contain the following characters {}'[].!`;
  }

  const isNewUser = id === undefined || id === null;
  const isUsernameAlreadyUsed = !!DB.users.get().find(user => {
    const hasSameUsername = user.username === username;
    const isUpdatingSameUser = user.id === id;
    return hasSameUsername && (isNewUser || !isUpdatingSameUser);
  });
  if (isUsernameAlreadyUsed) {
    return `Username '${username}' is been used by another user`;
  }

  return null;
}

const UsernameValidator = {
  validate,
  constants: {
    MAX_CHARACTERS_AMOUNT,
    MIN_CHARACTERS_AMOUNT,
    NOT_ALLOWED_CHARACTERS
  }
};

module.exports = UsernameValidator;
