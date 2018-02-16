import { Schema } from "mongoose";

export var userSchema: Schema = new Schema({
  nickName: String,
  createdAt: Date
});
userSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});