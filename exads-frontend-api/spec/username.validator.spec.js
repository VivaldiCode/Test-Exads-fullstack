const DB = require('../DB/db');
const users = require('../DB/users.db');
const UsernameValidator = require('../validators/username.validator');

describe('UsernameValidator', () => {

  it('should return null when the username has no errors', () => {
    const username = 'mia_1234';
    const user = { username };
    spyOn(DB.users, 'get').and.returnValue(users);
    const error = UsernameValidator.validate(user);
    expect(error).toBe(null);
  });

  it('should return an error when the username has more characters than allowed', () => {
    const username = 'a_very_very_very_long_username_12345';
    const user = { username };
    spyOn(DB.users, 'get').and.returnValue(users);
    const error = UsernameValidator.validate(user);
    expect(error).toBe(`Username '${username}' has more than ${UsernameValidator.constants.MAX_CHARACTERS_AMOUNT} characters`);
  });

  it('should return an error when the username has less characters than required', () => {
    const username = 'aa';
    const user = { username };
    spyOn(DB.users, 'get').and.returnValue(users);
    const error = UsernameValidator.validate(user);
    expect(error).toBe(`Username '${username}' has less than ${UsernameValidator.constants.MIN_CHARACTERS_AMOUNT} characters`);
  });

  it('should return an error when the username has at least one character that is not allowed', () => {
    const username = 'mia.1234';
    const user = { username };
    spyOn(DB.users, 'get').and.returnValue(users);
    const error = UsernameValidator.validate(user);
    expect(error).toBe(`Username '${username}' cannot contain the following characters {}'[].!`);
  });

  it('should return an error when username is already used when creating a new user', () => {
    const username = users[10].username;  // Existing username in users.js
    const id = undefined;
    const user = { username, id };
    spyOn(DB.users, 'get').and.returnValue(users);
    const error = UsernameValidator.validate(user);
    expect(error).toBe(`Username '${username}' is been used by another user`);
  });

  it('should return an error when username is already used when updating a user', () => {
    const username = users[10].username;  // Existing username in users.js
    const id = users[10].username; // Simulate that we update a user other than the 10th one
    const user = { username, id };
    spyOn(DB.users, 'get').and.returnValue(users);
    const error = UsernameValidator.validate(user);
    expect(error).toBe(`Username '${username}' is been used by another user`);
  });
});
