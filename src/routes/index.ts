import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { Calendar } from "./../api/calendar";

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

}