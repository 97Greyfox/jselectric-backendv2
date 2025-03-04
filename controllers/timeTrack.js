const timeTrackModel = require("../models/timeTrack");
const moment = require("moment");
const addTimeTrack = async (req, res, next) => {
  const {
    employee,
    jobDescription,
    phase,
    date,
    notes,
    startTime,
    endTime,
    lunch,
    spectrum,
    user,
    lunchTime,
    reimbursalFlag,
    reimbursal,
  } = req.body;
  const createTimeTrackModel = new timeTrackModel({
    employee,
    jobDescription,
    phase,
    date,
    notes,
    startTime,
    endTime,
    spectrum,
    user,
    lunch,
    lunchTime,
    reimbursalFlag,
    reimbursal,
  });
  console.log("#$#$#$#", reimbursal);
  try {
    await createTimeTrackModel.save();
  } catch (error) {
    res.json({ message: "Error adding Time Track", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTimeTrack = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  if (
    (startDate !== "" || endDate !== "") &&
    (startDate !== undefined || endDate !== undefined)
  ) {
    var timeTracks;
    if (
      moment(startDate).format("MM/DD/YYYY") ==
      moment(endDate).format("MM/DD/YYYY")
    ) {
      console.log("here");
      try {
        timeTracks = await timeTrackModel.find({
          date: {
            $regex: moment(startDate).format("YYYY-MM-DD"),
            $options: "i",
          },
        });
      } catch (error) {
        res.json({ message: "Error finding time Track", error: true });
        return next(error);
      }
      res.json({
        timeTracks: timeTracks.map((item) => item.toObject({ getters: true })),
        error: false,
      });
    } else {
      try {
        timeTracks = await timeTrackModel.find({
          date: {
            $gte: moment(startDate).format(),
            $lte: moment(endDate).format(),
          },
        });
      } catch (error) {
        res.json({ message: "Error finding time Track", error: true });
        return next(error);
      }
      res.json({
        timeTracks: timeTracks.map((item) => item.toObject({ getters: true })),
        error: false,
      });
    }
  } else {
    let timeTracks;
    try {
      timeTracks = await timeTrackModel.find({});
    } catch (error) {
      res.json({ message: "Error finding time Track", error: true });
      return next(error);
    }
    res.json({
      timeTracks: timeTracks.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
};
const editTimeTrack = async (req, res, next) => {
  const {
    employee,
    jobDescription,
    phase,
    date,
    startTime,
    endTime,
    spectrum,
    user,
    notes,
    lunch,
    lunchTime,
    reimbursalFlag,
    reimbursal,
  } = req.body;
  const { timeTrackId } = req.params;
  let timeTrackToBeEdited;
  try {
    timeTrackToBeEdited = await timeTrackModel.findById(timeTrackId);
  } catch (error) {
    res.json({ message: "Could not find the timeTrack", error: true });
    return next(error);
  }
  timeTrackToBeEdited.employee = employee;
  timeTrackToBeEdited.jobDescription = jobDescription;
  timeTrackToBeEdited.phase = phase;
  timeTrackToBeEdited.date = date;
  timeTrackToBeEdited.notes = notes;
  timeTrackToBeEdited.startTime = startTime;
  timeTrackToBeEdited.endTime = endTime;
  timeTrackToBeEdited.spectrum = spectrum;
  timeTrackToBeEdited.user = user;
  timeTrackToBeEdited.lunch = lunch;
  timeTrackToBeEdited.lunchTime = lunchTime;
  timeTrackToBeEdited.reimbursalFlag = reimbursalFlag;
  timeTrackToBeEdited.reimbursal = reimbursal;

  try {
    await timeTrackToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit time Track", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTimeTrack = async (req, res, next) => {
  const { timeTrackId } = req.params;
  try {
    await timeTrackModel.findByIdAndRemove(timeTrackId);
  } catch (error) {
    res.json({
      message: "Could not found the specific time track",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const getByEmp = async (req, res, next) => {
  const { search } = req.params;
  let allTimeTrack;
  try {
    allTimeTrack = await timeTrackModel.find({
      employee: { $regex: search, $options: "i" },
    });
  } catch (error) {
    res.json({ message: "Error finding time track list", error: true });
    return next(error);
  }
  res.json({
    timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getDataByJob = async (req, res, next) => {
  const { jobDescription } = req.params;
  let allTimeTrack;
  try {
    allTimeTrack = await timeTrackModel.find({
      jobDescription: { $regex: jobDescription, $options: "i" },
    });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
exports.addTimeTrack = addTimeTrack;
exports.getTimeTrack = getTimeTrack;
exports.editTimeTrack = editTimeTrack;
exports.deleteTimeTrack = deleteTimeTrack;
exports.getByEmp = getByEmp;
exports.getDataByJob = getDataByJob;
