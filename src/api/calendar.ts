import { DateFormat } from "./dateformat";
import { CalendarDay } from "./calendarDay";
import { User } from "./user";
import mongoose = require("mongoose");
import { IDayModel } from "../models/day";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/user";
import { daySchema } from "../schemas/day";
import { UserDao } from "../api/userdao";
import { WeatherData } from "../api/weatherData";
import { VoteManager } from "../api/votemanager";

export class Calendar {

    private days: CalendarDay[];

    constructor(){
    }

    public get(cal: CalendarDay[], callback : (cal: CalendarDay[], users: any[]) => void, day? : string){
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
            var callbackCalendar = function(cal: CalendarDay[], callback : (cal: CalendarDay[], users: any[])=>void) {
                var actualDay = new CalendarDay(day, users);
                if(cal.length <= 5){
                    cal.push(actualDay);
                    new Calendar().get(cal, callback, actualDay.next.id);
                }else{
                    cal.push(actualDay);
                    new Calendar().updateContent(cal, callback);
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

    private updateContent(cal: CalendarDay[], callback: (cal: CalendarDay[], users: any[])=>void){
        // WEATHER
        const http = require('http');      
        http.get('http://api.apixu.com/v1/forecast.json?key=28c3c44617e84a4f93b102942182002&q=Archamps&days=7', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
        
                // PARSE WEATHER
                var weatherResult = JSON.parse(data);
                var index = 0;
                for(let d of weatherResult.forecast.forecastday){
                    var w = new WeatherData();
                    w.min = d.day.mintemp_c;
                    w.max = d.day.maxtemp_c;
                    w.image = "http:" + d.day.condition.icon;
        
                    var dateformat = new DateFormat();
                    var id = dateformat.format(new Date(d.date));
                    for(let c of cal){
                    if(c.now.id == id){
                        c.now.weather = w;
                    }
                    }
                }
        
                // BUILD USER LIST
                new UserDao().readAll(function(result: IUserModel[]){
        
                    // LOAD AVERAGE RATING
                    new VoteManager().averageAll(function(code, avgResult, err){
                        var usersDays = [];
                        if(code>0){
            
                            // UPDATE USER PARTICIPATION
                            result.forEach(function(u){
                            var cUser = [];
                            cal.forEach(function(c){
                                var participate = false;
                                var style = "day missing";
                                c.users.forEach(function(uDay){
                                if(uDay.nickName == u.nickName && uDay.participate){
                                    participate = true;
                                    style = "day present";
                                }
                                });
                                cUser.push({day: c.now.id, "participate": participate, "style": style});
                            });
            
                            // UPDATE RATING
                            var avg = 0;
                            avgResult.forEach(function(avgRes){
                                if(avgRes.name==u.nickName){
                                avg = avgRes.avg;
                                }
                            });
                            usersDays.push({"name": u.nickName, "days": cUser, "avg": avg});
                            });
                        }
                        callback(cal, usersDays);
                    });
                });
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    buildUserList(){
        
    }
}