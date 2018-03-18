"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../schemas/user");
const serverEnv_1 = require("../serverEnv");
class UserDao {
    readAll(callback) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var User = connection.model("User", user_1.userSchema);
        User.find(function (err, res) {
            callback(res);
        });
    }
    insert(user) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var User = connection.model("User", user_1.userSchema);
        User.find({ nickName: user }, function (err, res) {
            if (!err) {
                if (!res.length) {
                    var u = new User({
                        nickName: user
                    });
                    u.save(function (err, uRes) {
                        console.log("User " + user + " inserted with id " + uRes._id);
                    });
                }
            }
        });
    }
    delete(user) {
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        var User = connection.model("User", user_1.userSchema);
        User.findOne({ nickName: user }, function (err, res) {
            if (!err && res) {
                res.remove(function (err, r) {
                    console.log("User " + user + " has been deleted");
                });
            }
        });
    }
}
exports.UserDao = UserDao;
