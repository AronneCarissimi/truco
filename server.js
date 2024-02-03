const net = require("net");
const dealer = require("./dealer.js");

// Create a server
const server = net.createServer((socket) => {
    // Generate a unique ID for the client
    const clientId = generateClientId();
    console.log(`Client ${clientId} connected`);

    // Event listener for receiving data from the client
    socket.on("data", (data) => {
        const message = data.toString().trim();
        console.log(`Received from client ${clientId}:`, message);

        // Execute the code in dealer.js
        dealer.execute(message);

        // Send the message back to the client
        socket.write(`${message}`);
    });

    // Event listener for client disconnection
    socket.on("end", () => {
        console.log(`Client ${clientId} disconnected`);
    });
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Function to generate a unique client ID
let lastClientId = 0;
function generateClientId() {
    lastClientId++;
    return lastClientId;
}
