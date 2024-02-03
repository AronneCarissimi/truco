const socket = require("socket");

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
