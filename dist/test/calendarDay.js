"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const calendarDay_1 = require("../api/calendarDay");
let CalendarDayTest = class CalendarDayTest {
    create() {
        let cal;
        var assert = require("assert");
        cal = new calendarDay_1.CalendarDay("01-01-2018", []);
        assert.equal(cal.now.id, "01-01-2018", "calendar id");
        assert.equal(cal.previous.id, "31-12-2017", "previous calendar day");
        assert.equal(cal.next.id, "02-01-2018", "next calendar day");
    }
};
__decorate([
    mocha_typescript_1.test("CalendarDay offset")
], CalendarDayTest.prototype, "create", null);
CalendarDayTest = __decorate([
    mocha_typescript_1.suite
], CalendarDayTest);
