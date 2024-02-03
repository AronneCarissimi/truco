const net = require("net");

// Create a server
const server = net.createServer((socket) => {
    // Generate a unique ID for the client
    const clientId = generateClientId();
    console.log(`Client ${clientId} connected`);

    // Event listener for receiving data from the client
    socket.on("data", (data) => {
        const message = data.toString().trim();
        console.log(`Received from client ${clientId}:`, message);

        // Send the message back to the client
        socket.write(`Server says: ${message}`);
    });

    // Event listener for client disconnection
    socket.on("end", () => {
        console.log(`Client ${clientId} disconnected`);
    });

    // Generate an array of forty cards
    const deck = [];
    const suits = ["coppe", "ori", "bastoni", "spade"];
    const values = ["1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ suit, value });
        }
    }
    console.log(deck);

    // Copy the deck array
    const clientDeck = deck.slice();

    // Send an array of 3 cards to the client
    const cards = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * clientDeck.length);
        cards.push(clientDeck.splice(randomIndex, 1)[0]);
    }
    socket.write(JSON.stringify(cards));

    console.log(`Sent cards to client ${clientId}:`, cards);

    // Keep three cards for the server
    const serverCards = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * clientDeck.length);
        serverCards.push(clientDeck.splice(randomIndex, 1)[0]);
    }

    console.log("Server cards:", serverCards);
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
