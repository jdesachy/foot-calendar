"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const team_1 = require("./team");
const votemanager_1 = require("./votemanager");
const dayManager_1 = require("./dayManager");
class TeamGenerator {
    build(day, callback) {
        new votemanager_1.VoteManager().averageAll(function (code, result, err) {
            if (code > 0) {
                new dayManager_1.DayManager().getUsersForDay(day, function (code, playersForDay) {
                    var avgUserForDay = [];
                    result.forEach(function (r) {
                        playersForDay.forEach(function (p) {
                            if (p == r.name) {
                                avgUserForDay.push(r);
                            }
                        });
                    });
                    var generator = new TeamGenerator();
                    generator.generate(avgUserForDay);
                    callback(1, generator.team1, generator.team2);
                });
            }
            else {
                callback(-1, null, null, err);
            }
        });
    }
    generate(players) {
        this.players = players;
        this.ecart = 100;
        this.combinaison([], players, Math.floor(players.length / 2));
    }
    combinaison(left, right, index) {
        if (index > right.length) {
            return;
        }
        else {
            if (index == 0) {
                var right = [];
                this.players.forEach(function (p) {
                    var contains = false;
                    left.forEach(function (l) {
                        if (l.name == p.name) {
                            contains = true;
                        }
                    });
                    if (!contains) {
                        right.push(p);
                    }
                });
                var t1 = new team_1.Team(left);
                var t2 = new team_1.Team(right);
                if (Math.abs(t1.avg - t2.avg) < this.ecart) {
                    this.team1 = t1;
                    this.team2 = t2;
                    this.ecart = Math.abs(t1.avg - t2.avg);
                }
                return;
            }
            else {
                for (var i = 0; i < right.length; i++) {
                    var leftTemp = [].concat(left);
                    var temp = [];
                    if (i < right.length - 1) {
                        temp = right.slice(i + 1);
                    }
                    leftTemp.push(right[i]);
                    this.combinaison(leftTemp, temp, index - 1);
                }
            }
        }
    }
}
exports.TeamGenerator = TeamGenerator;
