import mongoose = require("mongoose");
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";

export class UserDao {

    public readNameFromId(id: string): Promise<IUserModel[]>{
        console.log("searching id user " + id);
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        
        var User = connection.model<IUserModel>("User", userSchema);
        const query = User.find({nickName: id});
        return query.exec();
    }
}