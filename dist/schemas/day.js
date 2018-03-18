"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.daySchema = new mongoose_1.Schema({
    id: String,
    user: String,
    participate: Boolean,
    createdAt: Date
});
exports.daySchema.pre("save", function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
