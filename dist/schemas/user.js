"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    nickName: String,
    createdAt: Date
});
exports.userSchema.pre("save", function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
