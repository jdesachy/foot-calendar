"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = require("./dateformat");
const calendarDay_1 = require("./calendarDay");
const user_1 = require("./user");
const mongoose = require("mongoose");
const user_2 = require("../schemas/user");
const day_1 = require("../schemas/day");
const userdao_1 = require("../api/userdao");
const weatherData_1 = require("../api/weatherData");
const votemanager_1 = require("../api/votemanager");
const serverEnv_1 = require("../serverEnv");
class Calendar {
    constructor() {
    }
    get(cal, callback, day) {
        if (!day) {
            let dateformat;
            dateformat = new dateformat_1.DateFormat();
            day = dateformat.format(new Date());
        }
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var Day = connection.model("Day", day_1.daySchema);
        var query = Day.find({ id: day }, function (err, daysDB) {
            if (err) {
                console.log(err);
            }
            var users;
            users = [];
            var UserModel = connection.model("User", user_2.userSchema);
            var inc = 0;
            var callbackCalendar = function (cal, callback) {
                var actualDay = new calendarDay_1.CalendarDay(day, users);
                if (cal.length <= 4) {
                    cal.push(actualDay);
                    new Calendar().get(cal, callback, actualDay.next.id);
                }
                else {
                    cal.push(actualDay);
                    new Calendar().updateContent(cal, callback);
                }
            };
            var userFindById = function (daysDB, inc) {
                UserModel.findOne({ nickName: daysDB[inc].user }, function (err, u) {
                    users.push(new user_1.User(u.nickName, daysDB[inc].participate));
                    if (inc < daysDB.length - 1) {
                        userFindById(daysDB, ++inc);
                    }
                    else {
                        callbackCalendar(cal, callback);
                    }
                });
            };
            if (daysDB.length) {
                userFindById(daysDB, 0);
            }
            else {
                callbackCalendar(cal, callback);
            }
        });
    }
    updateContent(cal, callback) {
        const http = require('http');
        http.get('http://api.apixu.com/v1/forecast.json?key=28c3c44617e84a4f93b102942182002&q=Archamps&days=7', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var weatherResult = JSON.parse(data);
                var index = 0;
                for (let d of weatherResult.forecast.forecastday) {
                    var w = new weatherData_1.WeatherData();
                    w.min = d.day.mintemp_c;
                    w.max = d.day.maxtemp_c;
                    w.image = "http:" + d.day.condition.icon;
                    var dateformat = new dateformat_1.DateFormat();
                    var id = dateformat.format(new Date(d.date));
                    for (let c of cal) {
                        if (c.now.id == id) {
                            c.now.weather = w;
                        }
                    }
                }
                new userdao_1.UserDao().readAll(function (result) {
                    new votemanager_1.VoteManager().averageAll(function (code, avgResult, err) {
                        var usersDays = [];
                        if (code > 0) {
                            result.forEach(function (u) {
                                var cUser = [];
                                cal.forEach(function (c) {
                                    var participate = false;
                                    var style = "day missing";
                                    c.users.forEach(function (uDay) {
                                        if (uDay.nickName == u.nickName && uDay.participate) {
                                            participate = true;
                                            style = "day present";
                                        }
                                    });
                                    cUser.push({ day: c.now.id, "participate": participate, "style": style });
                                });
                                var avg = 0;
                                avgResult.forEach(function (avgRes) {
                                    if (avgRes.name == u.nickName) {
                                        avg = avgRes.avg;
                                    }
                                });
                                usersDays.push({ "name": u.nickName, "days": cUser, "avg": avg });
                            });
                        }
                        callback(cal, usersDays);
                    });
                });
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    buildUserList() {
    }
}
exports.Calendar = Calendar;
