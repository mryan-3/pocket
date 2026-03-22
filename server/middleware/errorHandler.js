import ApiError from '../utils/ApiError.js';
import { Logger } from 'borgen';

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal Server Error";
  }

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    errors: err.errors || []
  };

  if (statusCode >= 500) {
    Logger.error({ message: `[${req.method}] ${req.url} - ${message}`, error: err });
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
