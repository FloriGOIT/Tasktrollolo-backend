import { errorlist } from "../helpers/errorList.js";

// Middleware function to validate the request body based on a given schema
const validateRequestBody = (validationSchema) => {

    // The actual middleware function to be used in route handling
    const validateMiddleware = async (req, res, next) => {

        // Validate the request body using the provided schema
        const { error } = validationSchema.validate(req.body, { abortEarly: false });

        // If validation fails, pass the error to the next middleware (usually the error handler)
        if (error) {
            // Format error messages to be more user-friendly
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(", ");
            return next(errorlist(400, errorMessage));
        }

        // If validation succeeds, move to the next middleware or controller
        next();
    };

    // Return the middleware function to be used in the server routes
    return validateMiddleware;
};

export default validateRequestBody;
