import { ApiError } from "../utils/apiError.ts";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;

  // 🔴 INTERNAL LOGGING (full detail)
  console.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // 🟢 SAFE RESPONSE
  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Something went wrong. Please try again later."
        : err.message,
    errors: statusCode === 500 ? [] : isApiError ? err.errors : [],
    data: null,
  });
};

export { errorHandler };
