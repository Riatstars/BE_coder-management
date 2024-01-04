const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  addAssignee,
  getTaskById,
  updateTaskStatusById,
  deleteTaskById,
} = require("../controllers/task.controllers.js");

//Read
/**
 * @route GET api/boo
 * @description get list of boos
 * @access public
 */
router.get("/", getAllTasks);

/**
 * @route GET api/boo
 * @description get list of boos
 * @access public
 */
router.get("/:taskId", getTaskById);

//Create
/**
 * @route POST api/boo
 * @description create a boo
 * @access public
 */
router.post("/", createTask);

//Update
/**
 * @route PUT api/boo
 * @description update reference to a boo
 * @access public
 */
router.put("/assign/:taskId", addAssignee);

//Update
/**
 * @route PUT api/boo
 * @description update reference to a boo
 * @access public
 */
router.put("/:taskId", updateTaskStatusById);

//delete
/**
 * @route PUT api/boo
 * @description delete  a boo
 * @access public
 */
router.delete("/:taskId", deleteTaskById);

//export
module.exports = router;
