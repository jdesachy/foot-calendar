"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = require("./dateformat");
class Day {
    constructor(date) {
        var days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        var months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aou", "Sep", "Oct", "Nov", "Déc"];
        var dateformat = new dateformat_1.DateFormat();
        this.id = dateformat.format(date);
        this.voteOpen = date < new Date();
        this.fullName = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()];
    }
}
exports.Day = Day;
