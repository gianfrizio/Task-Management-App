const { body, param, query } = require('express-validator');

exports.createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),

  body('subtasks')
    .optional()
    .isArray()
    .withMessage('Subtasks must be an array'),

  body('subtasks.*.text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subtask text must be between 1 and 200 characters'),

  body('subtasks.*.completed')
    .optional()
    .isBoolean()
    .withMessage('Subtask completed must be a boolean'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    })
];

exports.updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),

  body('subtasks')
    .optional()
    .isArray()
    .withMessage('Subtasks must be an array'),

  body('subtasks.*.text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subtask text must be between 1 and 200 characters'),

  body('subtasks.*.completed')
    .optional()
    .isBoolean()
    .withMessage('Subtask completed must be a boolean'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

exports.getTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID')
];

exports.deleteTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID')
];

exports.getTasksValidation = [
  query('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Invalid status filter'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority filter'),

  query('category')
    .optional()
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000')
];
