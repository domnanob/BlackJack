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
        /*console.log(randomNumber);*/
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
let wallet = 1000;
let objId = 1;
const suits = ["hearts", "spades", "clubs", "diamonds"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "king", "queen"];

const hitButton = document.getElementById("hit");
const canvas = document.getElementById("canvas");
const canvasOp = document.getElementById("canvas-op");
const eredmeny = document.getElementById("eredmeny");
const betInput = document.getElementById("bet-input");
const walletObj = document.getElementById("wallet");
walletObj.innerText = wallet;

function restart() {
    deck = [];
    hand = [];
    handOp = [];
    Deck.prepare(deck);
    canvas.innerHTML = "";
    canvasOp.innerHTML = "";
    eredmeny.innerHTML = "";
    document.getElementById("bet-value").innerText = "Your bet: -"
}

async function hit() {
    hand.push(Deck.getCard(deck));
    createCard(hand[hand.length - 1].value, hand[hand.length - 1].name, canvas);
    await delay(100);
    await flippCard(canvas.getElementsByClassName("card-inner-wrapper")[canvas.getElementsByClassName("card-outer-wrapper").length-1]);
    if (Hand.getValue(hand) > 21) {
        console.log("Your hand: "+ Hand.getValue(hand))
        end("Vesztettel!");
    } else if (Hand.getValue(hand) == 21) {
        console.log("Your hand: " + Hand.getValue(hand));
        end("Black Jack!");
    }
     else {
        console.log("Your hand: " + Hand.getValue(hand));
    }
}
async function stand() {
    await flippCard(canvasOp.getElementsByClassName("card-inner-wrapper")[1]);
    
    if (Hand.getValue(hand) > Hand.getValue(handOp)) {

        //handOp frissitese
        while (Hand.getValue(handOp) < Hand.getValue(hand)) {
            handOp.push(Deck.getCard(deck))
            createCard(handOp[handOp.length - 1].value, handOp[handOp.length - 1].name, canvasOp);
            await delay(100);
            await flippCard(canvasOp.getElementsByClassName("card-inner-wrapper")[canvasOp.getElementsByClassName("card-inner-wrapper").length-1]);
        }

        if (Hand.getValue(handOp) > 21) {
            wallet += betInput.value*2;
            walletObj.innerText = wallet;
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
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("eredmeny").innerText = msg;
    document.getElementById("start").disabled = false;
    document.getElementById("restart").disabled = false;
}
async function start() {
    restart();
    hand.push(Deck.getCard(deck));
    hand.push(Deck.getCard(deck));

    handOp.push(Deck.getCard(deck));
    handOp.push(Deck.getCard(deck));

    createCard(hand[0].value, hand[0].name, canvas);
    createCard(hand[1].value, hand[1].name, canvas);

    createCard(handOp[0].value, handOp[0].name, canvasOp);
    createCard(handOp[1].value, handOp[1].name, canvasOp);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function createCard(Value, Suit, Canvas) {
    const outerContainer = document.createElement("div");
    const innerContainer = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");
    const imgBack = document.createElement("img");

    outerContainer.id = "card-" + objId;
    outerContainer.className = "card-outer-wrapper";
    innerContainer.className = "card-inner-wrapper";
    front.className = "card-front";
    back.className = "card-back";

    imgBack.src = "./cards/SVG-cards-1.3/" + Value + "_of_" + Suit + ".svg";

    back.appendChild(imgBack);
    innerContainer.appendChild(front);
    innerContainer.appendChild(back);
    outerContainer.appendChild(innerContainer);

    Canvas.appendChild(outerContainer);
    objId++;

    await delay(250);

    //innerContainer.classList.add("card-flipp");

    //await delay(1200);
    //document.getElementById("hand-value").innerText = "Your Hand: " + Hand.getValue(hand);
}

async function flippCard(innerContainer) {
    innerContainer.classList.add("card-flipp");
    await delay(1500);
    return;
}
async function startFlipp() {
    if (wallet >= betInput.value && betInput.value > 0)
    {
        document.getElementById("hit").disabled = false;
        document.getElementById("stand").disabled = false;
        document.getElementById("start").disabled = true;
        document.getElementById("bet-value").innerText = "Your bet: "+betInput.value;
        wallet -= betInput.value;
        walletObj.innerText = wallet;
        const array = document.getElementById("canvas").getElementsByClassName("card-outer-wrapper");
        for (let i = 0; i < array.length; i++) {
            flippCard(array[i].getElementsByClassName("card-inner-wrapper")[0]);
            await delay(1200);
        }
        flippCard(document.getElementById("canvas-op").getElementsByClassName("card-outer-wrapper")[0].getElementsByClassName("card-inner-wrapper")[0]);

        if (Hand.getValue(hand) == 21) {
            console.log("Your hand: " + Hand.getValue(hand));
            end("Black Jack!");
            wallet += betInput.value*2;
            walletObj.innerText = wallet;
        }
    } else {
        alert("Helytelen feltét!")
        return;
    }
}

/*function game() {
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
}*/