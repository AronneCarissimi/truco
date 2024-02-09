// Generate an array of forty cards
function generateDeck() {
    const deck = [];
    const suits = ["coppe", "ori", "bastoni", "spade"];
    const values = ["1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

function dealCards(deck) {
    const cards = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        cards.push(deck[randomIndex]);
        deck.splice(randomIndex, 1);
    }
    return cards;
}

module.exports = {
    generateDeck,
    dealCards
};
