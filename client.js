const net = require("net");
const readline = require("readline");

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
// parse the data received from the server from json to an array of objects
client.on("data", (data) => {
    const cards = JSON.parse(data);
    console.log("Received cards:", cards);
});

//make the program exit when the server closes
client.on("close", () => {
    console.log("Server closed connection");
    process.exit(0);
});

// Function to read user input and send it to the server
const sendInputToServer = () => {
    rl.question(
        "Enter a string to send to the server (or 'exit' to quit): ",
        (input) => {
            if (input.toLowerCase() === "exit") {
                rl.close();
                client.end(); // Close the connection to the server
                console.log("Connection closed");
            } else {
                client.write(input);
                sendInputToServer(); // Call the function recursively to keep asking for input
            }
        }
    );
};

// Start asking for user input
sendInputToServer();
