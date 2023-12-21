const ResponseHandler = require('../handlers/response.handler');
const DB = require('../DB/db');
const EmailValidator = require('../validators/email.validator');
const UsernameValidator = require('../validators/username.validator');
const UsersConstants = require('../constants/users.constants');

const get = function(req, res) {
  const email = req.query.email;
  const username = req.query.username;
  const page = +req.query.page || UsersConstants.pagination.defaultPage;
  const limit = +req.query.limit || UsersConstants.pagination.defaultLimit();
  const start = page * limit;
  const end = start + limit;

  const filterUsers = ({ email, username }) => {
    const users = DB.users.get();
    if (email && username) {
      return users.filter(user => user.email === email && user.username === username);
    }

    if (email) {
      return users.filter(user => user.email === email);
    }

    if (username) {
      return users.filter(user => user.username === username);
    }

    return users;
  }

  const users = filterUsers({ email, username });
  ResponseHandler.sendSuccessResponse(res, { data: { users: users.slice(start, end), count: users.length } });
}

const getOne = function(req, res) {
  const userId = +req.params.id;
  const users = DB.users.get();
  const user = users.find(u => u.id === userId);
  if (user) {
    ResponseHandler.sendSuccessResponse(res, { data: { user } });
  } else {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: 'User was not found',
      status: 404
    });
  }
}

const create = function(req, res) {

  const user = req.body.user;

  if (!user) {
    ResponseHandler.sendBadRequestResponse(res, ['user']);
    return;
  }

  const requiredParams = ['username', 'first_name', 'email', 'id_status'];
  const missingParams = requiredParams.filter(required => !user[required]);
  if (missingParams.length > 0) {
    ResponseHandler.sendBadRequestResponse(res, missingParams);
    return;
  }

  const emailError = EmailValidator.validate(user.email);
  if (emailError) {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: emailError,
      status: 400
    });
    return;
  }

  const usernameError = UsernameValidator.validate(user);
  if (usernameError) {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: usernameError,
      status: 400
    });
    return;
  }

  const activeStatus = DB.statuses.get().find(status => status.tag === 'USER_ACTIVE');
  if (user.id_status !== activeStatus.id) {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: 'A new user must have Active status',
      status: 400
    });
    return;
  }

  const users = DB.users.get();
  const currentLastId = users[users.length - 1].id;

  const newUser = {
    id: currentLastId + 1,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user.username,
    created_date: new Date().toISOString(),
    id_status: user.id_status
  };
  DB.users.create(newUser);

  ResponseHandler.sendSuccessResponse(res, {
    data: { user: newUser },
    message: 'User has been successfully created'
  });
}

const update = function(req, res) {

  const user = req.body.user;
  const userId = +req.params.id;

  if (!user) {
    ResponseHandler.sendBadRequestResponse(res, ['user']);
    return;
  }

  const isUpdatingUsername = user.hasOwnProperty('username');
  if (isUpdatingUsername) {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: 'Username cannot be updated',
      status: 400
    });
    return;
  }

  const isUpdatingCreatedDate = user.hasOwnProperty('created_date');
  if (isUpdatingCreatedDate) {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: 'Creation date cannot be updated',
      status: 400
    });
    return;
  }

  const isUpdatingEmail = user.hasOwnProperty('email');
  const emailError = isUpdatingEmail && EmailValidator.validate(user.email);
  if (emailError) {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: emailError,
      status: 400
    });
    return;
  }

  const currentUser = DB.users.get().find(u => u.id === userId);
  if (!currentUser) {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: 'User was not found',
      status: 400
    });
    return;
  }

  const first_name = user.hasOwnProperty('first_name') ? user.first_name : currentUser.first_name;
  const last_name = user.hasOwnProperty('last_name') ? user.last_name : currentUser.last_name;
  const email = isUpdatingEmail ? user.email : currentUser.email;
  const id_status = user.hasOwnProperty('id_status') ? user.id_status : currentUser.id_status;

  const updatedUser = {
    ...currentUser,
    first_name,
    last_name,
    email,
    id_status
  };
  DB.users.update(updatedUser);

  ResponseHandler.sendSuccessResponse(res, {
    data: { user: updatedUser },
    message: 'User has been successfully updated'
  });
}

const UserController = { get, getOne, create, update };

module.exports = UserController;
