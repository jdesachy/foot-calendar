import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Calendar } from "./../api/calendar";
import { DayManager } from "../api/dayManager";
import { CalendarDay } from "../api/calendarDay";

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
      res.json({ calendar: cal });
    }, day);

  }

  public add(req: Request, res: Response, next: NextFunction, day: string, user: string) {
    
    new DayManager().suscribe(day, user);
    res.json({ status: "ok" });
    
  }

  public remove(req: Request, res: Response, next: NextFunction, day: string, userId: string) {
    new DayManager().unsuscribe(day, userId);
    res.json({ status: "ok" });
  }
}