import { DateFormat } from "./dateformat";
import { DayManager } from "../api/dayManager";

export class CalendarDay {

    public id: string;

    public previous: string;

    public next: string;

    public users: string[];

    constructor(day: string){
        let dateformat: DateFormat;
        dateformat = new DateFormat();

        this.id = day;

        let actualDate: Date;
        let previousDate: Date;
        let nextDate: Date;
        actualDate = this.parseDate(day);
        previousDate = this.getOffset(actualDate, -1);
        this.previous = dateformat.format(previousDate);
        nextDate = this.getOffset(actualDate, 1);
        this.next = dateformat.format(nextDate);

        this.updateUsers(day);
    }

    private getOffset(date: Date, offset: number){
        let newDate: Date;
        newDate = new Date();
        newDate.setTime(date.getTime());
        newDate.setDate(date.getDate() + offset);
        return newDate;
    }

    private parseDate(id: string){
        var values = id.split("-");
        var yearN = Number(values[2]);
        var monthN = Number(values[1])-1; //le mois est décalé de 1
        var dayN = Number(values[0]);
        return new Date(yearN, monthN, dayN, 12, 0, 0, 0);
    }

    private updateUsers(day: string){
        this.users = [];
        new DayManager().read(day, this.users, function(users, days){
            console.log("read callback :" + days);
            days.forEach(function(d){
                users.push(d.user);
            });
        });
    }
}