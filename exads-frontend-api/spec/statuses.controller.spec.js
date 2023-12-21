const StatusesController = require('../controllers/statuses.controller');
const req = require('./stubs/request.stub');
const res = require('./stubs/response.stub');
const statuses = require('../DB/statuses.db');
const ResponseHandler = require('../handlers/response.handler');
const DB = require('../DB/db');

describe('StatusesController', () => {

  const resetRequest = () => {
    req.query = { };
    req.body = { };
    req.params = { };
  };

  beforeEach(() => resetRequest());

  it('should return the whole list of statuses', () => {
    req.query = { };
    spyOn(ResponseHandler, 'sendSuccessResponse');
    spyOn(DB.statuses, 'get').and.returnValue(statuses);

    StatusesController.get(req, res);

    expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data: statuses });
  });

  it('should return the status that matches the given id', () => {
    const id = 1;
    req.params = { id };
    spyOn(ResponseHandler, 'sendSuccessResponse');
    spyOn(DB.statuses, 'get').and.returnValue(statuses);

    StatusesController.getOne(req, res);

    const status = statuses.find(s => s.id === id);
    expect(ResponseHandler.sendSuccessResponse).toHaveBeenCalledWith(res, { data: { status } });
  });

  it('should return a not found error when no status matches the given id', () => {
    req.params = { id: 0 };
    spyOn(ResponseHandler, 'sendSuccessResponse');
    spyOn(ResponseHandler, 'sendErrorResponse');
    spyOn(DB.statuses, 'get').and.returnValue(statuses);

    StatusesController.getOne(req, res);

    expect(ResponseHandler.sendSuccessResponse).not.toHaveBeenCalled();
    expect(ResponseHandler.sendErrorResponse).toHaveBeenCalledWith(res, {
      data: undefined,
      message: 'Status was not found',
      status: 404
    });
  });
});
