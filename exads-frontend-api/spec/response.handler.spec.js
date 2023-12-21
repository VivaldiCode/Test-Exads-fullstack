const ResponseHandler = require('../handlers/response.handler');
const response = require('./stubs/response.stub');

describe('ResponseHandler', () => {

  it('should send a default success response when no options are passed', () => {
    spyOn(response, 'status').and.returnValue(response);
    spyOn(response, 'json').and.returnValue(response);

    ResponseHandler.sendSuccessResponse(response);

    expect(response.status).toHaveBeenCalledWith(200);

    const json = { data: undefined, message: 'OK' };
    expect(response.json).toHaveBeenCalledWith(json);
  });

  it('should send a success response with given options', () => {
    spyOn(response, 'status').and.returnValue(response);
    spyOn(response, 'json').and.returnValue(response);

    const data = { prop1: 'prop1', prop2: true };
    const message = 'Fake success message';
    const options = { data, message };
    ResponseHandler.sendSuccessResponse(response, options);

    expect(response.status).toHaveBeenCalledWith(200);

    const json = { message: options.message, data: options.data };
    expect(response.json).toHaveBeenCalledWith(json);
  });

  it('should send a default error response when no options are passed', () => {
    spyOn(response, 'status').and.returnValue(response);
    spyOn(response, 'json').and.returnValue(response);

    ResponseHandler.sendErrorResponse(response);

    const status = 500;
    expect(response.status).toHaveBeenCalledWith(status);

    const json = { data: undefined, message: 'Something went wrong' };
    expect(response.json).toHaveBeenCalledWith(json);
  });

  it('should send a success response with given options', () => {
    spyOn(response, 'status').and.returnValue(response);
    spyOn(response, 'json').and.returnValue(response);

    const data = { prop1: 'prop1', prop2: true };
    const message = 'Fake error message';
    const status = 502;
    const options = { data, message, status };
    ResponseHandler.sendErrorResponse(response, options);

    expect(response.status).toHaveBeenCalledWith(status);

    const json = { message: options.message, data: options.data };
    expect(response.json).toHaveBeenCalledWith(json);
  });

  it('should send a bad request when there is a missing param', () => {
    spyOn(response, 'status').and.returnValue(response);
    spyOn(response, 'json').and.returnValue(response);

    const param_1 = 'param_1';
    const missingParams = [param_1];
    ResponseHandler.sendBadRequestResponse(response, missingParams);

    expect(response.status).toHaveBeenCalledWith(400);

    const message = `Parameter ${param_1} is required`;
    const json = { message, missing_params: missingParams };
    expect(response.json).toHaveBeenCalledWith(json);
  });

  it('should send a bad request when there are 2 a missing params', () => {
    spyOn(response, 'status').and.returnValue(response);
    spyOn(response, 'json').and.returnValue(response);

    const param_1 = 'param_1';
    const param_2 = 'param_2';
    const missingParams = [param_1, param_2];
    ResponseHandler.sendBadRequestResponse(response, missingParams);

    expect(response.status).toHaveBeenCalledWith(400);

    const message = `Parameters ${param_1} and ${param_2} are required`;
    const json = { message, missing_params: missingParams };
    expect(response.json).toHaveBeenCalledWith(json);
  });

  it('should send a bad request when there more than 2 missing params', () => {
    spyOn(response, 'status').and.returnValue(response);
    spyOn(response, 'json').and.returnValue(response);

    const param_1 = 'param_1';
    const param_2 = 'param_2';
    const param_3 = 'param_3';
    const param_4 = 'param_4';
    const missingParams = [param_1, param_2, param_3, param_4];
    ResponseHandler.sendBadRequestResponse(response, missingParams);

    expect(response.status).toHaveBeenCalledWith(400);

    const message = `Parameters ${param_1}, ${param_2}, ${param_3} and ${param_4} are required`;
    const json = { message, missing_params: missingParams };
    expect(response.json).toHaveBeenCalledWith(json);
  });
});
