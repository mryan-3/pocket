import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    next(new ApiError(400, "Validation failed", extractedErrors));
  };
};

export default validate;
