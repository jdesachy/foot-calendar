import mongoose = require("mongoose");
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import { IDayModel } from "../models/day";
import { daySchema } from "../schemas/day";

export class DayManager {

    public suscribe(day: string, user: string){
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        
        var Day = connection.model<IDayModel>("Day", daySchema);
        var dayDB = new Day({
            id: day,
            user: user,
            participate: true
        });
        dayDB.save(function(err){
            if(err){
                console.log("error suscribing user " + dayDB.user + " suscribe for day " + dayDB.id);
            }else{
                console.log("user " + dayDB.user + " suscribe for day " + dayDB.id);
            }
        });
    }

    public read(day: string, users: string[], callback : (users: string[], days : IDayModel[]) => void){
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        var Day = connection.model<IDayModel>("Day", daySchema);
        var query = Day.find({id: day}, function(err, daysDB){
            if(err){
                console.log(err);
            }
        });
        query.exec(function(err, result){
            console.log("read " + result);
            callback(users, result);
        });
    }
}