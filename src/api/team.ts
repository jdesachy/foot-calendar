export class Team {

    players: any[];
    avg: number;

    constructor(players: any[]){
        this.players = players;
        var sum = 0;
        players.forEach(function(p){
            sum = sum + p.avg;
        });
        this.avg = sum/players.length;
    }
}