const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  addReference,
} = require("../controllers/task.controllers.js");

//Read
/**
 * @route GET api/boo
 * @description get list of boos
 * @access public
 */
router.get("/", getAllTasks);

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
router.put("/targetName", addReference);

//export
module.exports = router;
