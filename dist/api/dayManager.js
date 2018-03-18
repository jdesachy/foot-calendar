"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../schemas/user");
const day_1 = require("../schemas/day");
const serverEnv_1 = require("../serverEnv");
class DayManager {
    unsuscribe(day, user) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var Day = connection.model("Day", day_1.daySchema);
        Day.findOne({ id: day, user: user }, function (res, d) {
            if (d) {
                d.participate = false;
                d.save(function (err) {
                    console.log("user " + d.user + " unsuscribe for day " + d.id);
                });
            }
        });
    }
    suscribe(day, user, callback) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var User = connection.model("User", user_1.userSchema);
        User.find({ nickName: user }, function (err, res) {
            if (!err) {
                if (!res.length) {
                    var u = new User({
                        nickName: user
                    });
                    u.save(function (err, uRes) {
                        console.log("user " + uRes.nickName + " inserted with id " + uRes._id);
                        var Day = connection.model("Day", day_1.daySchema);
                        var dayDB = new Day({
                            id: day,
                            user: uRes.nickName,
                            participate: true
                        });
                        dayDB.save(function (err) {
                            if (err) {
                                console.log("error suscribing user " + dayDB.user + " suscribe for day " + dayDB.id);
                            }
                            else {
                                console.log("user " + dayDB.user + " suscribe for day " + dayDB.id);
                            }
                            callback();
                        });
                    });
                }
                else {
                    var Day = connection.model("Day", day_1.daySchema);
                    Day.findOne({ id: day, user: res[0].nickName }, function (err, d) {
                        if (!err) {
                            if (d) {
                                d.participate = true;
                                d.save(function (err) {
                                    console.log("Updating user " + res[0].nickName + " suscribe for day " + d.id);
                                    callback();
                                });
                            }
                            else {
                                var dayDB = new Day({
                                    id: day,
                                    user: res[0].nickName,
                                    participate: true
                                });
                                dayDB.save(function (err) {
                                    if (err) {
                                        console.log("error suscribing user " + dayDB.user + " suscribe for day " + dayDB.id);
                                    }
                                    else {
                                        console.log("user " + dayDB.user + " suscribe for day " + dayDB.id);
                                    }
                                    callback();
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    remove(user, callback) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var Day = connection.model("Day", day_1.daySchema);
        Day.find({ user: user }, function (err, dRes) {
            var deleteDay = function (days, index, callback) {
                days[index].remove(function (err, res) {
                    console.log("day " + res.id + " for the user " + res.user + " deleted");
                    if (index < days.length - 1) {
                        deleteDay(days, ++index, callback);
                    }
                    else {
                        callback(user);
                    }
                });
            };
            if (!err && dRes.length) {
                deleteDay(dRes, 0, callback);
            }
            else {
                callback(user);
            }
        });
    }
    getUsersForDay(day, callback) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var Day = connection.model("Day", day_1.daySchema);
        var players = [];
        Day.find({ id: day, participate: true }, function (err, res) {
            res.forEach(function (r) {
                players.push(r.user);
            });
            if (!err) {
                callback(1, players);
            }
            else {
                callback(-1, [], err);
            }
        });
    }
}
exports.DayManager = DayManager;
