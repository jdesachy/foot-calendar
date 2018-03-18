"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const calendar_1 = require("./../api/calendar");
const dayManager_1 = require("../api/dayManager");
const votemanager_1 = require("../api/votemanager");
const userdao_1 = require("../api/userdao");
const teamgenerator_1 = require("../api/teamgenerator");
class IndexRoute extends route_1.BaseRoute {
    static create(router) {
        console.log("[IndexRoute::create] Creating index route.");
        router.get("/", (req, res, next) => {
            new IndexRoute().index(req, res, next);
        });
        router.get("/team/:day", (req, res, next) => {
            var day = req.params.day;
            new IndexRoute().team(req, res, next, day);
        });
        router.get("/calendar/:day?", (req, res, next) => {
            var day = req.params.day;
            new IndexRoute().index(req, res, next, day);
        });
        router.get("/vote/:day", (req, res, next) => {
            var day = req.params.day;
            new IndexRoute().initvote(req, res, next, day);
        });
        router.post("/vote/:day/user/:user", (req, res, next) => {
            var day = req.params.day;
            var user = req.params.user;
            var players = req.body.rating;
            new IndexRoute().vote(req, res, next, day, user, players);
        });
        router.post("/calendar/:day/adduser/:user", (req, res, next) => {
            var day = req.params.day;
            var user = req.params.user;
            var startDay = req.body.start;
            new IndexRoute().add(req, res, next, day, user, startDay);
        });
        router.post("/calendar/:day/removeuser/:user", (req, res, next) => {
            var day = req.params.day;
            var user = req.params.user;
            var startDay = req.body.start;
            new IndexRoute().remove(req, res, next, day, user, startDay);
        });
        router.post("/user/:user", (req, res, next) => {
            var user = req.params.user;
            var startDay = req.body.start;
            new IndexRoute().createUser(req, res, next, user, startDay);
        });
        router.post("/deleteuser/:user", (req, res, next) => {
            var user = req.params.user;
            var startDay = req.body.start;
            new IndexRoute().deleteUser(req, res, next, user, startDay);
        });
    }
    constructor() {
        super();
    }
    index(req, res, next, day) {
        let calendar;
        calendar = new calendar_1.Calendar();
        var cal;
        cal = [];
        calendar.get(cal, function (cal, users) {
            res.json({ calendar: cal, users: users });
        }, day);
    }
    team(req, res, next, day) {
        new teamgenerator_1.TeamGenerator().build(day, function (code, team1, team2, err) {
            if (code > 0) {
                res.json({ status: code, team1: team1, team2: team2 });
            }
            else {
                res.json({ status: code, error: err });
            }
        });
    }
    add(req, res, next, day, user, start) {
        new dayManager_1.DayManager().suscribe(day, user, function () {
            new IndexRoute().index(req, res, next, start);
        });
    }
    remove(req, res, next, day, userId, start) {
        new dayManager_1.DayManager().unsuscribe(day, userId);
        this.index(req, res, next, start);
    }
    createUser(req, res, next, user, start) {
        new userdao_1.UserDao().insert(user);
        this.index(req, res, next, start);
    }
    deleteUser(req, res, next, user, start) {
        new dayManager_1.DayManager().remove(user, function (user) {
            new votemanager_1.VoteManager().remove(user, function (user) {
                new userdao_1.UserDao().delete(user);
            });
        });
        this.index(req, res, next, start);
    }
    initvote(req, res, next, day) {
        new votemanager_1.VoteManager().init(day, function (users, players) {
            res.json({ users: users, players: players });
        });
    }
    vote(req, res, next, day, user, players) {
        var manager = new votemanager_1.VoteManager();
        manager.evaluateAll(players, user, day, function (s, reason) {
            if (s > 0) {
                manager.averageAll(function (code, result, error) {
                    if (code > 0) {
                        res.json({ status: code, result: result });
                    }
                    else {
                        res.json({ status: code, reason: error });
                    }
                });
            }
            else {
                res.json({ status: s, reason: reason });
            }
        });
    }
}
exports.IndexRoute = IndexRoute;
