import { Team } from "./team";
import { VoteManager } from "./votemanager";
import { DayManager } from "./dayManager";

export class TeamGenerator {

    private players: any[];
    team1: Team;
    team2: Team;
    private ecart: number;

    build(day: string, callback: (code: number, team1: Team, team2: Team, err?: string)=>void){
        new VoteManager().averageAll(function(code, result, err){
            if(code>0){
              new DayManager().getUsersForDay(day, function(code, playersForDay){
                var avgUserForDay = [];
                result.forEach(function(r){
                  playersForDay.forEach(function(p){
                    if(p==r.name){
                      avgUserForDay.push(r);
                    }
                  });
                });

                var generator = new TeamGenerator();
                generator.generate(avgUserForDay);
                callback(1, generator.team1, generator.team2);
              });
            }else{
              callback(-1, null, null, err);
            }
          });
    }

    private generate(players: any[]){
        this.players = players;
        this.ecart = 100;
        this.combinaison([], players, Math.floor(players.length/2));
    }

    private combinaison(left: any[], right: any[], index: number){
        if(index > right.length){
            return;
        }else{
            if(index==0){
                var right = [];
                this.players.forEach(function(p){
                    var contains = false;
                    left.forEach(function(l){
                        if(l.name==p.name){
                            contains = true;
                        }
                    });
                    if(!contains){
                        right.push(p);
                    }
                });
                var t1 = new Team(left);
                var t2 = new Team(right);
                if(Math.abs(t1.avg - t2.avg)<this.ecart){
                    this.team1 = t1;
                    this.team2 = t2;
                    this.ecart = Math.abs(t1.avg - t2.avg);
                }
                return;
            }else{
                
                for(var i=0; i<right.length;i++){
                    var leftTemp = [].concat(left);
                    var temp = [];
                    if(i<right.length-1){
                        temp = right.slice(i+1);
                    }
                    leftTemp.push(right[i]);
                    this.combinaison(leftTemp, temp, index-1);
                }
            }
        }
    }
}