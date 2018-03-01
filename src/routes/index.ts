import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Calendar } from "./../api/calendar";
import { DayManager } from "../api/dayManager";
import { CalendarDay } from "../api/calendarDay";
import { DateFormat } from "../api/dateformat";
import { IUserModel } from "../models/user";
import { VoteManager } from "../api/votemanager";
import { UserDao } from "../api/userdao";
import { TeamGenerator } from "../api/teamgenerator";

/**
 * / route
 *
 * @class User
 */
export class IndexRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    
    console.log("[IndexRoute::create] Creating index route.");

    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next);
    });

    router.get("/team/:day", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      new IndexRoute().team(req, res, next, day);
    });
    
    router.get("/calendar/:day?", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      new IndexRoute().index(req, res, next, day);
    });
    
    router.get("/vote/:day", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      new IndexRoute().initvote(req, res, next, day);
    });

    router.post("/vote/:day/user/:user", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      var user = req.params.user;
      var players = req.body.rating;
      new IndexRoute().vote(req, res, next, day, user, players);
    });

    router.post("/calendar/:day/adduser/:user", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      var user = req.params.user;
      var startDay = req.body.start;
      new IndexRoute().add(req, res, next, day, user, startDay);
    });

    router.post("/calendar/:day/removeuser/:user", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      var user = req.params.user;
      var startDay = req.body.start;
      new IndexRoute().remove(req, res, next, day, user, startDay);
    });

    router.post("/user/:user", (req: Request, res: Response, next: NextFunction) => {
      var user = req.params.user;
      var startDay = req.body.start;
      new IndexRoute().createUser(req, res, next, user, startDay);
    });

    router.post("/deleteuser/:user", (req: Request, res: Response, next: NextFunction) => {
      var user = req.params.user;
      var startDay = req.body.start;
      new IndexRoute().deleteUser(req, res, next, user, startDay);
    });
  }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  public index(req: Request, res: Response, next: NextFunction, day?: string) {
    let calendar: Calendar;
    calendar = new Calendar();

    var cal: CalendarDay[];
    cal = [];
    calendar.get(cal, function(cal, users){
      res.json({ calendar: cal, users: users });
    }, day);
  }

  public team(req: Request, res: Response, next: NextFunction, day: string){
    new TeamGenerator().build(day, function(code, team1, team2, err){
      if(code>0){
        res.json({status: code, team1: team1, team2: team2});
      }else{
        res.json({status: code, error: err});
      } 
    }); 
  }

  public add(req: Request, res: Response, next: NextFunction, day: string, user: string, start: string) {
    new DayManager().suscribe(day, user, function(){
      new IndexRoute().index(req, res, next, start);
    });
  }

  public remove(req: Request, res: Response, next: NextFunction, day: string, userId: string, start: string) {
    new DayManager().unsuscribe(day, userId);
    this.index(req, res, next, start);
  }

  public createUser(req: Request, res: Response, next: NextFunction, user: string, start: string) {
    new UserDao().insert(user);
    this.index(req, res, next, start);
  }

  public deleteUser(req: Request, res: Response, next: NextFunction, user: string, start: string) {
    new DayManager().remove(user, function(user){
      new VoteManager().remove(user, function(user){
        new UserDao().delete(user);
      });
    });

    this.index(req, res, next, start);
  }

  public initvote(req: Request, res: Response, next: NextFunction, day: string){
    new VoteManager().init(day, function(users, players){
      res.json({users: users, players: players});
    });
  }

  public vote(req: Request, res: Response, next: NextFunction, day: string, user: string, players: any[]){
    var manager = new VoteManager();
    manager.evaluateAll(players, user, day, function(s, reason){
      if(s>0){
        manager.averageAll(function(code, result, error){
          if(code>0){
            res.json({status: code, result: result});
          }else{
            res.json({status: code, reason: error});
          }
        });
      }else{
        res.json({status: s, reason: reason});
      }
    });
  }
}