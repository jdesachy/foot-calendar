"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateFormat {
    constructor() { }
    format(dateToFormat) {
        var day = dateToFormat.getDate();
        var monthIndex = dateToFormat.getMonth() + 1;
        var year = dateToFormat.getFullYear();
        var dayToString;
        if (day < 10) {
            dayToString = "0" + day;
        }
        else {
            dayToString = day.toString();
        }
        var monthString;
        if (monthIndex < 10) {
            monthString = "0" + monthIndex;
        }
        else {
            monthString = monthIndex.toString();
        }
        return dayToString + "-" + monthString + "-" + year;
    }
}
exports.DateFormat = DateFormat;
