const net = require("net");
const dealer = require("./dealer.js");
const { truco } = require("./cantos.js");

// Create a server
const server = net.createServer((socket) => {
    // Generate a unique ID for the client
    const clientId = generateClientId();
    console.log(`Client ${clientId} connected`);

    // Initialize the game

    //keep track of the score

    let clientScore = 0;
    let serverScore = 0;

    //keep track of the hand score
    let clientHandScore = 0;
    let serverHandScore = 0;

    let trucoMultiplier = 1;

    const { clientCards, serverCards } = initGame();
    console.log("Client cards:", clientCards);
    console.log("Server cards:", serverCards);

    // Keep track of the game state

    let gameState = "waiting";

    // Send the client the initial cards
    socket.write(JSON.stringify(clientCards));

    // Event listener for receiving data from the client
    socket.on("data", (data) => {
        console.log("Received from client:", data.toString().trim());
        console.log("gamestate:", gameState);

        const message = data.toString().trim();
        console.log(`Received from client ${clientId}:`, message);
        if (gameState === "waiting") {
            const cardIndex = parseInt(message);
            if (true) {
                if (serverCards.length > 0) {
                    const card = clientCards[cardIndex];
                    console.log(`Client ${clientId} selected card:`, card);
                    // select a card to send to the client
                    const serverCardIndex = Math.floor(
                        Math.random() * serverCards.length
                    );
                    const serverCard = serverCards[serverCardIndex];
                    console.log(`Server selected card:`, serverCard);
                    // send the selected card to the client
                    socket.write(JSON.stringify(serverCard));
                    // remove the selected card from the server's hand
                    serverCards.splice(serverCardIndex, 1);
                    // compare the cards
                    if (card.value > serverCard.value) {
                        clientHandScore += 1;
                    } else if (card.value < serverCard.value) {
                        serverHandScore += 1;
                    } else if (card.value === serverCard.value) {
                        clientHandScore += 1;
                        serverHandScore += 1;
                        if (clientHandScore === 2 || serverHandScore === 2) {
                            clientHandScore -= 1;
                            serverHandScore -= 1;
                        }
                    }

                    // change the game state
                    gameState = "waiting";
                }
                // check if the game is over
                if (clientHandScore == 2 || serverHandScore == 2) {
                    console.log("mano terminata");
                    gameState = "mano terminata";

                    // calculate the hand score
                    if (clientHandScore > serverHandScore) {
                        clientScore += 1 * trucoMultiplier;
                    } else {
                        serverScore += 1 * trucoMultiplier;
                    }
                    // check if the game is over
                    if (clientScore == 15 || serverScore == 15) {
                        console.log("partita terminata");
                        socket.write("partita terminata");
                        // reset the game
                        clientScore = 0;
                        serverScore = 0;
                    }
                    // reset the hand score
                    clientHandScore = 0;
                    serverHandScore = 0;
                    // reset the cards
                    const { clientCards, serverCards } = initGame();
                    console.log("Client cards:", clientCards);
                    console.log("Server cards:", serverCards);
                    // send the client the initial cards
                    socket.write(JSON.stringify(clientCards));
                    gameState = "waiting";
                }
            }
            return;
        }
        // Check if the message is a valid card selection
    });

    // Event listener for client disconnection
    socket.on("end", () => {
        console.log(`Client ${clientId} disconnected`);
        // Close the socket
        socket.end();
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

function initGame() {
    let deck = dealer.generateDeck();
    let clientCards = dealer.dealCards(deck);
    let serverCards = dealer.dealCards(deck);
    return { clientCards, serverCards };
}
