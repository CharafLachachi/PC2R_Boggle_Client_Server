import * as express from "express";
import * as http from "http";
import * as net from "net";
import * as socketIO from "socket.io";

const port = process.env.PORT || 8746;
const app = express();
const server = new http.Server(app);
const io = socketIO(server);

let timer: NodeJS.Timer;
let mTime: number;

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
    timer = undefined;
};

io.on("connection", (socket) => {
    console.log("User connected on websocket");

    const client = net.createConnection({
        host: "server",
        port: 2018,
    }, () => {
        console.log("Connected to server!");
    });
    client.on("data", (data) => {
        data.toString("utf8").trim().split("\n").map((d) => {
            console.log("Received: " + d);
            switch (d.toLowerCase().split("/")[0].trim()) {
                case "tour":
                    console.log("TOUR CALLED");
                    if (timer === undefined) {
                        console.log("[MIDDLEWARE]: Timer starts");
                        console.log(`Le timer est set to ${mTime}`);
                        startTimer();
                    } else {
                        io.emit("message", JSON.stringify(`TIMER/${mTime}\n`));
                        console.log(`Timer exists value ${mTime}`);
                    }
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "timer":
                    mTime = +d.toLowerCase().split("/")[1].trim();
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                case "rfin":
                    stopTimer();
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
                default:
                    io.emit("message", JSON.stringify(d) + "\n");
                    break;
            }
        });
    });
    socket.on("message", (m) => {
        console.log("Message from client on websocket: %s", m);
        console.log(`Sending message ${m} to server`);
        client.write(`${m}\n`);
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
