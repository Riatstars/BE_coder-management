const { sendResponse, AppError } = require("../helpers/utils.js");

const Task = require("../models/Task.js");

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
        info.title = firstLetterCapital(`${info.title}`);
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
taskController.addReference = async (req, res, next) => {
  //in real project you will getting info from req
  const { targetName } = req.params;
  const { ref } = req.body;
  try {
    //always remember to control your inputs
    //in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process
    let found = await Task.findOne({ name: targetName });
    //add your check to control if boo is notfound
    const refFound = await Task.findById(ref);
    //add your check to control if foo is notfound
    found.assignee = ref;
    //mongoose query
    found = await found.save();
    sendResponse(res, 200, true, { data: found }, null, "Add assignee success");
  } catch (err) {
    next(err);
  }
};
taskController.getAllTasks = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  // empty filter mean get all
  let { status, ...sort } = req.query;
  let filter = {};
  const allowedSort = ["createAt", "updateAt"];
  const sortKeys = Object.keys(sort);
  console.log(sort);
  try {
    if (!!status) {
      filter = { status };
    }
    if (sort) {
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
    }
    console.log(sort);

    //mongoose query
    // const listOfFound = await Task.aggregate([
    //   { $match: filter },
    //   {
    //     $sort: sort,
    //   },
    //   { $limit: 3 },
    // ]).sort(sort);
    const listOfFound = await Task.find(filter, null, { limit: 10 }).sort(sort);
    console.log([
      { $match: filter },
      {
        $sort: sort,
      },
      {
        $limit: 3,
      },
    ]);
    // .sort(sort);
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

//export
module.exports = taskController;
