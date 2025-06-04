// In utils/expresserror.js
class ExpressError extends Error {
    constructor(statusCode, message) {  // Correct constructor
      super();
      this.statusCode = statusCode;  // Now using 'statusCode'
      this.message = message;
    }
  }
  module.exports = ExpressError;