const userModel = require("../models/userModel");
const { ObjectId } = require("mongoose").Types;

const getUsersLabors = async (req, res, next) => {
  const { jobNo } = req.params;
  console.log("###", jobNo);
  let allUsers;
  try {
    allUsers = await userModel.find({ "userLabor.job": jobNo });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  var allLabors = [];
  allUsers.forEach((item) => {
    if (item.userLabor.length) {
      console.log("fullname", item.fullname);
      item.userLabor.forEach((inner) => {
        allLabors = [
          {
            userManpower: inner,
            fullname: item.fullname,
            userId: item._id,
          },
          ...allLabors,
        ];
      });
    }
  });
  console.log("###", allLabors);
  res.json({
    allUserLabors: allLabors,
    error: false,
  });
};
const setCheckIn = async (req, res, next) => {
  const { checkInTime, jobNo, fullname, day, type, userId } = req.body;
  const { jobId } = req.params;

  var userLaborToBeEdited;
  try {
    userLaborToBeEdited = await userModel.findById({
      _id: userId,
    });
  } catch (error) {
    console.log(error);
  }
  userLaborToBeEdited.userLabor.forEach((el) => {
    if (el.job == jobNo && el._id == jobId) {
      if (day == "monday") {
        el.days.monday.checkedIn = checkInTime;
      }
      if (day == "tuesday") {
        el.days.tuesday.checkedIn = checkInTime;
      }
      if (day == "wednesday") {
        el.days.wednesday.checkedIn = checkInTime;
      }
      if (day == "thursday") {
        el.days.thursday.checkedIn = checkInTime;
      }
      if (day == "friday") {
        el.days.friday.checkedIn = checkInTime;
      }
      if (day == "saturday") {
        el.days.saturday.checkedIn = checkInTime;
      }
      if (day == "sunday") {
        el.days.sunday.checkedIn = checkInTime;
      }
    }
  });
  try {
    console.log("####", userLaborToBeEdited.userLabor[0]);
    await userLaborToBeEdited.save();
    res.json({ message: "Added", error: false });
  } catch (error) {
    console.log(error);
    res.json({ message: "Unable to Add", error: true });
  }
};
const setCheckOut = async (req, res) => {
  const { checkOutTime, jobNo, fullname, day, type, userId } = req.body;
  const { jobId } = req.params;
  console.log("##$$$", checkOutTime);
  var userLaborToBeEdited;
  try {
    userLaborToBeEdited = await userModel.findById({
      _id: userId,
    });
  } catch (error) {
    console.log(error);
  }
  userLaborToBeEdited.userLabor.forEach((el) => {
    if (el.job == jobNo && el._id == jobId) {
      if (day == "monday") {
        el.days.monday.checkedOut = checkOutTime;
      }
      if (day == "tuesday") {
        el.days.tuesday.checkedOut = checkOutTime;
      }
      if (day == "wednesday") {
        el.days.wednesday.checkedOut = checkOutTime;
      }
      if (day == "thursday") {
        el.days.thursday.checkedOut = checkOutTime;
      }
      if (day == "friday") {
        el.days.friday.checkedOut = checkOutTime;
      }
      if (day == "saturday") {
        el.days.saturday.checkedOut = checkOutTime;
      }
      if (day == "sunday") {
        el.days.sunday.checkedOut = checkOutTime;
      }
    }
  });
  try {
    console.log("####", userLaborToBeEdited.userLabor[0]);
    await userLaborToBeEdited.save();
    res.json({ message: "Added", error: false });
  } catch (error) {
    console.log(error);
    res.json({ message: "Unable to Add", error: true });
  }
};
const setLunchTime = async (req, res) => {
  const { lunchTimeStart, lunchTimeEnd, jobNo, fullname, day, type, userId } =
    req.body;
  const { jobId } = req.params;
  console.log("##$$$", lunchTimeStart, lunchTimeEnd);
  var userLaborToBeEdited;
  try {
    userLaborToBeEdited = await userModel.findById({
      _id: userId,
    });
  } catch (error) {
    console.log(error);
  }
  userLaborToBeEdited.userLabor.forEach((el) => {
    if (el.job == jobNo && el._id == jobId) {
      if (day == "monday") {
        el.days.monday.lunchTimeStart = lunchTimeStart;
        el.days.monday.lunchTimeEnd = lunchTimeEnd;
      }
      if (day == "tuesday") {
        el.days.tuesday.lunchTimeStart = lunchTimeStart;
        el.days.tuesday.lunchTimeEnd = lunchTimeEnd;
      }
      if (day == "wednesday") {
        el.days.wednesday.lunchTimeStart = lunchTimeStart;
        el.days.wednesday.lunchTimeEnd = lunchTimeEnd;
      }
      if (day == "thursday") {
        el.days.thursday.lunchTimeStart = lunchTimeStart;
        el.days.thursday.lunchTimeEnd = lunchTimeEnd;
      }
      if (day == "friday") {
        el.days.friday.lunchTimeStart = lunchTimeStart;
        el.days.friday.lunchTimeEnd = lunchTimeEnd;
      }
      if (day == "saturday") {
        el.days.saturday.lunchTimeStart = lunchTimeStart;
        el.days.saturday.lunchTimeEnd = lunchTimeEnd;
      }
      if (day == "sunday") {
        el.days.sunday.lunchTimeStart = lunchTimeStart;
        el.days.sunday.lunchTimeEnd = lunchTimeEnd;
      }
    }
  });
  try {
    console.log("####", userLaborToBeEdited.userLabor[0]);
    await userLaborToBeEdited.save();
    res.json({ message: "Added", error: false });
  } catch (error) {
    console.log(error);
    res.json({ message: "Unable to Add", error: true });
  }
};
exports.getUsersLabors = getUsersLabors;
exports.setCheckIn = setCheckIn;
exports.setCheckOut = setCheckOut;
exports.setLunchTime = setLunchTime;
