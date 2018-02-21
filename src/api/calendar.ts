import { DateFormat } from "./dateformat";
import { CalendarDay } from "./calendarDay";
import { User } from "./user";
import mongoose = require("mongoose");
import { IDayModel } from "../models/day";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import { daySchema } from "../schemas/day";

export class Calendar {

    private days: CalendarDay[];

    constructor(){
    }

    public get(cal: CalendarDay[], callback : (cal: CalendarDay[]) => void, day? : string){
        if(!day){
            let dateformat: DateFormat;
            dateformat = new DateFormat();
            day = dateformat.format(new Date());
        }

        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";
        let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        var Day = connection.model<IDayModel>("Day", daySchema);
        var query = Day.find({id: day}, function(err, daysDB){
            if(err){
                console.log(err);
            }
            var users: User[];
            users = [];
            var UserModel = connection.model<IUserModel>("User", userSchema);
            
            var inc = 0;
            var callbackCalendar = function(cal: CalendarDay[], callback : (cal: CalendarDay[])=>void) {
                var actualDay = new CalendarDay(day, users);
                if(cal.length <= 7){
                    cal.push(actualDay);
                    new Calendar().get(cal, callback, actualDay.next.id);
                }else{
                    cal.push(actualDay);
                    callback(cal);
                }
            }
            
            var userFindById = function(daysDB: IDayModel[], inc: number){
                UserModel.findOne({ nickName: daysDB[inc].user }, function(err, u){
                    users.push(new User(u.nickName, daysDB[inc].participate));
                    if(inc < daysDB.length-1){
                        userFindById(daysDB, ++inc);
                    }else{
                        callbackCalendar(cal, callback);
                    }
                });
            }

            if(daysDB.length){
                userFindById(daysDB, 0);
            }else{
                callbackCalendar(cal, callback);
            }
        });
        
    }
}