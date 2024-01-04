const {
  sendResponse,
  AppError,
  firstLetterCapital,
} = require("../helpers/utils.js");
const User = require("../models/User.js");
const Task = require("../models/Task.js");
const allowedRole = ["manager", "employee"];
const userController = {};
//Create a foo
userController.createUser = async (req, res, next) => {
  //in real project you will getting info from req
  const info = req.body;

  try {
    //always remember to control your inputs
    if (!info || !allowedRole.includes(info.role))
      throw new AppError(402, "Bad Request", "Create User Error");
    if (info.role === "") info.role = "employee";
    if (typeof info.name !== "string")
      info.name = firstLetterCapital(`${info.name}`);
    // //mongoose query
    const created = await User.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create User Success"
    );
  } catch (err) {
    next(err);
  }
};

//Get all foo
userController.getAllUsers = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  // empty filter mean get all
  let filter = req.query;
  const allowedQueries = ["name", "role"];
  console.log(filter);

  function checkQueries() {
    const reqFilter = Object.keys(filter);
    let value = false;
    reqFilter.forEach((item) => {
      if (allowedQueries.includes(item)) {
        value = true;
      } else {
        delete filter[item];
      }
    });
    return value;
  }
  console.log(!checkQueries());
  try {
    if (!filter || !checkQueries()) {
      filter = {};
    } else {
      if (filter.name) {
        filter.name = firstLetterCapital(filter.name);
      } else if (filter.role) {
        if (typeof filter.role === "string") {
          filter.role = filter.role.toLowerCase();
        }
        if (!allowedRole.includes(filter.role)) {
          throw new AppError(
            402,
            "Bad Request",
            "Please provide the correct role"
          );
        }
      }
    }

    // const listOfFound = await User.find(filter);
    const listOfFound = await User.aggregate([
      {
        $match: {
          name: { $regex: filter.name, $options: "i" },
          role: filter.role,
        },
      },
    ]);


    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of users success"
    );
  } catch (err) {
    next(err);
  }
};

//Update a foo
userController.updateUserById = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
  //you will also get updateInfo from req
  // empty target and info mean update nothing
  const targetId = null;
  const updateInfo = "";

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  try {
    //mongoose query
    const updated = await User.findByIdAndUpdate(targetId, updateInfo, options);

    sendResponse(res, 200, true, { data: updated }, null, "Update foo success");
  } catch (err) {
    next(err);
  }
};
//Delete foo
userController.deleteUserById = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication

  // empty target mean delete nothing
  const targetId = null;
  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  try {
    //mongoose query
    const updated = await User.findByIdAndDelete(targetId, options);

    sendResponse(res, 200, true, { data: updated }, null, "Delete foo success");
  } catch (err) {
    next(err);
  }
};

//export
module.exports = userController;
