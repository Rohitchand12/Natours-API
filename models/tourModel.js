const mongoose = require("mongoose");

//creating a schema or a blueprint of the document
const tourSchema = new mongoose.Schema({
    name:{
      type:String,
      required:[true,"tour name is required"],
      unique:true
    },
    duration:{
      type:Number,
      required:[true,'tour must have a duration']
    },
    maxGroupSize:{
      type:Number,
      required:[true,'tour must have a group size']
    },
    difficulty:{
      type:String,
      required:[true,'difficulty is required']
    },
    ratingsAverage:{
      type:Number,
      default:4.5
    },
    ratingsQuantity:{
      type:Number,
      default:0
    },
    price:{
      type:Number
    },
    priceDiscount:{
      type:Number
    },
    summary:{
      type:String,
      trim:true, // all the white space will be cut
      required:[true,'add a summary']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,//put the name of image
      required:[true,'add cover image']
    },
    images:{
      type:[String], // array of strings
    },
    createdAt:{
      type:Date,
      default:Date.now(), //current date
      select:false // to not display it to the user
    },
    startDates:{
      type:[Date] // different dates for the same tour, mongo will automatically parse input to date
    }
  
  },{
    toJSON :{virtuals :true},
    toObject :{virtuals:true}
  })

tourSchema.virtual("durationWeeks").get(function (){
  const weeks = `${Math.trunc(this.duration/7)} week/s and ${this.duration%7} days`;
  return weeks;
})

tourSchema.pre('save', function(next){
  console.log(this);
  next();
})
tourSchema.post('save', function(doc,next){
  console.log(doc);
  next();
})

  //creating a model for the document that follows the blueprint, it is just like a class 
  const Tour = mongoose.model("Tour",tourSchema,"tourscollection")
module.exports = Tour;