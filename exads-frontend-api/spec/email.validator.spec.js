const EmailValidator = require('../validators/email.validator');
const users = require('../DB/users.db');
const DB = require('../DB/db');

describe('EmailValidator', () => {

  it('should determine that an email is valid', () => {
    const email = 'a-valid@email.com';
    spyOn(DB.users, 'get').and.returnValue(users);
    expect(EmailValidator.validate(email)).toBe(null);
  });

  it('should return an error when an email does not have a valid format', () => {
    const email = 'not-a-valid-email';
    spyOn(DB.users, 'get').and.returnValue(users);
    expect(EmailValidator.validate(email)).toBe(`Email '${email}' does not have a valid format`);
  });

});
