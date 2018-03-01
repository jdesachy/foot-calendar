import { suite, test } from "mocha-typescript";
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import mongoose = require("mongoose");
import { Model } from "mongoose";
import { DayManager } from '../api/dayManager';
import { IDayModel } from '../models/day';
import { daySchema } from '../schemas/day';

@suite
class DayManagerTest {

    private static MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";
    private static connection: mongoose.Connection;

    private static userTest: IUserModel;

    //the User model
    public static User: mongoose.Model<IUserModel>;

    public static before() {
        var User = this.getUserModel();

        this.userTest = new User({
            nickName: 'toto'
        });
        this.userTest.save();
    }

    public static after() {
        var User = this.getUserModel();

        this.userTest.remove(function(err) {
            if (err) throw err;
            console.log('User successfully deleted!');
        });
        
        var Day = this.getDayModel();
        Day.find({id: "01-01-2018"}, function(err, days){
            for(let d of days){
                d.remove();
            }
        });
    }

    public static getUserModel(){
        this.connection = mongoose.createConnection(this.MONGODB_CONNECTION)
        return this.connection.model<IUserModel>("User", userSchema);
    }

    public static getDayModel(){
        this.connection = mongoose.createConnection(this.MONGODB_CONNECTION)
        return this.connection.model<IDayModel>("Day", daySchema);
    }

    @test("Test suscribe user for day")
    public suscribeDayExistingUser(){
        var dayManager = new DayManager();
        dayManager.suscribe("01-01-2018", "toto", function(){});
    }

}