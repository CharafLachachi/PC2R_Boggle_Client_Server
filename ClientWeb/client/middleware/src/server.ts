import * as express from "express";
import * as http from "http";
import * as net from "net";
import * as socketIO from "socket.io";
import { GameStack } from "./classes/gameStack";
import { IMessage } from "./interfaces/message";
import { IScore } from "./interfaces/score";

const port = process.env.PORT || 8746;
const app = express();
const server = new http.Server(app);
const io = socketIO(server);

let timer: NodeJS.Timer;
let mTime: number;
let sessionStack: GameStack;
let timerMax: number;
// let timerCalled: boolean = false;

const startTimer = () => {
    timer = setInterval(() => {
        if (mTime > 0) {
            mTime--;
        } else {
            stopTimer();
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timer);
    if (timerMax !== undefined) {
        mTime = timerMax;
        startTimer();
    } else {
        timer = undefined;
    }
};

io.on("connection", (socket) => {
    // tslint:disable-next-line:no-console
    console.log("User connected on websocket");

    const client = net.createConnection({
        host: "server",
        port: 2018,
    }, () => {
        // tslint:disable-next-line:no-console
        console.log("Connected to server!");
    });
    client.on("data", (data) => {
        data.toString("utf8").trim().split("\n").map((d) => {
            console.log("Received: " + d);
            let mot: string;
            switch (d.toLowerCase().split("/")[0].trim()) {
                case "session":
                    break;
                case "bienvenue":
                    if (sessionStack === undefined) {
                        sessionStack = new GameStack();
                    }
                    sessionStack.newUserConnection(d.toLowerCase().split("/")[1].trim());
                    console.log(`CURRENT GAME STACK ${JSON.stringify(`${sessionStack.sendStack()}\n`)}`);
                    io.emit("message", JSON.stringify(`${sessionStack.sendStack()}\n`));
                    if (timer !== undefined) {
                        io.emit("message", JSON.stringify(`TIMER/${mTime}\n`));
                        console.log(`Timer exists value ${mTime}`);
                    }
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "tour":
                    console.log("TOUR CALLED");
                    if (timer === undefined) {
                        console.log("[MIDDLEWARE]: Timer starts");
                        console.log(`Le timer est set to ${mTime}`);
                        // if (timerCalled === false) {
                        //     io.emit("message", JSON.stringify(`TIMER/${mTime}\n`));
                        // }
                        startTimer();
                    }
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "timer":
                    mTime = +d.toLowerCase().split("/")[1].trim();
                    timerMax = +d.toLowerCase().split("/")[1].trim();
                    // timerCalled = true;
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "rfin":
                    stopTimer();
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "mvalide":
                    mot = d.split("/")[1].trim();
                    sessionStack.addValidMot(mot);
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "minvalide":
                    mot = d.split("/")[1].trim();
                    const raison = d.split("/")[2].trim();
                    sessionStack.addInvalidMot(mot, raison);
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "bilanmots":
                    io.emit("message", JSON.stringify(d) + "\n");
                    const tus = d.toLowerCase().split("/")[2].trim().split("\*");
                    for (let i = 1; i < tus.length; i += 2) {
                        const uname = tus[i];
                        const uscore = +tus[i + 1];
                        sessionStack.changeUserScore(uname, uscore);
                    }
                    break;
                default:
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
            }
        });
    });
    socket.on("message", (m) => {
        // tslint:disable-next-line:no-console
        console.log("Message from client on websocket: %s", m);
        // tslint:disable-next-line:no-console
        console.log(`Sending message ${m} to server`);
        const mt = m.split("/");
        if ((mt[0].toLowerCase() === "envoi") || (mt[0].toLowerCase() === "penvoi")) {
            if (mt[0].toLowerCase() === "envoi")  {
                const message = sessionStack.addNewMessage(mt[1],mt[2]);
                const msend = JSON.stringify(`RECEPTION/${JSON.stringify(message)}`);
                io.emit("message", msend + "\n");
            } else {
                console.log("Private envoi");
                const to = mt[1].toLowerCase();
                const from = mt[2].toLowerCase();
                const message: IMessage = {
                    content: mt[3],
                    send_date: new Date(),
                    username: from,
                };
                const msend = JSON.stringify(`PRECEPTION/${JSON.stringify(to)}/${JSON.stringify(from)}/${JSON.stringify(message)}`);
                io.emit("message", msend + "\n");
            }
        } else {
            if (mt[0].toLowerCase() === "sort") {
                const uname = mt[1];
                console.log(`Removing all stuff of ${uname}`);
                sessionStack.userDisconnect(uname);
                // if (sessionStack.isAnyOneHere() === false) {
                //     stopTimer();
                //     timerCalled = false;
                //     mTime = timerMax;
                //     sessionStack.resetAll();
                // }
            }
            client.write(`${m}\n`);
        }
    });
});

server.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`started on port: ${port}`);
});
