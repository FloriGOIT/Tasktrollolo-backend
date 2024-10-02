// Middleware to catch errors in async route handlers/controllers
const asyncErrorHandler = (controller) => {
    return async (req, res, next) => {
        try {
            // Await the execution of the controller
            await controller(req, res);
        } catch (error) {
            // If an error is caught, pass it to the next middleware (typically the error handler)
            next(error);
        }
    };
};

module.exports = asyncErrorHandler;
