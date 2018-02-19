export class User {

    id: string;

    nickName: string;

    participate: boolean;

    constructor(id: string, nickName: string, participate){
        this.id = id;
        this.nickName = nickName;
        this.participate = participate;
    }
}