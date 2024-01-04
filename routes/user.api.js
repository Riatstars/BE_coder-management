const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controllers.js");

//Read
/**
 * @route GET api/foo
 * @description get list of foos
 * @access public
 */
router.get("/", getAllUsers);

//Create
/**
 * @route POST api/foo
 * @description create a foo
 * @access public
 */
router.post("/", createUser);

//Update
/**
 * @route PUT api/foo
 * @description update a foo
 * @access public
 */
router.put("/:id", updateUserById);

//Delete
/**
 * @route DELETE api/foo
 * @description delet a foo
 * @access public
 */
router.delete("/:id", deleteUserById);

module.exports = router;
