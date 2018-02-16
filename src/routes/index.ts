import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Calendar } from "./../api/calendar";
import { DayManager } from "../api/dayManager";

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

    // Json response
    res.json({ calendar: calendar.get(day) });
  }

  public add(req: Request, res: Response, next: NextFunction, day: string, user: string) {
    
    new DayManager().suscribe(day, user);

    let calendar: Calendar;
    calendar = new Calendar();
    console.log(day + ", " + user);    
    res.json({ calendar: calendar.get(day) });
  }

  public remove(req: Request, res: Response, next: NextFunction, day: string, user: string) {
    let calendar: Calendar;
    calendar = new Calendar();

    console.log(day + ", " + user);
    // Json response
    res.json({ calendar: calendar.get(day) });
  }
}