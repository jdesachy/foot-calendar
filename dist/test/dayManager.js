"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const user_1 = require("../schemas/user");
const mongoose = require("mongoose");
const dayManager_1 = require("../api/dayManager");
const day_1 = require("../schemas/day");
let DayManagerTest = class DayManagerTest {
    static before() {
        var User = this.getUserModel();
        this.userTest = new User({
            nickName: 'toto'
        });
        this.userTest.save();
    }
    static after() {
        var User = this.getUserModel();
        this.userTest.remove(function (err) {
            if (err)
                throw err;
            console.log('User successfully deleted!');
        });
        var Day = this.getDayModel();
        Day.find({ id: "01-01-2018" }, function (err, days) {
            for (let d of days) {
                d.remove();
            }
        });
    }
    static getUserModel() {
        this.connection = mongoose.createConnection(this.MONGODB_CONNECTION);
        return this.connection.model("User", user_1.userSchema);
    }
    static getDayModel() {
        this.connection = mongoose.createConnection(this.MONGODB_CONNECTION);
        return this.connection.model("Day", day_1.daySchema);
    }
    suscribeDayExistingUser() {
        var dayManager = new dayManager_1.DayManager();
        dayManager.suscribe("01-01-2018", "toto", function () { });
    }
};
DayManagerTest.MONGODB_CONNECTION = "mongodb://localhost:27017/test";
__decorate([
    mocha_typescript_1.test("Test suscribe user for day")
], DayManagerTest.prototype, "suscribeDayExistingUser", null);
DayManagerTest = __decorate([
    mocha_typescript_1.suite
], DayManagerTest);
