const { sendResponse, AppError } = require("../helpers/utils.js");

const Task = require("../models/Task.js");
const User = require("../models/User.js");

const taskController = {};
const allowedStatus = ["pending", "working", "review", "done", "archive"];

taskController.createTask = async (req, res, next) => {
  //in real project you will getting info from req
  let info = req.body;

  try {
    //always remember to control your inputs
    //check if body exist
    if (!info) throw new AppError(402, "Bad Request", "Create Task Error");
    //check if required fields exist
    if (info.title && info.description && info.status) {
      if (typeof info.title !== "string")
        throw new AppError(402, "Bad Request", "Create Task Error");
      if (!allowedStatus.includes(info.status)) {
        throw new AppError(402, "Bad Request", "Wrong status");
      }
    } else {
      throw new AppError(402, "Bad Request", "Create Task Error");
    }

    //in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process
    //mongoose query
    const created = await Task.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create Task Success"
    );
  } catch (err) {
    next(err);
  }
};
//updateboo
taskController.addAssignee = async (req, res, next) => {
  //in real project you will getting info from req
  const { taskId } = req.params;
  const { userId, option } = req.body;
  try {
    //always remember to control your inputs
    //in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process
    let found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    //add your check to control if boo is notfound
    const refFound = await User.findById(userId);
    if (!refFound) {
      throw new AppError(404, "Bad Request", "User not found");
    }
    if (option) {
      switch (option) {
        case "add":
          if (found.assignee) {
            throw new AppError(404, "Bad Request", "Already assigned");
          }
          found.assignee = userId;
          await found.save();
          sendResponse(
            res,
            200,
            true,
            { data: found },
            null,
            "Add assignee success"
          );
          break;
        case "delete":
          if (!found.assignee) {
            throw new AppError(
              404,
              "Bad Request",
              "Task has not been assigned yet"
            );
          } else {
            found.assignee = undefined;
            await found.save();
            sendResponse(
              res,
              200,
              true,
              { data: found },
              null,
              "Delete assignee success"
            );
          }

          break;
        default:
          throw new AppError(
            404,
            "Bad Request",
            "Please provide correct option"
          );
      }
    } else {
      throw new AppError(404, "Bad Request", "Please provide option");
    }
    //add your check to control if foo is notfound
    //mongoose query
  } catch (err) {
    next(err);
  }
};

taskController.getAllTasks = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  // empty filter mean get all
  let { status, ...sort } = req.query;
  let filter = {};
  const allowedSort = ["createdAt", "updatedAt"];
  const sortKeys = Object.keys(sort);
  try {
    const pipeline = [
      // { $limit: 3 },
    ];
    if (!!status) {
      filter = { status };
      pipeline.push({ $match: filter });
    } else {
      pipeline.push({ $match: { status: { $not: { $regex: "deleted" } } } });
    }
    if (sort == {}) {
      sortKeys.forEach((key) => {
        if (!allowedSort.includes(key)) {
          throw new AppError(402, "Bad Request", "Create Task Error");
        }
      });
      sortKeys.forEach((key) => {
        switch (sort[key]) {
          case "asc":
            sort[key] = 1;
            break;
          case "des":
            sort[key] = -1;
            break;
          default:
            break;
        }
      });
      pipeline.push({ $sort: sort });
    }
    console.log(pipeline);

    //mongoose query
    const listOfFound = await Task.aggregate(pipeline);

    //this to query data from the reference and append to found result.
    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of tasks success"
    );
  } catch (err) {
    next(err);
  }
};

taskController.getTaskById = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    if (found.status === "deleted") {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    sendResponse(res, 200, true, { data: found }, null, "Found task success");
  } catch (error) {
    next(error);
  }
};
taskController.deleteTaskById = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    if (found.status === "deleted") {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    found.status = "deleted";
    await found.save();
    sendResponse(res, 200, true, { data: found }, null, "Found task success");
  } catch (error) {
    next(error);
  }
};
taskController.updateTaskStatusById = async (req, res, next) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const allowedStatus = ["pending", "working", "review", "done", "archive"];
  try {
    if (!status)
      throw new AppError(402, "Bad Request", "Please provide new status");
    if (!allowedStatus.includes(status)) {
      throw new AppError(402, "Bad Request", "Please provide correct status");
    }

    const found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    if (found.status === "done" && status !== "archive") {
      throw new AppError(
        402,
        "Bad Request",
        "This task could only be archived"
      );
    }
    if (found.status === "archive" && status !== "archive") {
      throw new AppError(402, "Bad Request", "This task has been archived");
    }
    if (found.status === "deleted") {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    found.status = status;
    await found.save();

    sendResponse(res, 200, true, { data: found }, null, "Found task success");
  } catch (error) {
    next(error);
  }
};
//export
module.exports = taskController;
