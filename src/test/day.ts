import { suite, test } from "mocha-typescript";
import { Day } from "../api/day";

@suite
export class DayTest{

    @test("test day fullNale")
    public testDay(){
        var day = new Day(new Date());
        var assert = require("assert");

        assert.equal(day.fullName, "Lundi 19 Février");
    }
}