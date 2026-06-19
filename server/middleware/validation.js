const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Минимум 3 символа'),
  body('email')
    .isEmail()
    .withMessage('Неверный email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Минимум 6 символов')
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Неверный email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Минимум 6 символов')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
};
