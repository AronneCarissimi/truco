const net = require("net");
const readline = require("readline");
const cantos = require("./cantos.js");

// Create a readline interface to read user input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create a TCP socket client
const client = new net.Socket();

// Connect to the server on port 3000
client.connect(3000, "localhost", () => {
    console.log("Connected to server");
});

// keep track of the game state
let gameState = "not started";
let cards = [];
let turn = 0;

// parse the data received from the server from json to an array of objects
client.on("data", (data) => {
    if (gameState === "not started") {
        gameState = "started";
        cards = JSON.parse(data);
        console.log("Received cards:", cards);
        turn = 1;
        tuoTurno();
        return;
    }
    if (gameState === "waiting") {
        if (data.toString() === "truco") {
            cantos.truco();
        } else if (data.toString() === "envido") {
            cantos.envido();
        } else {
            console.log("Received from server:", data.toString());
            console.log(cards);
            if (turn <= 3) {
                tuoTurno();
            } else {
                gameState = "mano terminata";
                client.write("mano terminata");
            }
        }
    }
    if (gameState === "mano terminata") {
        console.log("mano terminata");
        gameState = "not started";
        turn = 0;
        cards = JSON.parse(data);
    }
});

//make the program exit when the server closes
client.on("close", () => {
    console.log("Server closed connection");
    process.exit(0);
});

// Function to read user input and send it to the server
const tuoTurno = () => {
    rl.question("select card to send to the server (0-2)", (input) => {
        if (input != 0 && input != 1 && input != 2) {
            if (input === "exit") {
                client.end();
                console.log("Exiting program");
                process.exit(0);
                return;
            }
            console.log("Invalid input, please try again");
            tuoTurno();
            return;
        }
        if (cards[input] === undefined) {
            console.log("Invalid input, please try again");
            tuoTurno();
            return;
        }
        client.write(input);
        console.log("Sent card to server:", cards[input]);
        turn++;
        cards[input] = undefined;
        gameState = "waiting";
    });
    console.log("turno: " + turn);
};
