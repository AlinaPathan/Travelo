// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js"); // Adjust path if necessary
// const Reviews = require("./models/reviews.js"); // Adjust path if necessary

// // Connect to MongoDB
// const MONGO_URL = "mongodb://127.0.0.1:27017/travelo"; // Update with your MongoDB URL
// mongoose.connect(MONGO_URL)
//   .then(() => console.log("Connected to DB"))
//   .catch(err => console.log(err));

// async function deleteAllReviews() {
//   try {
//     // First, delete all reviews from the Reviews collection
//     await Reviews.deleteMany({});
//     console.log("All reviews have been deleted!");

//     // Then, remove the references to the deleted reviews in the listings collection
//     await Listing.updateMany({}, { $set: { reviews: [] } });
//     console.log("All review references in listings have been removed!");

//   } catch (err) {
//     console.log("Error while deleting reviews and removing references:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// // Call the function to delete all reviews and their references from listings
// deleteAllReviews();
