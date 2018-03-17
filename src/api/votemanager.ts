import mongoose = require("mongoose");
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import { IDayModel } from "../models/day";
import { daySchema } from "../schemas/day";
import { IRatingModel } from "../models/rating";
import { ratingSchema } from "../schemas/rating";
import { ServerEnv } from "../serverEnv";

export class VoteManager {

    init(day: string, callback: (missingUsers: string[], players: string[]) => void){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        var Rating = connection.model<IRatingModel>("Rating", ratingSchema);        
        Rating.find({day: day}, function(err, ratings){
            if(!err){
                var allUsers = [];
                var User = connection.model<IUserModel>("User", userSchema);
                User.find(function(err, users){
                    if(!err && users.length){
                        users.forEach(function(u){
                            allUsers.push(u.nickName);
                        });
                        var froms = [];
                        if(ratings.length){
                            ratings.forEach(function(r){
                                froms.push(r.from);
                            });

                            console.log("finding users for this day: " + froms);
                        }
                        var missingUsers = [];
                        allUsers.forEach(function(u){
                            if(froms.indexOf(u)<0){
                                missingUsers.push(u);
                            }
                        });
                        var Day = connection.model<IDayModel>("Day", daySchema);
                        var evaluatedUsers = [];
                        Day.find({id: day, participate: true}, function(err, days){
                            if(!err && days.length){
                                days.forEach(function(d){
                                    evaluatedUsers.push(d.user);
                                });
                                callback(missingUsers, evaluatedUsers);
                            }
                        });
                    }
                });
            }else{
                callback([], []);
            }
        });
    }

    evaluateAll(players: any[], user: string, day: string, callback: (status: number, reason: string) => void){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
        var User = connection.model<IUserModel>("User", userSchema);
        User.findOne({nickName: user}, function(err, res){
            if(!err){
                if(res){
                    var Rating = connection.model<IRatingModel>("Rating", ratingSchema);
                    var evaluate = function(players: any[], index: number){
                        var rating = new Rating({
                            day: day,
                            from: user,
                            rating: players[index].note,
                            user: players[index].name
                        });
                        User.findOne({nickName: rating.user}, function(err, res){
                            if(!err){
                                if(res){
                                    var Rating = connection.model<IRatingModel>("Rating", ratingSchema);
                                    Rating.find({day: rating.day, from: rating.from, user: rating.user}, function(err, ratings){
                                        if(!err){
                                            if(!ratings.length){
                                                rating.save(function(err, r){
                                                    console.log("User " + r.from + " has evaluate player "+ r.user +" for the day " + r.day);
                                                    if(index < players.length-1){
                                                        evaluate(players,++index);
                                                    }else{
                                                        callback(1, "");
                                                    }
                                                });
                                            }else{
                                                console.log("User " + rating.from + " has already evaluated player "+ rating.user);
                                                callback(-1, "User " + rating.from + " has already evaluated player "+ rating.user);
                                            }
                                        }else{
                                            callback(-1, err);
                                        }
                                    });
                                }else{
                                    console.log("Unknown user " + rating.user);
                                    callback(-1, "Unknown user " + user);
                                }
                            }else{
                                callback(-1, err);
                            }
                        });
                    };
                    if(players.length){
                        evaluate(players,0);
                    }else{
                        callback(-1, "Any players to evaluate");
                    }
                }else{
                    console.log("Unknown user " + user);
                    callback(-1, "Unknown user " + user);
                }
            }else{
                callback(-1, err);
            }
        });
    }

    averageAll(callback: (code: number, result?: any[], problem?: string) => void){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        var User = connection.model<IUserModel>("User", userSchema);

        User.find(function(err, u){
            if(!err){
                if(u.length){
                    var Rating = connection.model<IRatingModel>("Rating", ratingSchema);
                    
                    var average = function(users: IUserModel[], index: number, result: any[]){
                        Rating.aggregate([{
                            $match: {user: users[index].nickName}
                        },{ 
                            $group: { 
                                _id: {day: '$dayDate', user: '$user'},
                                average: {$avg: '$rating'}
                            }
                        },{
                            $sort: {_id: -1}
                        }, {
                            $limit: 5
                        }], function(err, res){
                            if(!err){
                                if(res.length){
                                    var avg = 0;
                                    res.forEach(function(r){
                                        avg = avg + r.average;
                                    });
                                    avg = avg/res.length;
                                    result.push({"name": users[index].nickName, "avg": avg});
                                }else{
                                    result.push({"name": users[index].nickName, "avg": 10});
                                }
                                if(index<users.length-1){
                                    average(users, ++index, result);
                                }else{
                                    callback(1, result);
                                }
                            }else{
                                callback(-1, err);
                            }
                        });
                    }
                    average(u, 0, []);
                }else{
                    callback(1, [], "Any user existing");
                }
            }else{
                callback(-1, err);
            }
        })
    }

    remove(user: string, callback: (user: string)=>void){
        if(user){
            let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
            var Rating = connection.model<IRatingModel>("Rating", ratingSchema);
            Rating.find({user: user}, function(err, ratings){
                if(!err && ratings.length){
                    var deleteRate = function(ratings: IRatingModel[], index: number, callback: (user: string)=>void){
                        ratings[index].remove(function(err, res){
                            console.log("rating for the user" + user + " deleted for day " + res.day);
                            if(index<ratings.length-1){
                                deleteRate(ratings, ++index, callback);
                            }else{
                                callback(user);
                            }
                        });
                    }
                    deleteRate(ratings, 0, callback);
                }else{
                    callback(user);
                }
            });
        }
    }
}