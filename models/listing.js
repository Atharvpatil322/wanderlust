const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: { 
    type: String,
    enum: ["Beach","Mountain", "Boat", "Cities", "Castles", "Pool", "Camping", "Farm", "Arctic", "Nature", "Treehouse", "Island", "Lighthouse"], 
  },
  image: {
    url : String,
    filename : String
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User"
  },
  geometry : {
    type : {
    type : String,
    enum : ["Point"],
    required : true
  },
  coordinates : {
      // coordinates are in array format.
    type : [Number],
    required : true
  },
}
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id : { $in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;