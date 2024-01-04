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
    const userExist = await User.find({ name: info.name });
    if (!!userExist[0]) {
      throw new AppError(402, "Bad Request", "Username exist");
    }
    if (info)
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

  // function checkQueries() {
  //   const reqFilter = Object.keys(filter);
  //   let value = false;
  //   reqFilter.forEach((item) => {
  //     if (allowedQueries.includes(item)) {
  //       value = true;
  //     } else {
  //       delete filter[item];
  //     }
  //   });
  //   return value;
  // }
  try {
    let pipeline = [];
    let listOfFound;
    console.log(!filter.name && !filter.role);

    if (!filter.name && !filter.role) {
      listOfFound = await User.find(filter);
    } else {
      if (!allowedRole.includes(filter.role)) {
        throw new AppError(
          402,
          "Bad Request",
          "Please provide the correct role"
        );
      }
      pipeline.push({
        $match: {},
      });
      if (filter.name) {
        filter.name = firstLetterCapital(filter.name);
        pipeline[0].$match.name = { $regex: filter.name, $options: "i" };
      }
      if (filter.role) {
        pipeline[0].$match.role = filter.role;
      }
      console.log(pipeline);
      listOfFound = await User.aggregate(pipeline);
    }

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
userController.getTaskByUserId = async (req, res, next) => {
  //in real project you will getting info from req
  const { userId } = req.params;

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      throw new AppError(404, "Bad Request", "User not found");
    }
    let foundUserTasks = await Task.find({
      assignee: userId,
      status: { $not: { $regex: "deleted" } },
    }).select("-assignee");
    foundUser._doc.tasks = foundUserTasks;
    console.log(foundUser);

    sendResponse(
      res,
      200,
      true,
      { user: foundUser },
      null,
      "Get Tasks success"
    );
  } catch (err) {
    next(err);
  }
};

//Update a foo
// userController.updateUserById = async (req, res, next) => {
//   //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
//   //you will also get updateInfo from req
//   // empty target and info mean update nothing
//   const targetId = null;
//   const updateInfo = "";

//   //options allow you to modify query. e.g new true return lastest update of data
//   const options = { new: true };
//   try {
//     //mongoose query
//     const updated = await User.findByIdAndUpdate(targetId, updateInfo, options);

//     sendResponse(res, 200, true, { data: updated }, null, "Update foo success");
//   } catch (err) {
//     next(err);
//   }
// };
// //Delete foo
// userController.deleteUserById = async (req, res, next) => {
//   //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication

//   // empty target mean delete nothing
//   const targetId = null;
//   //options allow you to modify query. e.g new true return lastest update of data
//   const options = { new: true };
//   try {
//     //mongoose query
//     const updated = await User.findByIdAndDelete(targetId, options);

//     sendResponse(res, 200, true, { data: updated }, null, "Delete foo success");
//   } catch (err) {
//     next(err);
//   }
// };

//export
module.exports = userController;
