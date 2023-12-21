const statuses = require('./statuses.db');
let users = require('./users.db');

const DB = {
  users: {
    get() {
      return users;
    },
    create(user) {
      users.push(user);
    },
    update(user) {
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = { ...user };
    }
  },
  statuses: {
    get() {
      return statuses;
    },
  }
}
module.exports = DB;