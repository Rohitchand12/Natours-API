class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      //A.filtering the tours
      const tourQuery = { ...this.queryString }; // cant do tourQuery = req.query bcoz it will become a reference and any change in tourquery will change the req.query
      const excluded = ["page", "sort", "limit", "fields"];
      excluded.forEach((el) => delete tourQuery[el]);
  
      //B.advanced filtering
      let queryStr = JSON.stringify(tourQuery);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      console.log(JSON.parse(queryStr));
      this.query = this.query.find(JSON.parse(queryStr)); // convert queryStr to javascript object and use find .
      // let query = Tour.find(JSON.parse(queryStr));
      return this;
    }
  
    sort() {
      //C.sorting the data
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
  
    limitFields() {
      //D.limiting the fields
      if (this.queryString.fields) {
        const limitBy = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(limitBy);
      } else {
        this.query = this.query.select("-__v"); //- indicated excluding of __v
      }
      return this;
    }
  
    paginate() {
      //E.pagination
      const page = this.queryString.page * 1 || 1; // multiplied by one to convert into a number
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }

  module.exports = APIFeatures;