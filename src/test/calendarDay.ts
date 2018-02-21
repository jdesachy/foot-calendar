import { suite, test } from "mocha-typescript";
import { CalendarDay } from "../api/calendarDay";

@suite
class CalendarDayTest {


    @test("CalendarDay offset")
    public create(){

        let cal: CalendarDay;
        var assert = require("assert");

        cal = new CalendarDay("01-01-2018", []);
        assert.equal(cal.now.id, "01-01-2018", "calendar id");
        assert.equal(cal.previous.id, "31-12-2017", "previous calendar day");
        assert.equal(cal.next.id, "02-01-2018", "next calendar day"); 
    }
}