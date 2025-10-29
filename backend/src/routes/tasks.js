const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const {
  createTaskValidation,
  updateTaskValidation,
  getTaskValidation,
  deleteTaskValidation,
  getTasksValidation
} = require('../validators/taskValidation');

router.use(auth);

router.get('/', getTasksValidation, taskController.getTasks);
router.get('/:id', getTaskValidation, taskController.getTask);
router.post('/', createTaskValidation, taskController.createTask);
router.put('/:id', updateTaskValidation, taskController.updateTask);
router.delete('/:id', deleteTaskValidation, taskController.deleteTask);

module.exports = router;
