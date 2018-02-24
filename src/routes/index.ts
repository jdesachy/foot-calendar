import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Calendar } from "./../api/calendar";
import { DayManager } from "../api/dayManager";
import { CalendarDay } from "../api/calendarDay";
import { WeatherData } from "../api/weatherData";
import { DateFormat } from "../api/dateformat";
import { UserDao } from "../api/userdao";
import { IUserModel } from "../models/user";
import { VoteManager } from "../api/votemanager";

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
    calendar.get(cal, function(cal: CalendarDay[]){

      const http = require('http');
      
      http.get('http://api.apixu.com/v1/forecast.json?key=28c3c44617e84a4f93b102942182002&q=Archamps&days=7', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
          var weatherResult = JSON.parse(data);
          var index = 0;
          for(let d of weatherResult.forecast.forecastday){
            var w = new WeatherData();
            w.min = d.day.mintemp_c;
            w.max = d.day.maxtemp_c;
            w.image = "http:" + d.day.condition.icon;

            var dateformat = new DateFormat();
            var id = dateformat.format(new Date(d.date));
            for(let c of cal){
              if(c.now.id == id){
                c.now.weather = w;
              }
            }
          }
          new UserDao().readAll(function(result: IUserModel[]){
            var usersDays = [];
            result.forEach(function(u){
              var cUser = [];
              cal.forEach(function(c){
                var participate = false;
                var style = "day missing";
                c.users.forEach(function(uDay){
                  if(uDay.nickName == u.nickName && uDay.participate){
                    participate = true;
                    style = "day present";
                  }
                });
                cUser.push({day: c.now.id, "participate": participate, "style": style});
              });
              usersDays.push({"name": u.nickName, "days": cUser});
            });
            res.json({ calendar: cal, users: usersDays });
          });
        });
        }).on("error", (err) => {
          console.log("Error: " + err.message);
      });
    }, day);

  }

  public add(req: Request, res: Response, next: NextFunction, day: string, user: string, start: string) {
    new DayManager().suscribe(day, user);
    this.index(req, res, next, start);
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