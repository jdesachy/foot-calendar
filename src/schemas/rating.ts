import { Schema } from "mongoose";

export var ratingSchema: Schema = new Schema({
    day: String,
    user: String,
    rating: Number,
    from: String,
    createdAt: Date
});
ratingSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});