import { DateFormat } from "./dateformat";
import { CalendarDay } from "./calendarDay";
import { daySchema } from "../schemas/day";
import { DayManager } from "../api/dayManager";
import { User } from "./user";
import { UserDao } from "./userDao";

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

        
        new DayManager().read(day, function(days){
            var users: User[];
            users = [];
            var userDao = new UserDao();
            days.forEach(function(d){
                var name = await userDao.readNameFromId(d.user);
                console.log("dao return " + name);
                users.push(new User(d.user, this.name, d.participate));
            });

            var actual = new CalendarDay(day, users);
            cal.push(actual);
            if( cal.length <= 7 ){
                new Calendar().get(cal, callback, actual.next);
            }else{
                callback(cal);
            }
            
        });
    }
}