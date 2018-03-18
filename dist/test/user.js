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
const serverEnv_1 = require("../serverEnv");
let UserTest = UserTest_1 = class UserTest {
    constructor() {
        this.data = {
            nickName: "Brian"
        };
    }
    static before() {
        global.Promise = require("q").Promise;
        mongoose.Promise = global.Promise;
        let connection = mongoose.createConnection(serverEnv_1.ServerEnv.getMongoDBConnection());
        UserTest_1.User = connection.model("User", user_1.userSchema);
        let chai = require("chai");
        chai.should();
    }
    create() {
        return new UserTest_1.User(this.data).save().then(result => {
            result._id.should.exist;
            result.nickName.should.equal(this.data.nickName);
        });
    }
};
__decorate([
    mocha_typescript_1.test("should create a new User")
], UserTest.prototype, "create", null);
UserTest = UserTest_1 = __decorate([
    mocha_typescript_1.suite
], UserTest);
var UserTest_1;
