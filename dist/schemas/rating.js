"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.ratingSchema = new mongoose_1.Schema({
    day: String,
    user: String,
    rating: Number,
    from: String,
    createdAt: Date,
    dayDate: Date
});
exports.ratingSchema.pre("save", function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    var values = this.day.split("-");
    var yearN = Number(values[2]);
    var monthN = Number(values[1]) - 1;
    var dayN = Number(values[0]);
    this.dayDate = new Date(yearN, monthN, dayN, 12, 0, 0, 0);
    next();
});
