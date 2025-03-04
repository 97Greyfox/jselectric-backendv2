const serviceToolTrackModel = require("../models/serviceToolTrackModel");
const userModel = require("../models/userModel");
const aws = require("aws-sdk");
const { ObjectId } = require("mongoose").Types;
const dotenv = require("dotenv");
const momentObj = require("moment");
dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addToolTrack = async (req, res, next) => {
  const {
    toolNumber,
    techAssigned,
    job,
    date,
    note,
    time,
    user,
    checkedOut,
    location,
  } = req.body;
  var arr = [];
  try {
    await uploadToS3(req.files[0])
      .then((res) => {
        arrReturn(res, arr);
      })
      .catch((err) => console.log(err));
    const createToolTrack = new serviceToolTrackModel({
      toolNumber,
      techAssigned,
      job,
      date,
      note,
      time,
      user,
      checkedOut,
      location,
      file: arr[0],
    });
    await createToolTrack.save();
    console.log("techAssigned", techAssigned);
    await userModel.findOneAndUpdate(
      { fullname: `${techAssigned}` },
      {
        $push: {
          userServiceToolTracks: createToolTrack,
        },
      }
    );
    console.log("success");
    res.status(201).json({ message: "added successfully", error: false });
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
};
const getToolTrack = async (req, res, next) => {
  let toolTracks;
  try {
    toolTracks = await serviceToolTrackModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    toolTracks: toolTracks.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editToolTrack = async (req, res, next) => {
  const {
    toolNumber,
    techAssigned,
    job,
    date,
    note,
    time,
    user,
    checkedOut,
    location,
    oldFiles,
    newFileFlag,
    editFlag,
  } = req.body;
  const { toolTrackId } = req.params;
  var toolTrackToBeEdited;
  var userToBeEdited;
  var techAssignedName = "";
  if (newFileFlag == "false" && editFlag == "true") {
    console.log("here in old files");
    try {
      toolTrackToBeEdited = await serviceToolTrackModel.findById(toolTrackId);
    } catch (error) {
      res.json({ message: "Could not find the userType", error: true });
      return next(error);
    }
    toolTrackToBeEdited.toolNumber = toolNumber;
    toolTrackToBeEdited.techAssigned = techAssigned;
    toolTrackToBeEdited.job = job;
    toolTrackToBeEdited.date = date;
    toolTrackToBeEdited.note = note;
    toolTrackToBeEdited.time = time;
    toolTrackToBeEdited.user = user;
    toolTrackToBeEdited.checkedOut = checkedOut;
    toolTrackToBeEdited.location = location;
    try {
      await toolTrackToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to change Location", error: true });
      return next(error);
    }
    try {
      userToBeEdited = await userModel.find({ fullname: techAssigned });

      userToBeEdited[0].userServiceToolTracks.forEach((element) => {
        if (element._id == toolTrackId) {
          element.toolNumber = toolNumber;
          element.techAssigned = techAssigned;
          element.job = job;
          element.date = date;
          element.note = note;
          element.time = time;
          element.user = user;
          element.checkedOut = checkedOut;
          element.location = location;
        }
      });
    } catch (error) {
      console.log(error);
    }
    try {
      await userModel
        .updateOne(
          { fullname: techAssigned },
          {
            $set: {
              userServiceToolTracks: userToBeEdited[0].userServiceToolTracks,
            },
          }
        )
        .then((doc) => console.log(doc))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
  if (newFileFlag == "true" && editFlag == "true") {
    console.log("here in newFile");
    var arr = [];
    try {
      if (oldFiles == "undefined") {
        console.log("here in undefined");
      } else {
        const prevFile = JSON.parse(oldFiles);
        deleteAwsObj(prevFile);
      }
    } catch (error) {
      res.json({ message: "Error deleting S3 image", error: true });
      return next(error);
    }
    try {
      if (req.files[0] == undefined || req.files[0].length == 0) {
        return false;
      } else {
        await uploadToS3(req.files[0])
          .then((res) => {
            arrReturn(res, arr);
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      res.json({ message: "Error Occured in S3 upload", error: true });
      return next(error);
    }
    try {
      toolTrackToBeEdited = await serviceToolTrackModel.findById(toolTrackId);
    } catch (error) {
      res.json({ message: "Could not find the userType", error: true });
      return next(error);
    }
    toolTrackToBeEdited.toolNumber = toolNumber;
    toolTrackToBeEdited.techAssigned = techAssigned;
    toolTrackToBeEdited.job = job;
    toolTrackToBeEdited.date = date;
    toolTrackToBeEdited.note = note;
    toolTrackToBeEdited.time = time;
    toolTrackToBeEdited.user = user;
    toolTrackToBeEdited.checkedOut = checkedOut;
    toolTrackToBeEdited.location = location;
    toolTrackToBeEdited.file = arr[0];
    try {
      await toolTrackToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to change Location", error: true });
      return next(error);
    }
    try {
      userToBeEdited = await userModel.find({ fullname: techAssigned });
      console.log("usertobeedited before", userToBeEdited[0]);
      userToBeEdited[0].userServiceToolTracks.forEach((element) => {
        if (element._id == toolTrackId) {
          element.toolNumber = toolNumber;
          element.techAssigned = techAssigned;
          element.job = job;
          element.date = date;
          element.note = note;
          element.time = time;
          element.user = user;
          element.checkedOut = checkedOut;
          element.location = location;
          element.file = arr[0];
        }
      });
      console.log("usertobeedited aftere", userToBeEdited[0]);
    } catch (error) {
      console.log(error);
    }
    try {
      await userModel.updateOne(
        { fullname: techAssigned },
        {
          $set: {
            userServiceToolTracks: userToBeEdited[0].userServiceToolTracks,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const changeLocation = async (req, res, next) => {
  const { data } = req.body;
  const toolTrackIdArr = JSON.parse(data);
  // const { toolTrackId } = req.params;
  var toolTrackToBeEdited;
  var userToBeEdited;
  var techAssignedName = "";
  toolTrackIdArr.forEach(async (toolTrackId) => {
    try {
      toolTrackToBeEdited = await serviceToolTrackModel.findById(toolTrackId);
    } catch (error) {
      res.json({ message: "Could not find the userType", error: true });
      return next(error);
    }
    techAssignedName = toolTrackToBeEdited.techAssigned;
    toolTrackToBeEdited.location = "Shop";
    try {
      await toolTrackToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to change Location", error: true });
      return next(error);
    }
    try {
      console.log(techAssignedName);
      userToBeEdited = await userModel.find({ fullname: techAssignedName });
      console.log(userToBeEdited[0].userServiceToolTracks);
      userToBeEdited[0].userServiceToolTracks.forEach((element) => {
        if (element._id == toolTrackId) {
          element.location = "Shop";
        }
      });
    } catch (error) {
      console.log(error);
    }
    try {
      await userModel.updateOne(
        { fullname: techAssignedName },
        {
          $set: {
            userServiceToolTracks: userToBeEdited[0].userServiceToolTracks,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    if (toolTrackIdArr[toolTrackIdArr.length - 1] == toolTrackId) {
      res
        .status(201)
        .json({ message: "Changed location successfully", error: false });
    }
  });
};
const deleteToolTrack = async (req, res, next) => {
  const { toolTrackId, fullname } = req.params;
  const { data } = req.body;
  const dataObj = data == undefined ? [] : JSON.parse(data);
  console.log("this is dataObj", dataObj);
  var oldFiles =
    dataObj !== undefined
      ? [{ fileUrl: dataObj.fileUrl, filename: dataObj.filename }]
      : [];
  console.log(oldFiles);
  if (oldFiles.length == 0) {
    try {
      console.log("here", fullname);
      await userModel
        .updateOne(
          { fullname: fullname },
          {
            $pull: {
              userServiceToolTracks: { _id: new ObjectId(`${toolTrackId}`) },
            },
          }
        )
        .then((doc) => console.log(doc))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
    try {
      await serviceToolTrackModel.findByIdAndRemove(toolTrackId);
    } catch (error) {
      res.json({
        message: "Could not found the specific tool track data",
        error: true,
      });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  } else {
    console.log("here in oldFiles", fullname);
    console.log("here oldFiles", oldFiles);
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
      await userModel
        .updateOne(
          { fullname: fullname },
          {
            $pull: {
              userServiceToolTracks: { _id: new ObjectId(`${toolTrackId}`) },
            },
          }
        )
        .then((doc) => console.log(doc))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
    try {
      await serviceToolTrackModel.findByIdAndRemove(toolTrackId);
    } catch (error) {
      res.json({
        message: "Could not found the specific tool track data",
        error: true,
      });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  }
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

const arrReturn = (item, arr) => {
  arr.push(item);
};
const searchFilter = async (req, res, next) => {
  const { searchBy, searchValue } = req.query;
  var allToolTracks;
  try {
    if (searchBy == "toolNumber") {
      allToolTracks = await serviceToolTrackModel.find({
        toolNumber: searchValue,
      });
    }
    if (searchBy == "job") {
      allToolTracks = await serviceToolTrackModel.find({
        job: {
          $regex: searchValue !== undefined ? searchValue : "",
          $options: "i",
        },
      });
    }
    if (searchBy == "location") {
      allToolTracks = await serviceToolTrackModel.find({
        location: {
          $regex: searchValue !== undefined ? searchValue : "",
          $options: "i",
        },
      });
    }
    if (searchBy == "techAssigned") {
      allToolTracks = await serviceToolTrackModel.find({
        techAssigned: searchValue,
      });
    }
  } catch (error) {
    res.json({ message: "Error finding Tasks list", error: true });
    return next(error);
  }
  res.json({
    toolTracks: allToolTracks.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
exports.addToolTrack = addToolTrack;
exports.getToolTrack = getToolTrack;
exports.searchFilter = searchFilter;
exports.editToolTrack = editToolTrack;
exports.changeLocation = changeLocation;
exports.deleteToolTrack = deleteToolTrack;
