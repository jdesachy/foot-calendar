export class User {

    nickName: string;

    participate: boolean;

    constructor(nickName: string, participate){
        this.nickName = nickName;
        this.participate = participate;
    }
}