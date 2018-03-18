"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = require("./dateformat");
const day_1 = require("./day");
class CalendarDay {
    constructor(day, users) {
        let dateformat;
        dateformat = new dateformat_1.DateFormat();
        let actualDate;
        let previousDate;
        let nextDate;
        actualDate = this.parseDate(day);
        this.now = new day_1.Day(actualDate);
        previousDate = this.getOffset(actualDate, -1);
        this.previous = new day_1.Day(previousDate);
        nextDate = this.getOffset(actualDate, 1);
        this.next = new day_1.Day(nextDate);
        this.users = users;
        var sum = 0;
        this.users.forEach(function (u) {
            if (u.participate) {
                sum++;
            }
        });
        this.totalParticipant = sum;
    }
    getOffset(date, offset) {
        let newDate;
        newDate = new Date();
        newDate.setTime(date.getTime());
        newDate.setDate(date.getDate() + offset);
        return newDate;
    }
    parseDate(id) {
        var values = id.split("-");
        var yearN = Number(values[2]);
        var monthN = Number(values[1]) - 1;
        var dayN = Number(values[0]);
        return new Date(yearN, monthN, dayN, 14, 0, 0, 0);
    }
}
exports.CalendarDay = CalendarDay;
