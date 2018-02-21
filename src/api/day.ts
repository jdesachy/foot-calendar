import { WeatherData } from "./weatherData";
import { DateFormat } from "./dateformat";

export class Day {

    id: string;

    fullName: string;

    weather: WeatherData;
    
    constructor(date: Date){
        var days: string[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        var months: string[] = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
    
        var dateformat = new DateFormat();
        this.id = dateformat.format(date);
        
        this.fullName = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()];
    }
}