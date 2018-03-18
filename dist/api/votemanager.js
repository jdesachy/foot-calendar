"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../schemas/user");
const day_1 = require("../schemas/day");
const rating_1 = require("../schemas/rating");
const serverEnv_1 = require("../serverEnv");
class VoteManager {
    init(day, callback) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var Rating = connection.model("Rating", rating_1.ratingSchema);
        Rating.find({ day: day }, function (err, ratings) {
            if (!err) {
                var allUsers = [];
                var User = connection.model("User", user_1.userSchema);
                User.find(function (err, users) {
                    if (!err && users.length) {
                        users.forEach(function (u) {
                            allUsers.push(u.nickName);
                        });
                        var froms = [];
                        if (ratings.length) {
                            ratings.forEach(function (r) {
                                froms.push(r.from);
                            });
                            console.log("finding users for this day: " + froms);
                        }
                        var missingUsers = [];
                        allUsers.forEach(function (u) {
                            if (froms.indexOf(u) < 0) {
                                missingUsers.push(u);
                            }
                        });
                        var Day = connection.model("Day", day_1.daySchema);
                        var evaluatedUsers = [];
                        Day.find({ id: day, participate: true }, function (err, days) {
                            if (!err && days.length) {
                                days.forEach(function (d) {
                                    evaluatedUsers.push(d.user);
                                });
                                callback(missingUsers, evaluatedUsers);
                            }
                        });
                    }
                });
            }
            else {
                callback([], []);
            }
        });
    }
    evaluateAll(players, user, day, callback) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var User = connection.model("User", user_1.userSchema);
        User.findOne({ nickName: user }, function (err, res) {
            if (!err) {
                if (res) {
                    var Rating = connection.model("Rating", rating_1.ratingSchema);
                    var evaluate = function (players, index) {
                        var rating = new Rating({
                            day: day,
                            from: user,
                            rating: players[index].note,
                            user: players[index].name
                        });
                        User.findOne({ nickName: rating.user }, function (err, res) {
                            if (!err) {
                                if (res) {
                                    var Rating = connection.model("Rating", rating_1.ratingSchema);
                                    Rating.find({ day: rating.day, from: rating.from, user: rating.user }, function (err, ratings) {
                                        if (!err) {
                                            if (!ratings.length) {
                                                rating.save(function (err, r) {
                                                    console.log("User " + r.from + " has evaluate player " + r.user + " for the day " + r.day);
                                                    if (index < players.length - 1) {
                                                        evaluate(players, ++index);
                                                    }
                                                    else {
                                                        callback(1, "");
                                                    }
                                                });
                                            }
                                            else {
                                                console.log("User " + rating.from + " has already evaluated player " + rating.user);
                                                callback(-1, "User " + rating.from + " has already evaluated player " + rating.user);
                                            }
                                        }
                                        else {
                                            callback(-1, err);
                                        }
                                    });
                                }
                                else {
                                    console.log("Unknown user " + rating.user);
                                    callback(-1, "Unknown user " + user);
                                }
                            }
                            else {
                                callback(-1, err);
                            }
                        });
                    };
                    if (players.length) {
                        evaluate(players, 0);
                    }
                    else {
                        callback(-1, "Any players to evaluate");
                    }
                }
                else {
                    console.log("Unknown user " + user);
                    callback(-1, "Unknown user " + user);
                }
            }
            else {
                callback(-1, err);
            }
        });
    }
    averageAll(callback) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var User = connection.model("User", user_1.userSchema);
        User.find(function (err, u) {
            if (!err) {
                if (u.length) {
                    var Rating = connection.model("Rating", rating_1.ratingSchema);
                    var average = function (users, index, result) {
                        Rating.aggregate([{
                                $match: { user: users[index].nickName }
                            }, {
                                $group: {
                                    _id: { day: '$dayDate', user: '$user' },
                                    average: { $avg: '$rating' }
                                }
                            }, {
                                $sort: { _id: -1 }
                            }, {
                                $limit: 5
                            }], function (err, res) {
                            if (!err) {
                                if (res.length) {
                                    var avg = 0;
                                    res.forEach(function (r) {
                                        avg = avg + r.average;
                                    });
                                    avg = avg / res.length;
                                    result.push({ "name": users[index].nickName, "avg": avg });
                                }
                                else {
                                    result.push({ "name": users[index].nickName, "avg": 10 });
                                }
                                if (index < users.length - 1) {
                                    average(users, ++index, result);
                                }
                                else {
                                    callback(1, result);
                                }
                            }
                            else {
                                callback(-1, err);
                            }
                        });
                    };
                    average(u, 0, []);
                }
                else {
                    callback(1, [], "Any user existing");
                }
            }
            else {
                callback(-1, err);
            }
        });
    }
    remove(user, callback) {
        if (user) {
            let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
            var Rating = connection.model("Rating", rating_1.ratingSchema);
            Rating.find({ user: user }, function (err, ratings) {
                if (!err && ratings.length) {
                    var deleteRate = function (ratings, index, callback) {
                        ratings[index].remove(function (err, res) {
                            console.log("rating for the user" + user + " deleted for day " + res.day);
                            if (index < ratings.length - 1) {
                                deleteRate(ratings, ++index, callback);
                            }
                            else {
                                callback(user);
                            }
                        });
                    };
                    deleteRate(ratings, 0, callback);
                }
                else {
                    callback(user);
                }
            });
        }
    }
}
exports.VoteManager = VoteManager;
