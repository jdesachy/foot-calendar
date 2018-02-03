export class DateFormat {

    constructor(){}

    public format(dateToFormat: Date): string {
        var day = dateToFormat.getDate();
        var monthIndex = dateToFormat.getMonth() + 1;
        var year = dateToFormat.getFullYear();

        var dayToString;
        if( day < 10 ){
            dayToString = "0" + day;
        }else{
            dayToString = day.toString();
        }

        var monthString;
        if( monthIndex < 10 ){
            monthString = "0" + monthIndex;
        }else{
            monthString = monthIndex.toString();
        }
        
        return dayToString + "-" + monthString + "-" + year;
    }
}