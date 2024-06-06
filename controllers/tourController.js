const Tour = require("./../models/tourModel");
const APIFeatures = require("../utils/apiFeatures")

//creating alias middleware controller
exports.alias = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage price";
  req.query.fields = "name price ratingsAverage price summary";

  next();
};


exports.getAllTours = async (req, res) => {
  try {

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    //now the query looks like  query.sort().select().skip() etc .. thats why we made this query variable differently
    // to chain all these multiple features with it

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  try {
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // returns new updates document
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getTourStats = async(req,res)=>{
  try{

    const stats = await Tour.aggregate([ // since it returns an object promise
      {
        $match:{ratingsAverage :{$gte:4.5}}
      },
      {
        $group :{
          _id: '$ratingsAverage',
          tourCount:{$sum:1},
          avgPrice:{$avg:'$price'},
          avgRatings:{$avg:'$ratingsAverage'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'}
        }
      },
      {
        $sort:{avgPrice:1}
      }
    ]);

    res.status(200).json({
      status:'success',
      data:{
        stats
      }
    });

  }catch(err)
  {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
}
exports.getMonthlyPlan = async(req,res)=>{
  try{

    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind:'$startDates' // basically destructures the startDates array
      },
      {
        $match:{
          startDates:{
            $gte : new Date(`${year}-01-01`), // to make sure the tour is from year 2021
            $lte : new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group :{
          _id: {$month: "$startDates"}, // goup by the startdates 
          numTourStarts: {$sum :1}, // count number of tours
          tour:{$push:"$name"} // store the name of tours in tour array
        }
      },
      {
        $addFields:{ month :"$_id"} //add a field month instead of id
      },
      {
        $project:{
          _id:0 // remove the id field by setting its project as 0
        }
      },
      {
        $sort:{ numTourStarts : -1} // sort according to busiest month first
      },
      {
        $limit :6 // only showss top 6 busiest months
      }
    ])

    res.status(200).json({
      status:'success',
      data:{
        plan
      }
    })

  }catch(err)
  {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
}