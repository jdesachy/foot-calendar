import { DateFormat } from "./dateformat";
import { User } from "./user";
import { Day } from "./day";

export class CalendarDay {

    public now: Day;

    public previous: Day;

    public next: Day;

    public users: User[];

    public totalParticipant: number;

    constructor(day: string, users : User[]){
        let dateformat: DateFormat;
        dateformat = new DateFormat();

        let actualDate: Date;
        let previousDate: Date;
        let nextDate: Date;
        actualDate = this.parseDate(day);
        this.now = new Day(actualDate);
        previousDate = this.getOffset(actualDate, -1);
        this.previous = new Day(previousDate);
        nextDate = this.getOffset(actualDate, 1);
        this.next = new Day(nextDate);

        this.users = users;
        var sum = 0;
        this.users.forEach(function(u){
            if(u.participate){
                sum++;
            }
        });

        this.totalParticipant = sum;
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

}