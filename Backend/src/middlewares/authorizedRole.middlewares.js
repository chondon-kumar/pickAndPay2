import { ApiError } from "../utils/apiError.js";

function authRole (...role){
    return (req, res, next) => {
        const user = req.user
        if (!user) {
            return next(new ApiError(401, "You are not authenticated")); // next is used to pass the error to the error handling middleware
        }
        if (!role.includes(user.role)) {
            return next(new ApiError(403, "You are not authorized to access this route")); // next is used to pass the error to the error handling middleware
        }
        next();
    };
}

export { authRole };