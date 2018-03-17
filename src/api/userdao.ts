import mongoose = require("mongoose");
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import { ServerEnv } from "../serverEnv";

export class UserDao {

    readAll(callback: (result: IUserModel[]) => void){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
        var User = connection.model<IUserModel>("User", userSchema);
        User.find(function(err, res){
            callback(res);
        });
    }

    insert(user: string){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
        var User = connection.model<IUserModel>("User", userSchema);
        User.find({nickName: user}, function(err, res){
            if(!err){
                if(!res.length){
                    var u = new User({
                        nickName: user
                    });
                    u.save(function(err, uRes){
                        console.log("User "+ user +" inserted with id " + uRes._id);
                    });
                }
            }
        });
    }

    delete(user: string){
        let connection: mongoose.Connection = mongoose.createConnection(ServerEnv.getMongoDBConnection());
        
        var User = connection.model<IUserModel>("User", userSchema);
        User.findOne({nickName: user}, function(err, res){
            if(!err && res){
                res.remove(function(err, r){
                    console.log("User "+ user +" has been deleted");
                });
            }
        });
    }
}