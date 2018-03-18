"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const teamgenerator_1 = require("../api/teamgenerator");
let TeamGeneratorTest = class TeamGeneratorTest {
    buildTest() {
        var teams = new teamgenerator_1.TeamGenerator();
        teams.build("28-02-2018", function (code, t1, t2, err) {
            console.log(t1);
            console.log(t2);
        });
    }
};
__decorate([
    mocha_typescript_1.test("test sous ensemble de liste")
], TeamGeneratorTest.prototype, "buildTest", null);
TeamGeneratorTest = __decorate([
    mocha_typescript_1.suite
], TeamGeneratorTest);
exports.TeamGeneratorTest = TeamGeneratorTest;
