const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");
const fs = require("fs");
const { uploadFile, getFile } = require("../s3");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
// const { options } = require("../routes/users");
dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const { v4: uuidv4 } = require("uuid");
const addTask = async (req, res, next) => {
  const {
    currentDate,
    user,
    taskCategory,
    dueDate,
    description,
    taskStatus,
    assignedTo,
    selectedModule,
    taskPriority,
    moduleArr,
    updated,
  } = req.body;
  const createTaskModel = new taskModel({
    currentDate,
    user,
    taskCategory,
    dueDate,
    description,
    taskStatus,
    assignedTo,
    attachments: [],
    subTasks: [],
    notes: [],
    selectedModule,
    taskPriority,
    moduleArr,
    lastUpdated: new Date(),
    updated,
  });

  try {
    assignedTo.forEach(async (el) => {
      if (el.email !== undefined) {
        try {
          await userModel.findOneAndUpdate(
            { email: `${el.email}` },
            {
              $push: {
                userTasks: createTaskModel,
              },
            }
          );
        } catch (error) {
          res.json({ message: "Could not add the Task to Users", error: true });
          return next(error);
        }
      } else {
        try {
          await userModel.findOneAndUpdate(
            { fullname: `${el.fullname}` },
            {
              $push: {
                userTasks: createTaskModel,
              },
            }
          );
        } catch (error) {
          res.json({ message: "Could not add the Task to Users", error: true });
          return next(error);
        }
      }
    });
    await createTaskModel.save();
  } catch (error) {
    res.json({ message: "Error adding Task", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTask = async (req, res, next) => {
  const { taskCategory, currentDate, description } = req.query;
  if (
    taskCategory !== undefined ||
    currentDate !== undefined ||
    description !== undefined
  ) {
    let allTasks;
    try {
      allTasks = await taskModel.find({
        taskCategory: {
          $regex: taskCategory !== undefined ? taskCategory : "",
          $options: "i",
        },
        currentDate: {
          $regex: currentDate !== undefined ? currentDate : "",
          $options: "i",
        },
        description: {
          $regex: description !== undefined ? description : "",
          $options: "i",
        },
      });
    } catch (error) {
      res.json({ message: "Error finding Tasks list", error: true });
      return next(error);
    }
    res.json({
      allTasks: allTasks.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  } else {
    let allTasks;
    try {
      allTasks = await taskModel.find({});
    } catch (error) {
      res.json({ message: "Error finding Tasks list", error: true });
      return next(error);
    }
    res.json({
      allTasks: allTasks.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
};
const getTaskById = async (req, res, next) => {
  const { taskId } = req.query;
  console.log(taskId);
  let allTasks;
  try {
    allTasks = await taskModel.find({ _id: taskId });
  } catch (error) {
    res.json({ message: "Error finding Tasks list", error: true });
    return next(error);
  }
  res.json({
    allTasks: allTasks.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};

const editTask = async (req, res, next) => {
  const {
    currentDate,
    user,
    taskCategory,
    dueDate,
    description,
    taskStatus,
    assignedTo,
    selectedModule,
    moduleArr,
    attachments,
    subTasks,
    taskPriority,
    notes,
    updated,
  } = req.body;
  const { taskId } = req.params;
  var taskToBeEdited;
  var userTaskToBeEdited;
  var filteredTask;
  try {
    taskToBeEdited = await taskModel.findById(taskId);
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  console.log("taskToBeEdited", taskToBeEdited._id);
  try {
    userTaskToBeEdited = await userModel.find({
      "userTasks._id": taskToBeEdited._id,
    });
  } catch (error) {
    console.log("error", error);
  }

  taskToBeEdited.currentDate = currentDate;
  taskToBeEdited.user = user;
  taskToBeEdited.taskCategory = taskCategory;
  taskToBeEdited.dueDate = dueDate;
  taskToBeEdited.description = description;
  taskToBeEdited.taskStatus = taskStatus;
  taskToBeEdited.assignedTo = assignedTo;
  taskToBeEdited.selectedModule = selectedModule;
  taskToBeEdited.moduleArr = moduleArr;
  taskToBeEdited.attachments = attachments;
  taskToBeEdited.subTasks = subTasks;
  taskToBeEdited.notes = notes;
  taskToBeEdited.taskPriority = taskPriority;
  taskToBeEdited.lastUpdated = new Date();
  taskToBeEdited.updated = updated;
  userTaskToBeEdited.forEach((el) => {
    filteredTask = el.userTasks.find(
      (i) => i._id.toString() == taskToBeEdited._id.toString()
    );
  });
  console.log("userTaskToBeEdited", userTaskToBeEdited);
  console.log("##@@$$", assignedTo);
  console.log("##filteredTask", filteredTask);
  var assignedToEmails = assignedTo.map((i) => i.email);
  var currentTaskEmails = filteredTask.assignedTo.map((i) => i.email);
  var remUserEmails = currentTaskEmails.filter(function (obj) {
    return assignedToEmails.indexOf(obj) == -1;
  });
  var newUserEmails = assignedToEmails.filter(function (obj) {
    return currentTaskEmails.indexOf(obj) == -1;
  });
  if (remUserEmails.length > 0) {
    currentTaskEmails = currentTaskEmails.filter(function (obj) {
      return remUserEmails.indexOf(obj) == -1;
    });
  }
  console.log("remUser", remUserEmails);
  console.log("newUser", newUserEmails);
  console.log("currentTaskEmail", currentTaskEmails);
  if (newUserEmails.length > 0) {
    try {
      newUserEmails.forEach(async (el) => {
        try {
          await userModel.findOneAndUpdate(
            { email: `${el}` },
            {
              $push: {
                userTasks: taskToBeEdited,
              },
            }
          );
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  if (remUserEmails.length > 0) {
    remUserEmails.forEach(async (i) => {
      console.log("here", i, taskToBeEdited._id);
      try {
        await userModel.updateOne(
          { email: i },
          {
            $pull: {
              userTasks: { _id: taskToBeEdited._id },
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  }
  if (currentTaskEmails.length > 0) {
    currentTaskEmails.forEach(async (i) => {
      try {
        await userModel.findOneAndUpdate(
          { email: i, "userTasks._id": taskToBeEdited._id },
          { $set: { "userTasks.$": taskToBeEdited } }
        );
      } catch (error) {
        console.log(error);
      }
    });
  }
  try {
  } catch (error) {
    console.log(error);
  }
  try {
    await taskToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTask = async (req, res, next) => {
  const { taskId } = req.params;
  var allTasks;
  try {
    allTasks = await taskModel.findById(taskId);
  } catch (error) {
    console.log(error);
  }

  console.log("###", allTasks);

  const remUserEmails = allTasks.assignedTo.map((i) => i.email);
  console.log("@@@@", remUserEmails);
  remUserEmails.forEach(async (i) => {
    console.log("here", i, allTasks._id);
    try {
      await userModel.updateOne(
        { email: i },
        {
          $pull: {
            userTasks: { _id: allTasks._id },
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
  try {
    await taskModel.findByIdAndRemove(taskId);
  } catch (error) {
    res.json({ message: "Could not found the specific task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addSubTask = async (req, res, next) => {
  const {
    currentDate,
    user,
    taskCategory,
    dueDate,
    description,
    taskStatus,
    assignedTo,
    updated,
  } = req.body;
  const { taskId } = req.params;
  let taskToBeEdited;
  try {
    taskToBeEdited = await taskModel.findById(taskId);
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  taskToBeEdited.lastUpdated = new Date();
  taskToBeEdited.updated = updated;
  try {
    await taskModel.findOneAndUpdate(
      { _id: taskId },
      {
        $push: {
          subTasks: {
            currentDate,
            user,
            taskCategory,
            dueDate,
            description,
            taskStatus,
            assignedTo,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not add the sub task", error: true });
    return next(error);
  }
  try {
    await taskToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Sub Task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};

const editSubTask = async (req, res, next) => {
  let taskToBeEdited;
  const {
    currentDate,
    user,
    taskCategory,
    dueDate,
    description,
    taskStatus,
    assignedTo,
    updated,
  } = req.body;
  const { taskId, subTaskId } = req.params;
  try {
    taskToBeEdited = await taskModel.findById(taskId);
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  taskToBeEdited.lastUpdated = new Date();
  taskToBeEdited.updated = updated;
  taskToBeEdited.subTasks.forEach((i) => {
    if (i.id == subTaskId) {
      i.currentDate = currentDate;
      i.user = user;
      i.taskCategory = taskCategory;
      i.dueDate = dueDate;
      i.taskStatus = taskStatus;
      i.description = description;
      i.assignedTo = assignedTo;
    }
  });
  try {
    await taskToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Sub Task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const delSubTasks = async (req, res, next) => {
  const { taskId, subTaskId } = req.params;
  try {
    await taskModel.updateOne(
      { _id: taskId },
      {
        $pull: {
          subTasks: { _id: subTaskId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addTaskNotes = async (req, res, next) => {
  const {
    currentDate,
    user,
    noteCategory,
    dueDate,
    description,
    noteStatus,
    updated,
  } = req.body;
  const { taskId } = req.params;
  let taskToBeEdited;
  try {
    taskToBeEdited = await taskModel.findById(taskId);
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  taskToBeEdited.lastUpdated = new Date();
  taskToBeEdited.updated = updated;
  try {
    await taskModel.updateOne(
      { _id: taskId },
      {
        $push: {
          notes: {
            currentDate,
            user,
            noteCategory,
            dueDate,
            description,
            noteStatus,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not add the Notes", error: true });
    return next(error);
  }
  try {
    await taskToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Sub Task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};
const editTaskNotes = async (req, res, next) => {
  const {
    currentDate,
    user,
    noteCategory,
    dueDate,
    description,
    noteStatus,
    updated,
  } = req.body;
  const { taskId, noteId } = req.params;
  try {
    taskToBeEdited = await taskModel.findById(taskId);
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  taskToBeEdited.lastUpdated = new Date();
  taskToBeEdited.updated = updated;
  taskToBeEdited.notes.forEach((i) => {
    if (i.id == noteId) {
      i.currentDate = currentDate;
      i.user = user;
      i.noteCategory = noteCategory;
      i.dueDate = dueDate;
      i.noteStatus = noteStatus;
      i.description = description;
    }
  });
  try {
    await taskToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Notes", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const delTaskNote = async (req, res, next) => {
  const { taskId, noteId } = req.params;
  try {
    await taskModel.updateOne(
      { _id: taskId },
      {
        $pull: {
          notes: { _id: noteId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the Note", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};

const addFiles = async (req, res, next) => {
  const { date, user, note, attachmentCategories } = req.body;
  const { taskId } = req.params;
  const files = req.files;
  var arr = [];
  try {
    let i = 0;
    while (i < files.length) {
      await uploadToS3(files[i])
        .then((res) => {
          arrReturn(res, arr);
        })
        .catch((err) => console.log(err));
      i++;
    }
    await taskModel.updateOne(
      { _id: taskId },
      {
        $push: {
          attachments: {
            date: date,
            user: user,
            note: note,
            attachmentCategories: attachmentCategories,
            files: arr,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};
const arrReturn = (item, arr) => {
  arr.push(item);
};
const editFiles = async (req, res, next) => {
  const { taskId } = req.params;
  const {
    date,
    user,
    id,
    newFileFlag,
    editFlag,
    oldFiles,
    note,
    attachmentCategories,
  } = req.body;
  const files = req.files;
  let taskToBeEdited;
  if (newFileFlag === "true") {
    var arr = [];
    const prevFileArr = JSON.parse(oldFiles);
    try {
      prevFileArr.forEach((item) => {
        deleteAwsObj(item);
      });
    } catch (error) {
      console.log(error);
    }
    try {
      let i = 0;
      while (i < files.length) {
        await uploadToS3(files[i])
          .then((res) => {
            arrReturn(res, arr);
          })
          .catch((err) => console.log(err));
        i++;
      }
    } catch (error) {
      console.log(error);
    }
    try {
      taskToBeEdited = await taskModel.findById(taskId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    taskToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.date = date;
        i.user = user;
        i.note = note;
        i.attachmentCategories = attachmentCategories;
        i.files = arr;
      }
    });
    try {
      await taskToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit task", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const prevFileArr = JSON.parse(oldFiles);
    try {
      taskToBeEdited = await taskModel.findById(taskId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    taskToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.date = date;
        i.user = user;
        i.note = note;
        i.attachmentCategories = attachmentCategories;
        i.files = prevFileArr;
      }
    });
    try {
      await taskToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit task", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const deleteAwsObj = async (obj) => {
  console.log("here in deleAWs", obj);

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: obj.filename,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log("@@@@@!!!!!", err), reject(err);
      }
      return resolve(data);
    });
  });
};
const delFiles = async (req, res, next) => {
  const { taskId, attachmentId } = req.params;
  const { oldFiles } = req.body;
  try {
    oldFiles.forEach((item) => {
      deleteAwsObj(item);
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  try {
    await taskModel.updateOne(
      { _id: taskId },
      {
        $pull: {
          attachments: { _id: attachmentId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};

const uploadToS3 = (file) => {
  console.log("here in uploadS3", file);

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `js-electric-app`,
      Key: `${momentObj().format("hh:mm:ss")}-${file.originalname}`,
      Body: file.buffer,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log("@@!!!!!!@#!#!@#!@#@#@!#!@# file", err), reject(err);
      }
      const dataObj = {
        fileUrl: data.Location,
        filename: data.Key,
      };
      return resolve(dataObj);
    });
  });
};
exports.addTask = addTask;
exports.getTask = getTask;
exports.getTaskById = getTaskById;
exports.editTask = editTask;
exports.deleteTask = deleteTask;
exports.addSubTask = addSubTask;
exports.editSubTask = editSubTask;
exports.delSubTasks = delSubTasks;
exports.addTaskNotes = addTaskNotes;
exports.editTaskNotes = editTaskNotes;
exports.delTasksNotes = delTaskNote;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
