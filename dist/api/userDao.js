"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../schemas/user");
class UserDao {
    readNameFromId(id) {
        console.log("searching id user " + id);
        const MONGODB_CONNECTION = "mongodb://localhost:27017/test";
        let connection = mongoose.createConnection(MONGODB_CONNECTION);
        var User = connection.model("User", user_1.userSchema);
        const query = User.find({ nickName: id });
        return query.exec();
    }
}
exports.UserDao = UserDao;
