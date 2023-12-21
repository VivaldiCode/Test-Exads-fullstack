const sendSuccessResponse = function(res, options = { data: undefined, message: 'OK' }) {
  const response = { message: options.message, data: options.data };
  res.status(200).json(response);
}

const sendErrorResponse = function(res, options = {
  data: undefined,
  message: 'Something went wrong',
  status: 500
}) {
  const response = { message: options.message, data: options.data };
  res.status(options.status).json(response);
}

const sendBadRequestResponse = function(res, missingParams) {
  let message = '';
  let i = 0;
  const amountOfMissingParams = missingParams.length;

  if (amountOfMissingParams > 1) {
    message = 'Parameters ';
    while (missingParams[i]) {
      message += missingParams[i];
      i++;
      if (i < amountOfMissingParams - 1) {
        message += ', ';
      } else if (i < amountOfMissingParams) {
        message += ' and ';
      }
    }
    message += ' are required';
  } else {
    message = 'Parameter ' + missingParams[0] + ' is required';
  }

  const response = { message, missing_params: missingParams };
  res.status(400).json(response);
}

const ResponseHandler = {
  sendSuccessResponse,
  sendErrorResponse,
  sendBadRequestResponse,
}

module.exports = ResponseHandler;
