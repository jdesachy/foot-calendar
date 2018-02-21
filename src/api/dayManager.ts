import mongoose = require("mongoose");
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import { IDayModel } from "../models/day";
import { daySchema } from "../schemas/day";

export class DayManager {

    public unsuscribe(day: string, user: string){
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        
        var Day = connection.model<IDayModel>("Day", daySchema);

        Day.findOne({id: day, user: user}, function(res, d){
            if(d){
                d.participate = false;
                d.save(function(err){
                    console.log("user " + d.user + " unsuscribe for day " + d.id);
                });
            }
        });
    }

    public suscribe(day: string, user: string){
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        
        var User = connection.model<IUserModel>("User", userSchema);
        User.find({nickName: user}, function(err, res){

            if(!err){
                if(!res.length){
                    var u = new User({
                        nickName: user
                    });
                    u.save(function(err, uRes){
                        console.log("user " + uRes.nickName + " inserted with id " + uRes._id);
                      
                        var Day = connection.model<IDayModel>("Day", daySchema);
                        var dayDB = new Day({
                            id: day,
                            user: uRes.nickName,
                            participate: true
                        });
                        dayDB.save(function(err){
                            if(err){
                                console.log("error suscribing user " + dayDB.user + " suscribe for day " + dayDB.id);
                            }else{
                                console.log("user " + dayDB.user + " suscribe for day " + dayDB.id);
                            }
                        });
                    });
                }else{
                    var Day = connection.model<IDayModel>("Day", daySchema);
                    Day.findOne({id: day, user: res[0].nickName}, function(err, d){
                        if(!err){
                            if(d){
                                d.participate = true;
                                d.save(function(err){
                                    console.log("Updating user "+ res[0].nickName + " suscribe for day " + d.id);
                                });
                            }else{
                                var dayDB = new Day({
                                    id: day,
                                    user: res[0].nickName,
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
                        }                        
                    });
                }
            }
        });
    }
}