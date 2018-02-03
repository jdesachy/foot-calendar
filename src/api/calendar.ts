import { DateFormat } from "./dateformat";
import { CalendarDay } from "./calendarDay";

export class Calendar {

    private days: CalendarDay[];

    constructor(){
    }

    public get(day? : string){
        if(!day){
            let dateformat: DateFormat;
            dateformat = new DateFormat();
            day = dateformat.format(new Date());
        }

        this.days = [];
        this.days.push(new CalendarDay(day));
        this.days.push(new CalendarDay(this.days[0].next));
        this.days.push(new CalendarDay(this.days[1].next));
        this.days.push(new CalendarDay(this.days[2].next));
        this.days.push(new CalendarDay(this.days[3].next));
        this.days.push(new CalendarDay(this.days[4].next));
        this.days.push(new CalendarDay(this.days[5].next));
        return this.days;
    }

    private getDateOffset(offset: number){
        var newDate = new Date();
        newDate.setDate(new Date().getDate() + offset)
        return newDate;
      }
}