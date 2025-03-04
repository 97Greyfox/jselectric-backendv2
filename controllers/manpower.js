const manpowerModel = require("../models/manpowerModel");
const userModel = require("../models/userModel");

const addManpower = async (req, res, next) => {
  const {
    job,
    startDate,
    endDate,
    shiftStartTime,
    shiftEndTime,
    notes,
    days: { monday, tuesday, wednesday, thursday, friday },
    requiredEmp,
  } = req.body;
  const createmanpowerModel = new manpowerModel({
    job,
    startDate,
    endDate,
    shiftStartTime,
    shiftEndTime,
    notes,
    days: {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
    },
    requiredEmp: {
      foreman: { noOfEmp: requiredEmp.foreman },
      journeyman: { noOfEmp: requiredEmp.journeyman },
      apprentice: { noOfEmp: requiredEmp.apprentice },
      construction: { noOfEmp: requiredEmp.construction },
    },
    assignedEmp: {
      foreman: { noOfEmp: 0, employees: [] },
      journeyman: { noOfEmp: 0, employees: [] },
      apprentice: { noOfEmp: 0, employees: [] },
      construction: { noOfEmp: 0, employees: [] },
    },
    workingEmp: {
      foreman: { noOfEmp: 0, employees: [] },
      journeyman: { noOfEmp: 0, employees: [] },
      apprentice: { noOfEmp: 0, employees: [] },
      construction: { noOfEmp: 0, employees: [] },
    },
  });
  try {
    await createmanpowerModel.save();
  } catch (error) {
    res.json({ message: "Error adding Manpower", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getManpower = async (req, res, next) => {
  let manpowers;
  try {
    manpowers = await manpowerModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Manpower list", error: true });
    return next(error);
  }
  res.json({
    manpowers: manpowers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editManpower = async (req, res, next) => {
  const {
    job,
    startDate,
    endDate,
    days,
    requiredEmp,
    shiftEndTime,
    shiftStartTime,
    notes,
  } = req.body;
  const { manpowerId } = req.params;
  let manpowerToBeEdited;
  try {
    manpowerToBeEdited = await manpowerModel.findById(manpowerId);
  } catch (error) {
    res.json({ message: "Could not find the manpower", error: true });
    return next(error);
  }
  manpowerToBeEdited.job = job;
  manpowerToBeEdited.startDate = startDate;
  manpowerToBeEdited.endDate = endDate;
  manpowerToBeEdited.shiftStartTime = shiftStartTime;
  manpowerToBeEdited.shiftEndTime = shiftEndTime;
  manpowerToBeEdited.notes = notes;
  manpowerToBeEdited.days.monday = days.monday;
  manpowerToBeEdited.days.tuesday = days.tuesday;
  manpowerToBeEdited.days.wednesday = days.wednesday;
  manpowerToBeEdited.days.thursday = days.thursday;
  manpowerToBeEdited.days.friday = days.friday;
  manpowerToBeEdited.requiredEmp.foreman.noOfEmp = requiredEmp.foreman;
  manpowerToBeEdited.requiredEmp.journeyman.noOfEmp = requiredEmp.journeyman;
  manpowerToBeEdited.requiredEmp.apprentice.noOfEmp = requiredEmp.apprentice;
  manpowerToBeEdited.requiredEmp.construction.noOfEmp =
    requiredEmp.construction;
  try {
    await manpowerToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit manpower", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const assignEmp = async (req, res, next) => {
  const { manpowerId } = req.params;
  const foremanObj = {
    noOfEmp: req.body.foreman.employees.length,
    employees: req.body.foreman.employees,
  };
  const journeymanObj = {
    noOfEmp: req.body.journeyman.employees.length,
    employees: req.body.journeyman.employees,
  };
  const apprenticeObj = {
    noOfEmp: req.body.apprentice.employees.length,
    employees: req.body.apprentice.employees,
  };
  const constructionObj = {
    noOfEmp: req.body.construction.employees.length,
    employees: req.body.construction.employees,
  };
  let manpowerToBeEdited;
  try {
    manpowerToBeEdited = await manpowerModel.findById(manpowerId);
  } catch (error) {
    res.json({ message: "Could not find the manpower", error: true });
    return next(error);
  }
  manpowerToBeEdited.assignedEmp.foreman = foremanObj;
  manpowerToBeEdited.assignedEmp.journeyman = journeymanObj;
  manpowerToBeEdited.assignedEmp.apprentice = apprenticeObj;
  manpowerToBeEdited.assignedEmp.construction = constructionObj;
  manpowerToBeEdited.workingEmp.foreman = foremanObj;
  manpowerToBeEdited.workingEmp.journeyman = journeymanObj;
  manpowerToBeEdited.workingEmp.apprentice = apprenticeObj;
  manpowerToBeEdited.workingEmp.construction = constructionObj;
  try {
    await manpowerToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit manpower", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Assigned successfully", error: false });
};
const deleteManpower = async (req, res, next) => {
  const { manpowerId, jobNo } = req.params;
  const { assignedUsers } = req.body;
  console.log("assignedUsers", assignedUsers);
  console.log("manpowerId and JobNo", manpowerId, jobNo);
  try {
    await manpowerModel.findByIdAndRemove(manpowerId);
  } catch (error) {
    res.json({ message: "Could not found the specific manpower", error: true });
    return next(error);
  }
  if (assignedUsers.length) {
    try {
      assignedUsers.forEach((el) => {
        if (el.foreman == true) {
          userModel
            .updateOne(
              { fullname: `${el.fullname}` },
              {
                $pull: {
                  userLabor: {
                    job: `${jobNo}`,
                    foreman: true,
                    manpowerId: `${el.manpowerId}`,
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
        }
        if (el.journeyman == true) {
          userModel
            .updateOne(
              { fullname: `${el.fullname}` },
              {
                $pull: {
                  userLabor: {
                    job: `${jobNo}`,
                    journeyman: true,
                    manpowerId: `${el.manpowerId}`,
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
        }
        if (el.apprentice == true) {
          userModel
            .updateOne(
              { fullname: `${el.fullname}` },
              {
                $pull: {
                  userLabor: {
                    job: `${jobNo}`,
                    apprentice: true,
                    manpowerId: `${el.manpowerId}`,
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
        }
        if (el.construction == true) {
          userModel
            .updateOne(
              { fullname: `${el.fullname}` },
              {
                $pull: {
                  userLabor: {
                    job: `${jobNo}`,
                    construction: true,
                    manpowerId: `${el.manpowerId}`,
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
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addManpower = addManpower;
exports.getManpower = getManpower;
exports.assignEmp = assignEmp;
exports.editManpower = editManpower;
exports.deleteManpower = deleteManpower;
