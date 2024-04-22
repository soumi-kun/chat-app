import { Msgs } from "./message.model";

export interface User{
    id: string;
    username: string;
    name: string;
    password: string;
    signalrId: string;
    msgs: Array<Msgs>;
}