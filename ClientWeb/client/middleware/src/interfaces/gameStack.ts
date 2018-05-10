import { IMessage } from "./message";
import { IMot } from "./mot";
import { IScore } from "./score";
import { IUser } from "./user";

export interface IGameStack {
    messages: IMessage[];
    scores: IScore[];
    mots: IMot[];
    players: IUser[];
}
