import { suite, test } from "mocha-typescript";
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import mongoose = require("mongoose");
import { ServerEnv } from "../serverEnv";

@suite
class UserTest {

  //store test data
  private data: IUser;

  //the User model
  public static User: mongoose.Model<IUserModel>;

  public static before() {
    //use q promises
    global.Promise = require("q").Promise;

    //use q library for mongoose promise
    mongoose.Promise = global.Promise;

    //connect to mongoose and create model
    let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
    UserTest.User = connection.model<IUserModel>("User", userSchema);

    //require chai and use should() assertions
    let chai = require("chai");
    chai.should();
  }

  constructor() {
    this.data = {
      nickName: "Brian"
    };
  }

  @test("should create a new User")
  public create() {
    //create user and return promise
    return new UserTest.User(this.data).save().then(result => {
      //verify _id property exists
      result._id.should.exist;
      result.nickName.should.equal(this.data.nickName);
    });
  }
}