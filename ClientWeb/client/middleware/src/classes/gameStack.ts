import { IGameStack } from "./../interfaces/gameStack";
import { IMessage } from "./../interfaces/message";
import { IMot } from "./../interfaces/mot";
import { IScore } from "./../interfaces/score";
import { IUser } from "./../interfaces/user";

export class GameStack implements IGameStack {
    public messages: IMessage[];
    public scores: IScore[];
    public mots: IMot[];
    public players: IUser[];

    constructor() {
        this.messages = new Array<IMessage>();
        this.scores = new Array<IScore>();
        this.mots = new Array<IMot>();
        this.players = new Array<IUser>();
    }

    public addValidMot(mot: string) {
        this.mots.push({word: mot, status: "valide"});
    }

    public addInvalidMot(mot: string, raison: string) {
        let rText: string;
        switch (raison) {
            case "MotInexistantDansLeDictio":
                rText = `Le mot ${mot} n'existe pas dans la dictionnaire`;
                break;
            case "MauvaiseTrajectoire":
                rText = "Les cases doivent être voisin";
                break;
            case "TrajectoireNeCorrespondPasAuMot":
                rText = "La trajectoire ne correspond pas au mot";
                break;
            case "PRIMotDejaPropose":
                rText = `Le mot ${mot} est déjà proposé`;
                break;
            default:
                rText = "Le mot est invalide. Mais la raison est inconnue";
                break;
        }
        if (
            (rText.indexOf("est déjà proposé") === -1) &&
            (this.mots.filter((w) => w.word === mot).length === 0)
            ) {
                this.mots.push({word: mot, status: "invalide", raison: rText});
            }
    }

    public changeUserScore(username: string, score: number) {
        console.log(`Change user score called with username ${username} and score ${score}`);
        console.log(this.scores);
        this.scores.filter((s: IScore) => s.username.toLowerCase() === username.toLowerCase())[0].score = score;
    }

    public addToUserScore(username: string, score: number) {
        this.scores.filter((s) => s.username === username)[0].score += score;
    }

    public addNewMessage(username: string, content: string) {
        const message = {username, content, send_date: new Date()};
        this.messages.push(message);
        return message;
    }

    public resetAll() {
        this.messages = new Array<IMessage>();
        this.scores = new Array<IScore>();
        this.mots = new Array<IMot>();
    }

    public sendStack(): string {
       return "GAMESTACK/" +
              `MOTS/${JSON.stringify(this.mots)}` +
              `/SCORES/${JSON.stringify(this.scores)}` +
              `/MESSAGES/${JSON.stringify(this.messages)}` +
              `/PLAYERS/${JSON.stringify(this.players)}`;
    }

    public newUserConnection(username: string) {
        this.players.push({username});
        this.scores.push({username, score: 0});
    }

    public isAnyOneHere(): boolean {
        return this.players.length > 0;
    }

    public userDisconnect(username: string) {
        console.log(`Players before disconnect ${JSON.stringify(this.players)}`);
        this.players.splice(this.players.indexOf({username}), 1);
        console.log(`Players after disconnect ${JSON.stringify(this.players)}`);
        console.log(`Scores before disconnect ${JSON.stringify(this.scores)}`);
        this.scores.splice(this.scores.indexOf(this.scores.filter((s) => s.username === username)[0]), 1);
        console.log(`Scores after disconnect ${JSON.stringify(this.scores)}`);
        console.log(`Messages before disconnect ${JSON.stringify(this.messages)}`);
        const mToDelete = this.messages.filter((m) => m.username === username);
        for (const message of mToDelete) {
            const idx = this.messages.indexOf(message);
            this.messages.splice(idx, 1);
        }
        console.log(`Messages after disconnect ${JSON.stringify(this.messages)}`);
    }
}
