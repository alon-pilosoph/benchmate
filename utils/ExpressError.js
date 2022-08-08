// Custom error class that extends the default error class
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        // Add message and status code
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;