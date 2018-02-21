import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Calendar } from "./../api/calendar";
import { DayManager } from "../api/dayManager";
import { CalendarDay } from "../api/calendarDay";
import { WeatherData } from "../api/weatherData";
import { DateFormat } from "../api/dateformat";
import { UserDao } from "../api/userdao";
import { IUserModel } from "../models/user";

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
    
    router.post("/calendar/:day/adduser/:user", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      var user = req.params.user;
      new IndexRoute().add(req, res, next, day, user);
    });

    router.post("/calendar/:day/removeuser/:user", (req: Request, res: Response, next: NextFunction) => {
      var day = req.params.day;
      var user = req.params.user;
      new IndexRoute().remove(req, res, next, day, user);
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
          res.json({ calendar: cal });
        });
        }).on("error", (err) => {
          console.log("Error: " + err.message);
      });
    }, day);

  }

  public add(req: Request, res: Response, next: NextFunction, day: string, user: string) {
    new DayManager().suscribe(day, user);
    new UserDao().readAll(function(result: IUserModel[]){
      res.json({ status: "ok", users: result });
    });
  }

  public remove(req: Request, res: Response, next: NextFunction, day: string, userId: string) {
    new DayManager().unsuscribe(day, userId);
    new UserDao().readAll(function(result: IUserModel[]){
      res.json({ status: "ok", users: result });
    });
  }
}