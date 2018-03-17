import mongoose = require("mongoose");
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import { IDayModel } from "../models/day";
import { daySchema } from "../schemas/day";
import { ServerEnv } from "../serverEnv";

export class DayManager {

    public unsuscribe(day: string, user: string){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
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

    public suscribe(day: string, user: string, callback : () => void){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
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
                            callback();
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
                                    callback();
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
                                    callback();
                                });
                            }
                        }                        
                    });
                }
            }
        });
    }

    remove(user: string, callback: (user: string) => void){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
        var Day = connection.model<IDayModel>("Day", daySchema);
        Day.find({user: user}, function(err, dRes){
            var deleteDay = function(days: IDayModel[], index: number, callback: (user: string) => void){
                days[index].remove(function(err, res){
                    console.log("day "+ res.id +" for the user " + res.user + " deleted");
                    if(index<days.length-1){
                        deleteDay(days, ++index, callback);
                    }else{
                        callback(user);
                    }
                });
            };
            if(!err && dRes.length){
                deleteDay(dRes, 0, callback);
            }else{
                callback(user);
            }
        });
    }

    getUsersForDay(day: string, callback: (code: number, players: any[], err?: string) => void){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
        var Day = connection.model<IDayModel>("Day", daySchema);
        var players = [];
        Day.find({id: day, participate: true}, function(err, res){
            res.forEach(function(r){
                players.push(r.user);
            });
            if(!err){
                callback(1, players);
            }else{
                callback(-1, [], err);
            }
        });
    }
}