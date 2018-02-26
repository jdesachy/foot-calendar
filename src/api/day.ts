import { WeatherData } from "./weatherData";
import { DateFormat } from "./dateformat";

export class Day {

    id: string;

    fullName: string;

    weather: WeatherData;
    
    voteOpen: Boolean;

    constructor(date: Date){
        var days: string[] = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        var months: string[] = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aou", "Sep", "Oct", "Nov", "Déc"];
    
        var dateformat = new DateFormat();
        this.id = dateformat.format(date);
        this.voteOpen = date < new Date();
        this.fullName = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()];
    }
}