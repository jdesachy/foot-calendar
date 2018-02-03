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
    //log
    console.log("[IndexRoute::create] Creating index route.");

    //add home page route
    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next);
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

  public index(req: Request, res: Response, next: NextFunction) {
    let calendar: Calendar;
    calendar = new Calendar();

    // Json response
    res.json({ calendar: calendar.get() });
  }

}