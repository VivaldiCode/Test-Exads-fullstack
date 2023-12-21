const response = {
  status(statusCode) { return this; },
  json(object) { return this; }
}

module.exports = response;
