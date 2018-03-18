"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Team {
    constructor(players) {
        this.players = players;
        var sum = 0;
        players.forEach(function (p) {
            sum = sum + p.avg;
        });
        this.avg = sum / players.length;
    }
}
exports.Team = Team;
