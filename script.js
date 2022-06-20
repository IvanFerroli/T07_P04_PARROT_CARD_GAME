const MINIMUMCARDS = 4;
const MAXIMUMCARDS = 14;
const PARROTTYPES = ['unicornparrot', 'fiestaparrot', 'revertitparrot', 'tripletsparrot', 'explodyparrot', 'bobrossparrot', 'metalparrot'];

let numberOfCards;
let numberOfMoves;
let numberOfRightMoves;
let rounds;
let time;
let myTimer;
let locked;

askGameSize();

function resetVariables() {
    numberOfMoves = 0;
    numberOfRightMoves = 0;
    time = 0;
    rounds = [];
    locked = false;
}

function askGameSize() {
    resetVariables();
    numberOfCards = parseInt(prompt(`Com quantas cartas você quer jogar?\nDigite um número par entre ${MINIMUMCARDS} e ${MAXIMUMCARDS}.`))
    
    while(true) {
        if(isNaN(numberOfCards)) {
            numberOfCards = parseInt(prompt("Você não digitou um número.\nTente novamente!\n\nCom quantas cartas você quer jogar?\nDigite um número par entre 4 e 14."))
        } else if (numberOfCards > MAXIMUMCARDS) {
            numberOfCards = parseInt(prompt("Você digitou um número maior do que 14.\nTente novamente!\n\nCom quantas cartas você quer jogar?\nDigite um número par entre 4 e 14."))
        } else if (numberOfCards < MINIMUMCARDS) {
            numberOfCards = parseInt(prompt("Você digitou um número menor do que 4.\nTente novamente!\n\nCom quantas cartas você quer jogar?\nDigite um número par entre 4 e 14."))
        } else if (numberOfCards%2 === 1) {
            numberOfCards = parseInt(prompt("Você digitou um número ímpar.\nTente novamente!\n\nCom quantas cartas você quer jogar?\nDigite um número par entre 4 e 14."))
        } else if (numberOfCards%2 === 0) {
            setTable();
            break;
        }
    }
}

function setTable() {
    const table = document.querySelector("main");
    table.innerHTML = '';
    
    let chosenParrots = PARROTTYPES.slice(0,numberOfCards/2);
    chosenParrots = chosenParrots.concat(chosenParrots);
    chosenParrots = chosenParrots.sort(comparador);
    
    for (let i = 0; i < chosenParrots.length; i++) {
        table.innerHTML += `
            <article class="card" onclick="chooseCard(this)" data-identifier="card">
                <div class="back" data-identifier="back-face">
                    <img class="${chosenParrots[i]}" src="../src/assets/img/front.png" alt="Parrot">
                </div>
                <div class="front" data-identifier="front-face">
                    <img class="${chosenParrots[i]}" src="../src/assets/img/${chosenParrots[i]}.gif" alt="GIF do ${chosenParrots[i]}">
                </div>
            </article>
        `
    }

    myTimer = setInterval(() => {
        time++;
        const clock = document.querySelector("header p em");
        clock.innerHTML = time;
    }, 1000);
}

function chooseCard(chosenCard) {
    if (!locked && !chosenCard.classList.contains("flip")) {
        chosenCard.classList.add("flip");
        chosenCard.classList.add("current-round");

        const roundId = numberOfMoves/2>>0;

        if (numberOfMoves%2==0) {
            rounds.push({id:roundId,firstCard:"",secondCard:""});
            rounds[roundId].firstCard = chosenCard.querySelector(".front img").className;
        } else {
            rounds[roundId].secondCard = chosenCard.querySelector(".front img").className;
            if (rounds[roundId].firstCard === rounds[roundId].secondCard) {
                numberOfRightMoves++;
                setTimeout(rightPair,1);
                setTimeout(checkEndGame,1001);
            } else {
                locked = true;
                setTimeout(wrongPair,1000);
            }
        }
        numberOfMoves++;
    }
}

function wrongPair(){
    const card = document.querySelectorAll(".current-round");
    for (let i = 0; i < card.length; i++){
        card[i].classList.remove("flip");
        card[i].classList.remove("current-round");
    }
    locked = false;
}

function rightPair(){
    const card = document.querySelectorAll(".current-round");
    for (let i = 0; i < card.length; i++){
        card[i].classList.remove("current-round");
    }
}

function checkEndGame() {
    if (numberOfRightMoves === numberOfCards/2) {
        alert("Você ganhou em " + numberOfMoves + " jogadas e em " + time + " segundos!");
        const askRestartGame = prompt("Você gostaria de jogar novamente? (s/n)");
        clearInterval(myTimer);
        numberOfRightMoves=0;
        if (askRestartGame.toLowerCase()==="s") {askGameSize()}
    }
}

function comparador() {
    return Math.random() - 0.5;
}
