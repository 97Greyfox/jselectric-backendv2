const userModel = require("../models/userModel");
const fs = require("fs");
const { uploadFile, getFile } = require("../s3");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
const { options } = require("../routes/users");
dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addUser = async (req, res, next) => {
  const {
    userType,
    position,
    vehicle,
    creditCard,
    tablet,
    city,
    primaryAddress,
    secondaryAddress,
    state,
    zipcode,
    fullname,
    email,
    personalPhone,
    companyPhone,
    username,
    password,
    userStatus,
  } = req.body;
  const createUserModel = new userModel({
    userType,
    position,
    vehicle,
    tablet,
    city,
    primaryAddress,
    secondaryAddress,
    state,
    zipcode,
    fullname,
    email,
    creditCard,
    personalPhone,
    companyPhone,
    username,
    password,
    userStatus,
    taskNotification: false,
    taskEmailNotification: false,
    userTasks: [],
    badges: [],
  });
  try {
    await createUserModel.save();
  } catch (error) {
    res.json({ message: "Error adding User", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await userModel.find({});
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editUser = async (req, res, next) => {
  const {
    userType,
    position,
    vehicle,
    tablet,
    creditCard,
    city,
    primaryAddress,
    secondaryAddress,
    state,
    zipcode,
    fullname,
    email,
    personalPhone,
    companyPhone,
    username,
    password,
    userStatus,
  } = req.body;
  const { userId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  console.log(creditCard);
  userToBeEdited.position = position;
  userToBeEdited.vehicle = vehicle;
  userToBeEdited.tablet = tablet;
  userToBeEdited.city = city;
  userToBeEdited.fullname = fullname;
  userToBeEdited.email = email;
  userToBeEdited.personalPhone = personalPhone;
  userToBeEdited.companyPhone = companyPhone;
  userToBeEdited.username = username;
  userToBeEdited.password = password;
  userToBeEdited.userType = userType;
  userToBeEdited.creditCard = creditCard;
  userToBeEdited.primaryAddress = primaryAddress;
  userToBeEdited.secondaryAddress = secondaryAddress;
  userToBeEdited.state = state;
  userToBeEdited.zipcode = zipcode;
  userToBeEdited.userStatus = userStatus;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit user", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setTaskNotification = async (req, res, next) => {
  const { taskNotification } = req.body;
  const { userId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.taskNotification = taskNotification;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({
      message: "Enable to Change Task Notification Status",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({
    message: "Task Notification status updated successfully",
    error: false,
  });
};
const setTaskEmailNotification = async (req, res, next) => {
  const { taskEmailNotification } = req.body;
  const { userId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.taskEmailNotification = taskEmailNotification;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({
      message: "Enable to Change Task Email Notification Status",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({
    message: "Task Email Notification status updated successfully",
    error: false,
  });
};
const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await userModel.findByIdAndRemove(userId);
  } catch (error) {
    res.json({ message: "Could not found the specific user", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  let userInfo;
  try {
    userInfo = await userModel.findOne({
      username: username,
      password: password,
    });
  } catch (error) {
    res.json({
      message: "Wrong Credentials check your username or password",
      error: true,
    });
  }
  if (userInfo == null) {
    res.json({
      message: "Wrong Credentials check your username or password",
      error: true,
    });
  } else {
    res.json({
      userInfo: {
        fullname: userInfo.fullname,
        id: userInfo.toObject({ getters: true }).id,
        userType: userInfo.userType,
        email: userInfo.email,
        taskNotification: userInfo.taskNotification,
        taskEmailNotification: userInfo.taskEmailNotification,
      },
      error: false,
    });
  }
};
const addBadges = async (req, res, next) => {
  const { userId } = req.params;
  const {
    AISD,
    AISDExpDate,
    COAWaterDep,
    COAWaterDepExpDate,
    TFC,
    TFCExpDate,
    ABIA,
    ABIAExpDate,
  } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the unit", error: true });
    return next(error);
  }
  userToBeEdited.badges.AISD = AISD;
  userToBeEdited.badges.AISDExpDate = AISDExpDate;
  userToBeEdited.badges.COAWaterDep = COAWaterDep;
  userToBeEdited.badges.COAWaterDepExpDate = COAWaterDepExpDate;
  userToBeEdited.badges.TFC = TFC;
  userToBeEdited.badges.TFCExpDate = TFCExpDate;
  userToBeEdited.badges.ABIA = ABIA;
  userToBeEdited.badges.ABIAExpDate = ABIAExpDate;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit user", error: true });
    return next(error);
  }
  res.status(201).json({
    message: "Edited successfully",
    error: false,
    userInd: userToBeEdited,
  });
};
const editBadges = async (req, res, next) => {
  const { userId } = req.params;
  const {
    AISD,
    AISDExpDate,
    COAWaterDep,
    COAWaterDepExpDate,
    TFC,
    TFCExpDate,
    ABIA,
    ABIAExpDate,
  } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the unit", error: true });
    return next(error);
  }
  userToBeEdited.badges.AISD = AISD;
  userToBeEdited.badges.AISDExpDate = AISDExpDate;
  userToBeEdited.badges.COAWaterDep = COAWaterDep;
  userToBeEdited.badges.COAWaterDepExpDate = COAWaterDepExpDate;
  userToBeEdited.badges.TFC = TFC;
  userToBeEdited.badges.TFCExpDate = TFCExpDate;
  userToBeEdited.badges.ABIA = ABIA;
  userToBeEdited.badges.ABIAExpDate = ABIAExpDate;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit user", error: true });
    return next(error);
  }
  res.status(201).json({
    message: "Edited successfully",
    error: false,
    userInd: userToBeEdited,
  });
};
const addNotes = async (req, res, next) => {
  const { date, time, note, user } = req.body;
  const { userId } = req.params;
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          notes: { note: note, date: date, time: time, user: user },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const editNotes = async (req, res, next) => {
  const { userId } = req.params;
  const { note, date, time, user, id } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.notes.forEach((i) => {
    if (i._id == id) {
      i.note = note;
      i.date = date;
      i.time = time;
      i.user = user;
    }
  });
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit notes", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const delNotes = async (req, res, next) => {
  const { userId, noteId } = req.params;
  console.log("this is ind id", noteId);
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          notes: { _id: noteId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const addFiles = async (req, res, next) => {
  const { date, time, user, note, attachmentCategories } = req.body;
  const { userId } = req.params;
  const files = req.files;
  var arr = [];
  try {
    let i = 0;
    let userToBeEdited;
    while (i < files.length) {
      await uploadToS3(files[i])
        .then((res) => {
          arrReturn(res, arr);
        })
        .catch((err) => console.log(err));
      i++;
    }
    await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          attachments: {
            note: note,
            date: date,
            time: time,
            user: user,
            files: arr,
            attachmentCategories: attachmentCategories,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const arrReturn = (item, arr) => {
  arr.push(item);
};
const editFiles = async (req, res, next) => {
  const { userId } = req.params;
  const {
    note,
    date,
    time,
    user,
    id,
    newFileFlag,
    editFlag,
    oldFiles,
    attachmentCategories,
  } = req.body;
  const files = req.files;
  let userToBeEdited;
  if (newFileFlag === "true") {
    console.log("here in true");
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
      userToBeEdited = await userModel.findById(userId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    console.log("*****", arr);
    userToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.note = note;
        i.date = date;
        i.time = time;
        i.user = user;
        i.files = arr;
        i.attachmentCategories = attachmentCategories;
      }
    });
    try {
      await userToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit notes", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const prevFileArr = JSON.parse(oldFiles);
    console.log("@@@$$$ here", prevFileArr, newFileFlag);
    try {
      userToBeEdited = await userModel.findById(userId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    userToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.note = note;
        i.date = date;
        i.time = time;
        i.user = user;
        i.files = prevFileArr;
        i.attachmentCategories = attachmentCategories;
      }
    });
    try {
      await userToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit notes", error: true });
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
  const { userId, attachmentId } = req.params;
  const { oldFiles } = req.body;
  try {
    oldFiles.forEach((item) => {
      deleteAwsObj(item);
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          attachments: { _id: attachmentId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
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
const getUserByName = async (req, res, next) => {
  const { name } = req.params;
  let allUsers;
  try {
    allUsers = await userModel.find({
      fullname: { $regex: name, $options: "i" },
    });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getUserByPosition = async (req, res, next) => {
  const { position } = req.params;
  let allUsers;
  try {
    allUsers = await userModel.find({
      position: { $regex: position, $options: "i" },
    });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const addSchedule = async (req, res, next) => {
  const { date, startTime, endTime, title } = req.body;
  const { userId } = req.params;
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          schedules: {
            date: date,
            startTime: startTime,
            endTime: endTime,
            title: title,
          },
        },
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occured while adding schedule", error: true });
    return next(error);
  }
  res.json({ message: "added schedule", error: false });
};
const editSchedule = async (req, res, next) => {
  const { userId } = req.params;
  const { date, startTime, endTime, title, id } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.schedules.forEach((i) => {
    if (i._id == id) {
      i.date = date;
      i.startTime = startTime;
      i.endTime = endTime;
      i.title = title;
    }
  });
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Schedule", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const delSchedule = async (req, res, next) => {
  const { userId, scheduleId } = req.params;
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          schedules: { _id: scheduleId },
        },
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occured while adding schedule", error: true });
    return next(error);
  }
  res.json({ message: "added schedule", error: false });
};
const assignForeman = async (req, res, next) => {
  const { userForemanObj, oldForeman } = req.body;
  if (oldForeman !== undefined) {
    try {
      oldForeman.forEach((el) => {
        userModel
          .updateOne(
            { fullname: `${el.fullname}` },
            {
              $pull: {
                userLabor: {
                  job: `${userForemanObj.job}`,
                  foreman: true,
                  manpowerId: `${userForemanObj.manpowerId}`,
                },
              },
            }
          )
          .then((result) => {
            if (result.nModified > 0) {
              console.log("User updated successfully");
            } else {
              console.log("User not found");
            }
          });
      });
    } catch (error) {
      console.log(error);
    }
    if (userForemanObj.foreman && userForemanObj.foreman.length) {
      console.log("####");
      try {
        userForemanObj.foreman.forEach((el) => {
          userModel
            .findOneAndUpdate(
              { fullname: `${el.fullname}` },
              {
                $push: {
                  userLabor: {
                    job: userForemanObj.job,
                    startDate: userForemanObj.startDate,
                    endDate: userForemanObj.endDate,
                    foreman: true,
                    shiftStartTime: userForemanObj.shiftStartTime,
                    shiftEndTime: userForemanObj.shiftEndTime,
                    days: userForemanObj.days,
                    manpowerId: userForemanObj.manpowerId,
                  },
                },
              }
            )
            .then((result) => {
              console.log("after update", result.nModified);
            });
        });
      } catch (error) {
        console.log(error);
      }
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  } else {
    if (userForemanObj.foreman.length) {
      userForemanObj.foreman.forEach(async (element) => {
        try {
          await userModel.findOneAndUpdate(
            { fullname: element.fullname },
            {
              $push: {
                userLabor: {
                  job: userForemanObj.job,
                  startDate: userForemanObj.startDate,
                  endDate: userForemanObj.endDate,
                  foreman: true,
                  shiftStartTime: userForemanObj.shiftStartTime,
                  shiftEndTime: userForemanObj.shiftEndTime,
                  days: userForemanObj.days,
                  manpowerId: userForemanObj.manpowerId,
                },
              },
            }
          );
          // res
          //   .status(201)
          //   .json({ message: "Assigned successfully", error: false });
        } catch (error) {
          res
            .status(201)
            .json({ message: "Something went wrong try again", error: true });
          return;
        }
      });
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  }
};
const assignJourneyman = (req, res, next) => {
  const { userJourneymanObj, oldJourneyman } = req.body;
  if (oldJourneyman !== undefined) {
    try {
      oldJourneyman.forEach((el) => {
        userModel
          .updateOne(
            { fullname: `${el.fullname}` },
            {
              $pull: {
                userLabor: {
                  job: `${userJourneymanObj.job}`,
                  journeyman: true,
                  manpowerId: `${userJourneymanObj.manpowerId}`,
                },
              },
            }
          )
          .then((result) => {
            if (result.nModified > 0) {
              console.log("User updated successfully");
            } else {
              console.log("User not found");
            }
          });
      });
    } catch (error) {
      console.log(error);
    }
    if (userJourneymanObj.journeyman && userJourneymanObj.journeyman.length) {
      try {
        userJourneymanObj.journeyman.forEach((el) => {
          userModel
            .findOneAndUpdate(
              { fullname: `${el.fullname}` },
              {
                $push: {
                  userLabor: {
                    job: userJourneymanObj.job,
                    startDate: userJourneymanObj.startDate,
                    endDate: userJourneymanObj.endDate,
                    journeyman: true,
                    shiftStartTime: userJourneymanObj.shiftStartTime,
                    shiftEndTime: userJourneymanObj.shiftEndTime,
                    days: userJourneymanObj.days,
                    manpowerId: userJourneymanObj.manpowerId,
                  },
                },
              }
            )
            .then((result) => {
              console.log("after update", result.nModified);
            });
        });
      } catch (error) {
        console.log(error);
      }
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  } else {
    if (userJourneymanObj.journeyman.length) {
      userJourneymanObj.journeyman.forEach(async (element) => {
        try {
          await userModel.findOneAndUpdate(
            { fullname: element.fullname },
            {
              $push: {
                userLabor: {
                  job: userJourneymanObj.job,
                  startDate: userJourneymanObj.startDate,
                  endDate: userJourneymanObj.endDate,
                  journeyman: true,
                  shiftStartTime: userJourneymanObj.shiftStartTime,
                  shiftEndTime: userJourneymanObj.shiftEndTime,
                  days: userJourneymanObj.days,
                  manpowerId: userJourneymanObj.manpowerId,
                },
              },
            }
          );
          // res
          //   .status(201)
          //   .json({ message: "Assigned successfully", error: false });
        } catch (error) {
          res
            .status(201)
            .json({ message: "Something went wrong try again", error: true });
          return;
        }
      });
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  }
};
const assignApprentice = (req, res, next) => {
  const { userApprenticeObj, oldApprentice } = req.body;
  if (oldApprentice !== undefined) {
    try {
      oldApprentice.forEach((el) => {
        userModel
          .updateOne(
            { fullname: `${el.fullname}` },
            {
              $pull: {
                userLabor: {
                  job: `${userApprenticeObj.job}`,
                  apprentice: true,
                  manpowerId: `${userApprenticeObj.manpowerId}`,
                },
              },
            }
          )
          .then((result) => {
            if (result.nModified > 0) {
              console.log("User updated successfully");
            } else {
              console.log("User not found");
            }
          });
      });
    } catch (error) {
      console.log(error);
    }
    if (userApprenticeObj.apprentice && userApprenticeObj.apprentice.length) {
      try {
        userApprenticeObj.apprentice.forEach((el) => {
          userModel
            .findOneAndUpdate(
              { fullname: `${el.fullname}` },
              {
                $push: {
                  userLabor: {
                    job: userApprenticeObj.job,
                    startDate: userApprenticeObj.startDate,
                    endDate: userApprenticeObj.endDate,
                    apprentice: true,
                    shiftStartTime: userApprenticeObj.shiftStartTime,
                    shiftEndTime: userApprenticeObj.shiftEndTime,
                    days: userApprenticeObj.days,
                    manpowerId: userApprenticeObj.manpowerId,
                  },
                },
              }
            )
            .then((result) => {
              console.log("after update", result.nModified);
            });
        });
      } catch (error) {
        console.log(error);
      }
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  } else {
    if (userApprenticeObj.apprentice.length) {
      userApprenticeObj.apprentice.forEach(async (element) => {
        try {
          await userModel.findOneAndUpdate(
            { fullname: element.fullname },
            {
              $push: {
                userLabor: {
                  job: userApprenticeObj.job,
                  startDate: userApprenticeObj.startDate,
                  endDate: userApprenticeObj.endDate,
                  apprentice: true,
                  shiftStartTime: userApprenticeObj.shiftStartTime,
                  shiftEndTime: userApprenticeObj.shiftEndTime,
                  days: userApprenticeObj.days,
                  manpowerId: userApprenticeObj.manpowerId,
                },
              },
            }
          );
          // res
          //   .status(201)
          //   .json({ message: "Assigned successfully", error: false });
        } catch (error) {
          res
            .status(201)
            .json({ message: "Something went wrong try again", error: true });
          return;
        }
      });
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  }
};
const assignConstruction = (req, res, next) => {
  const { userConstructionObj, oldConstruction } = req.body;
  if (oldConstruction !== undefined) {
    try {
      oldConstruction.forEach((el) => {
        userModel
          .updateOne(
            { fullname: `${el.fullname}` },
            {
              $pull: {
                userLabor: {
                  job: `${userConstructionObj.job}`,
                  construction: true,
                  manpowerId: `${userConstructionObj.manpowerId}`,
                },
              },
            }
          )
          .then((result) => {
            if (result.nModified > 0) {
              console.log("User updated successfully");
            } else {
              console.log("User not found");
            }
          });
      });
    } catch (error) {
      console.log(error);
    }
    if (
      userConstructionObj.construction &&
      userConstructionObj.construction.length
    ) {
      try {
        userConstructionObj.construction.forEach((el) => {
          userModel
            .findOneAndUpdate(
              { fullname: `${el.fullname}` },
              {
                $push: {
                  userLabor: {
                    job: userConstructionObj.job,
                    startDate: userConstructionObj.startDate,
                    endDate: userConstructionObj.endDate,
                    construction: true,
                    shiftStartTime: userConstructionObj.shiftStartTime,
                    shiftEndTime: userConstructionObj.shiftEndTime,
                    days: userConstructionObj.days,
                    manpowerId: userConstructionObj.manpowerId,
                  },
                },
              }
            )
            .then((result) => {
              console.log("after update", result.nModified);
            });
        });
      } catch (error) {
        console.log(error);
      }
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  } else {
    if (userConstructionObj.construction.length) {
      userConstructionObj.construction.forEach(async (element) => {
        try {
          await userModel.findOneAndUpdate(
            { fullname: element.fullname },
            {
              $push: {
                userLabor: {
                  job: userConstructionObj.job,
                  startDate: userConstructionObj.startDate,
                  endDate: userConstructionObj.endDate,
                  construction: true,
                  shiftStartTime: userConstructionObj.shiftStartTime,
                  shiftEndTime: userConstructionObj.shiftEndTime,
                  days: userConstructionObj.days,
                  manpowerId: userConstructionObj.manpowerId,
                },
              },
            }
          );
          // res
          //   .status(201)
          //   .json({ message: "Assigned successfully", error: false });
        } catch (error) {
          res
            .status(201)
            .json({ message: "Something went wrong try again", error: true });
          return;
        }
      });
    }
    res.status(201).json({ message: "Assigned successfully", error: false });
  }
};

exports.addUser = addUser;
exports.getUsers = getUsers;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.addBadges = addBadges;
exports.editBadges = editBadges;
exports.addNotes = addNotes;
exports.editNotes = editNotes;
exports.delNotes = delNotes;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
exports.getUserByName = getUserByName;
exports.getUserByPosition = getUserByPosition;
exports.addSchedule = addSchedule;
exports.delSchedule = delSchedule;
exports.editSchedule = editSchedule;
exports.setTaskNotification = setTaskNotification;
exports.setTaskEmailNotification = setTaskEmailNotification;
exports.assignForeman = assignForeman;
exports.assignJourneyman = assignJourneyman;
exports.assignApprentice = assignApprentice;
exports.assignConstruction = assignConstruction;
