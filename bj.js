class Card {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    getValue() {
        switch (this.value) {
            case "jack":
                return 10;
            case "queen":
                return 10;
            case "king":
                return 10;
            case "ace":
                return 11;
            default:
                return this.value;
        }
    }
}

class Deck {
    static prepare(arr) {
        suits.forEach(suit => {
            values.forEach(value => {
                const c = new Card(suit, value);
                arr.push(c);
            });
        });
    }
    static getCard(arr) {
        const randomNumber = Math.floor(Math.random() * arr.length);
        console.log(randomNumber);
        const c = arr[randomNumber];
        arr.splice(randomNumber, 1);
        return c;
    }
    static removeCard(arr, value) {

        return arr.filter(function (geeks) {
            return geeks != value;
        });
    }
}
class Hand {
    static getValue(arr) {
        let v = 0;
        arr.forEach(element => {
            v += Number(element.getValue());
        });
        return v;
    }
    static writeCards(arr, user) {
        if (user) {
            console.log("A húzott kártyáid: ");
            document.getElementById("deck").innerHTML = "";
            arr.forEach(element => {
                document.getElementById("deck").innerHTML += " " + element.name + "-" + element.value + ",";
                console.log(element);
            });
        } else {
            console.log("Az ellenfél kártyái: ");
            document.getElementById("deckOp").innerHTML = "";
            arr.forEach(element => {
                document.getElementById("deckOp").innerHTML += " " + element.name + "-" + element.value + ",";
                console.log(element);
            });
        }
    }
}

let deck = [];
let hand = [];
let handOp = [];

const suits = ["hearts","spades","clubs","diamonds"];
const values = ["2","3","4","5","6","7","8","9","10","ace","jack","king","queen"];

function restart() {
    deck = [];
    hand = [];
    handOp = [];
    Deck.prepare(deck);
    document.getElementById("deck").innerText = "";
    document.getElementById("deckVal").innerText = "0";
    document.getElementById("deckOpVal").innerText = "0";
    document.getElementById("deckOp").innerText = "";
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("shuffle").disabled = false;
    document.getElementById("eredmeny").innerText = "";
    document.getElementById("restart").disabled = true;
}

function game() {
    restart();

    hand.push(Deck.getCard(deck));
    hand.push(Deck.getCard(deck));

    handOp.push(Deck.getCard(deck));
    handOp.push(Deck.getCard(deck));

    Hand.writeCards(hand, true);

    console.log("Az összeg: " + Hand.getValue(hand));
    document.getElementById("deckVal").innerText = Hand.getValue(hand);

    console.log("Az ellenfél összeg: " + Hand.getValue(handOp));
    document.getElementById("deckOpVal").innerText = Hand.getValue(handOp);

    Hand.writeCards(handOp, false);

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
    document.getElementById("shuffle").disabled = true;
}
function hit() {
    hand.push(Deck.getCard(deck));
    Hand.writeCards(hand, true);

    if (Hand.getValue(hand) > 21) {
        document.getElementById("deckVal").innerText = Hand.getValue(hand) + " (Busted!)";
        end("Vesztettel!");
    } else {
        console.log("Az összeg: " + Hand.getValue(hand));
        document.getElementById("deckVal").innerText = Hand.getValue(hand);
    }
}
function stand() {
    if (Hand.getValue(hand) > Hand.getValue(handOp)) {

        //handOp frissitese
        while (Hand.getValue(handOp) < Hand.getValue(hand)) {
            handOp.push(Deck.getCard(deck))

            console.log("Az ellenfél összeg: " + Hand.getValue(handOp));
            document.getElementById("deckOpVal").innerText = Hand.getValue(handOp);

            Hand.writeCards(handOp, false);
        }

        if (Hand.getValue(handOp) > 21) {
            document.getElementById("deckOpVal").innerText = Hand.getValue(handOp) + " (Busted!)";
            end("Nyertél!");
        } else if (Hand.getValue(hand) < Hand.getValue(handOp)) //itt nem is kötelező az if 
        {
            end("Vesztettél!");
        }
    } else {
        end("Vesztettél!");
    }
}
function end(msg) {
    //console.log("Az összeg: " + Hand.getValue(hand));
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("eredmeny").innerText = msg;
    document.getElementById("restart").disabled = false;
}