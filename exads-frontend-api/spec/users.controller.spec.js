const UsersController = require('../controllers/users.controller');
const req = require('./stubs/request.stub');
const res = require('./stubs/response.stub');
const statuses = require('../DB/statuses.db');
const ResponseHandler = require('../handlers/response.handler');
const EmailValidator = require('../validators/email.validator');
const UsernameValidator = require('../validators/username.validator');
const DB = require('../DB/db');
const UsersConstants = require('../constants/users.constants');

describe('UsersController', () => {

  const first_name = 'Levy';
  const last_name = 'Linnard';
  const email = 'llinnard1@hatena.ne.jp';
  const username = 'llinnard1';
  const activeStatusId = statuses.find(status => status.tag === 'USER_ACTIVE').id;
  const defaultPage = UsersConstants.pagination.defaultPage;
  const defaultLimit = UsersConstants.pagination.defaultLimit();
  const defaultStart = defaultPage * defaultLimit;
  const defaultEnd = defaultStart + defaultLimit;

  let users;

  const resetUsers = () => {
    const disabledStatus = statuses.find(s => s.tag === 'USER_DISABLED');
    const enabledStatus = statuses.find(s => s.tag === 'USER_ACTIVE');
    users = [{
      id: 1,
      first_name: 'Charo',
      last_name: 'Uccello',
      email: 'cuccello0@bing.com',
      username: 'cuccello0',
      created_date: '2019-09-28T14:55:58Z',
      id_status: disabledStatus.id
    },
    {
      id: 2,
      first_name: 'Levy',
      last_name: 'Linnard',
      email: 'llinnard1@hatena.ne.jp',
      username: 'llinnard1',
      created_date: '2019-12-03T07:38:12Z',
      id_status: enabledStatus.id
    },
    {
      id: 3,
      first_name: 'Godfree',
      last_name: 'Rabbet',
      email: 'grabbet2@hubpages.com',
      username: 'grabbet2',
      created_date: '2020-07-06T21:27:08Z',
      id_status: enabledStatus.id
    }]
  };

  const resetRequest = () => {
    req.query = { };
    req.body = { };
    req.params = { };
  };

  beforeEach(() => {
    resetUsers();
    resetRequest();
  });

  describe('Get users', () => {
    it('should return the whole list of users when no filter is used', () => {
      req.query = { };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);

      UsersController.get(req, res);
  
      const data = { users: users.slice(defaultStart, defaultEnd), count: users.length };
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data });
    });
  
    it('should return a list of users filtered by username', () => {
      req.query = { username };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);

      UsersController.get(req, res);
  
      const filteredUsers = users.filter(user => user.username === username);
      const data = { users: filteredUsers.slice(defaultStart, defaultEnd), count: filteredUsers.length };
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data });
    });
  
    it('should return a list of users filtered by email', () => {
      req.query = { email };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);

      UsersController.get(req, res);
  
      const filteredUsers = users.filter(user => user.email === email);
      const data = { users: filteredUsers.slice(defaultStart, defaultEnd), count: filteredUsers.length };
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data });
    });
  
    it('should return a list of users filtered by email and username', () => {
      req.query = { email, username };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);

      UsersController.get(req, res);
  
      const filteredUsers = users.filter(user => user.email === email && user.username === username);
      const data = { users: filteredUsers.slice(defaultStart, defaultEnd), count: filteredUsers.length };
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data });
    });

    it('should return a specific page of the list of users when page and limit are not the default values', () => {
      const page = 8;
      const limit = 50;
      const start = page * limit;
      const end = start + limit;
      req.query = { page, limit };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);

      UsersController.get(req, res);
  
      const data = { users: users.slice(start, end), count: users.length };
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data });
    });
  });
 
  describe('Get one user', () => {
    it('should return the user that matches the given id', () => {
      const id = 2;
      req.params = { id };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);

      UsersController.getOne(req, res);
  
      const user = users.find(u => u.id === id);
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data: { user } });
    });
  
    it('should return a not found error when no user matches the given id', () => {
      req.params = { id: 10 };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'get').and.returnValue(users);

      UsersController.getOne(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: 'User was not found',
        status: 404
      });
    });
  });

  describe('Create a user', () => {

    it('should create a new user', () => {
      const user = {
        first_name,
        last_name,
        email,
        username,
        id_status: activeStatusId
      };
      req.body.user = user;
      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(UsernameValidator, 'validate').and.returnValue(null);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);
      spyOn(DB.users, 'create');
      spyOn(DB.statuses, 'get').and.returnValue(statuses);
      const currentLastId = users[users.length - 1].id;
  
      UsersController.create(req, res);

      const createdUser = {
        id: currentLastId + 1,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        created_date: jasmine.any(String),
        id_status: user.id_status
      };

      expect(DB.users.create).toHaveBeenCalledWith(createdUser);
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, {
        data: { user: createdUser },
        message: 'User has been successfully created'
      });
    });
  
    it('should return an error when no user is provided when creating', () => {
      req.body = { };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendBadRequestResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendBadRequestResponse).toHaveBeenCalledWith(res, ['user']);
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  
    it('should return an error when no username is provided when creating', () => {
      const user = {
        first_name,
        last_name,
        email,
        id_status: activeStatusId
      };
      req.body.user = user;
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendBadRequestResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendBadRequestResponse).toHaveBeenCalledWith(res, ['username']);
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  
    it('should return an error when no first name is provided when creating', () => {
      const user = {
        last_name,
        email,
        username,
        id_status: activeStatusId
      };
      req.body.user = user;
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendBadRequestResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendBadRequestResponse).toHaveBeenCalledWith(res, ['first_name']);
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  
    it('should return an error when no email is provided when creating', () => {
      const user = {
        first_name,
        last_name,
        username,
        id_status: activeStatusId
      };
      req.body.user = user;
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendBadRequestResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendBadRequestResponse).toHaveBeenCalledWith(res, ['email']);
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  
    it('should return an error when no status id is provided when creating', () => {
      const user = {
        first_name,
        last_name,
        email,
        username,
      };
      req.body.user = user;
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendBadRequestResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendBadRequestResponse).toHaveBeenCalledWith(res, ['id_status']);
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  
    it('should return an error when the email is invalid when creating', () => {
      const user = {
        first_name,
        last_name,
        email: 'no_valid_format_email',
        username,
        id_status: activeStatusId
      };
      req.body.user = user;
      const error = 'Invalid email';
      spyOn(EmailValidator, 'validate').and.returnValue(error);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: error,
        status: 400
      });
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  
    it('should return an error when the username is invalid when creating', () => {
      const user = {
        first_name,
        last_name,
        email,
        username: 'not_![]valida_usernam@',
        id_status: activeStatusId
      };
      req.body.user = user;
      const error = 'Invalid username';
      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(UsernameValidator, 'validate').and.returnValue(error);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: error,
        status: 400
      });
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  
    it('should return an error when the user is trying to be created with other than active status', () => {
      const otherThanActiveStatus = statuses.find(status => status.tag !== 'USER_ACTIVE');
      const user = {
        first_name,
        last_name,
        email,
        username,
        id_status: otherThanActiveStatus.id
      };
      req.body.user = user;
      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(UsernameValidator, 'validate').and.returnValue(null);
      spyOn(DB.statuses, 'get').and.returnValue(statuses);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'create');
  
      UsersController.create(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: 'A new user must have Active status',
        status: 400
      });
      expect(DB.users.create).not.toHaveBeenCalled();
    });
  });

  describe('Update a user', () => {

    it('should update all a user properties', () => {
      const user = {
        first_name,
        last_name,
        email,
        id_status: activeStatusId
      };
      req.body.user = user;

      const id = 1;
      req.params.id = id;

      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);
      spyOn(DB.users, 'update');
  
      const currentUser = users.find(u => u.id === id);

      UsersController.update(req, res);
      
      const updatedUser = { ...currentUser, ...user };
      expect(DB.users.update).toHaveBeenCalledWith(updatedUser);
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, {
        data: { user: updatedUser },
        message: 'User has been successfully updated'
      });
    });
  
    it('should update only the first name of a user', () => {
      const user = { first_name };
      req.body.user = user;

      const id = 1;
      req.params.id = id;

      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);
      spyOn(DB.users, 'update');

      const currentUser = users.find(u => u.id === id);
  
      UsersController.update(req, res);
  
      const updatedUser = { ...currentUser, first_name: user.first_name };
      expect(DB.users.update).toHaveBeenCalledWith(updatedUser);
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, {
        data: { user: updatedUser },
        message: 'User has been successfully updated'
      });
    });
  
    it('should update only the last name of a user', () => {
      const user = { last_name };
      req.body.user = user;

      const id = 1;
      req.params.id = id;

      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);
      spyOn(DB.users, 'update');

      const currentUser = users.find(u => u.id === id);
  
      UsersController.update(req, res);
  
      const updatedUser = { ...currentUser, last_name: user.last_name };
      expect(DB.users.update).toHaveBeenCalledWith(updatedUser);
  
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, {
        data: { user: updatedUser },
        message: 'User has been successfully updated'
      });
    });
  
    it('should update only the email of a user', () => {
      const user = { email };
      req.body.user = user;

      const id = 1;
      req.params.id = id;

      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);
      spyOn(DB.users, 'update');

      const currentUser = users.find(u => u.id === id);
  
      UsersController.update(req, res);
  
      const updatedUser = { ...currentUser, email: user.email };
      expect(DB.users.update).toHaveBeenCalledWith(updatedUser);
  
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, {
        data: { user: updatedUser },
        message: 'User has been successfully updated'
      });
    });
  
    it('should update only the status of a user', () => {
      const id = 1;
      const currentUser = users.find(u => u.id === id);
      const updatedStatus = statuses.find(s => s.id !== currentUser.id_status);
      const user = { id_status: updatedStatus.id };
      req.body.user = user;

      req.params.id = id;

      spyOn(EmailValidator, 'validate').and.returnValue(null);
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(DB.users, 'get').and.returnValue(users);
      spyOn(DB.users, 'update');
  
      UsersController.update(req, res);
  
      const updatedUser = { ...currentUser, id_status: user.id_status };
      expect(DB.users.update).toHaveBeenCalledWith(updatedUser);
  
      expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, {
        data: { user: updatedUser },
        message: 'User has been successfully updated'
      });
    });

    it('should return an error when no user is provided when updating', () => {
      req.body = { };
      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendBadRequestResponse');
      spyOn(DB.users, 'update');

      UsersController.update(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendBadRequestResponse).toHaveBeenCalledWith(res, ['user']);
      expect(DB.users.update).not.toHaveBeenCalled();
    });

    it('should return an error when an invalid email is provided when updating', () => {
      const user = { email };
      req.body.user = user;

      const id = 1;
      req.params.id = id;

      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'update');

      const error = 'Email is not valid';
      spyOn(EmailValidator, 'validate').and.returnValue(error);

      UsersController.update(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: error,
        status: 400
      });
      expect(DB.users.update).not.toHaveBeenCalled();
    });

    it('should return an error when trying to update the username', () => {
      const user = { username };
      req.body.user = user;

      const id = 1;
      req.params.id = id;

      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'update');

      UsersController.update(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: 'Username cannot be updated',
        status: 400
      });
      expect(DB.users.update).not.toHaveBeenCalled();
    });

    it('should return an error when trying to update the creation date', () => {
      const user = { created_date: new Date().toISOString() };
      req.body.user = user;

      const id = 1;
      req.params.id = id;

      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'update');

      UsersController.update(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: 'Creation date cannot be updated',
        status: 400
      });
      expect(DB.users.update).not.toHaveBeenCalled();
    });

    it('should return an error when the user to be updated is not found', () => {
      const user = { first_name };
      req.body.user = user;

      const id = 0; // Invalid id used here in order to not found the user
      req.params.id = id;

      spyOn(ResponseHandler, 'sendSuccessResponse');
      spyOn(ResponseHandler, 'sendErrorResponse');
      spyOn(DB.users, 'get').and.returnValue(users);
      spyOn(DB.users, 'update');

      UsersController.update(req, res);
  
      expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
      expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
        data: undefined,
        message: 'User was not found',
        status: 400
      });
      expect(DB.users.update).not.toHaveBeenCalled();
    });
  });
});
