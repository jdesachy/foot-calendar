import { Schema } from "mongoose";

export var daySchema: Schema = new Schema({
    id: String,
    user: String,
    participate: Boolean,
    createdAt: Date
});
daySchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});