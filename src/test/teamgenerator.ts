import { suite, test } from "mocha-typescript";
import { TeamGenerator } from "../api/teamgenerator";

@suite
export class TeamGeneratorTest{

    @test("test sous ensemble de liste")
    buildTest(){
        var teams = new TeamGenerator();
        teams.build("28-02-2018", function(code, t1, t2, err){
            console.log(t1);
            console.log(t2);
        });
    }
}