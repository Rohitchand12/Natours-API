const User = require("./../models/userModel");

const filterObj = (obj, ...allowedFields) => {
  /*here ...alowedFields is a rest opertor and hence if we pass number of parameters ,
   they will get converted ino an array*/
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    //Object.keys(obj) will return all the keys in obj and then we iterate using foreach method
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
//middlewares

exports.updateMe = async (req, res, next) => {
  try {
    //1)check if user provided any password data and throw error
    if (req.body.password || req.body.confirmPassword) {
      throw new Error(
        "this route is not for the password updates , please use /update-password"
      );
    }

    //filtered the request body from unwanted parameters like role , etc
    const filteredBody = filterObj(req.body, "email", "name");
    console.log(filteredBody);

    //2)update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });

    return next(err);
  }
};
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
      status: "success",
      data:null
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });

    return next(err);
  }
};


exports.getAllUsers = async (req, res,next) => {
  try{
    const user = await User.find();
    res.status(200).json({
      status:'success',
      data:{
        user
      }
    })
  }
  catch(err)
  {
    res.status(400).json({
      status: "error",
      message:"could not find users"
    });
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
