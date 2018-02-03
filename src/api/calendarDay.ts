import { DateFormat } from "./dateformat";

export class CalendarDay {

    public id: string;

    public previous: string;

    public next: string;

    constructor(day: string){
        let dateformat: DateFormat;
        dateformat = new DateFormat();

        this.id = day;

        let actualDate: Date;
        let previousDate: Date;
        let nextDate: Date;
        actualDate = this.parseDate(day);
        previousDate = this.getOffset(actualDate, -1);
        nextDate = this.getOffset(actualDate, 1);

        this.previous = dateformat.format(previousDate);
        this.next = dateformat.format(nextDate);
    }

    private getOffset(date: Date, offset: number){
        let newDate: Date;
        newDate = new Date();
        newDate.setDate(date.getDate() + offset);
        return newDate;
    }

    private parseDate(id: string){
        var values = id.split("-");
        var yearN = Number(values[2]);
        var monthN = Number(values[1])-1; //le mois est décalé de 1
        var dayN = Number(values[0]);
        return new Date(yearN, monthN, dayN, 0, 0, 0, 0);
    }
}