const ResponseHandler = require('../handlers/response.handler');
const DB = require('../DB/db');

const get = function(req, res) {
  const statuses = DB.statuses.get();
  ResponseHandler.sendSuccessResponse(res, { data: statuses });
}

const getOne = function(req, res) {
  const statusId = +req.params.id;
  const status = DB.statuses.get().find(u => u.id === statusId);
  if (status) {
    ResponseHandler.sendSuccessResponse(res, { data: { status } });
  } else {
    ResponseHandler.sendErrorResponse(res, {
      data: undefined,
      message: 'Status was not found',
      status: 404
    });
  }
}

const StatusesController = { get, getOne };

module.exports = StatusesController;