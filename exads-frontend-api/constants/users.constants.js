const DB = require('../DB/db');

const UsersConstants = {
  pagination: {
    defaultPage: 0,
    defaultLimit: () => DB.users.get().length
  }
}

module.exports = UsersConstants;
