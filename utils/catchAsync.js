// Decorates async callbacks in route handlers to handle errors
module.exports = func => {
    return (req, res, next) => {
        // Pass errors from async functions to next
        func(req, res, next).catch(next);
    }
}