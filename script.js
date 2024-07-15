const fieldWidth = 12
const fieldHeight = 12
const bombCount = 30;

const fieldGrid = document.querySelector("#field-grid")

const fieldData = Array(fieldHeight).fill(Array()).map(() => Array(fieldWidth).fill(0))

let clear_steps = 20;


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const explodeField = async () => {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldHeight; j++) {
            if (fieldData[i][j] === 1) {
                getHtmlSpot(i, j).innerText = "X";
                await delay(10);
            }
        }
    }
}

const getHtmlSpot = (row, col) => document.querySelector(`[row="${row}"][col="${col}"]`)

const clearSpaces = (row, col) => {
    if (--clear_steps < 0) {
        return;
    }

    const current = getHtmlSpot(row, col);

    if (current.getAttribute("status") !== "hidden") return;

    current.setAttribute("status", "reveled")
    
    if (current.getAttribute("num") !== "0") {
        current.innerText = current.getAttribute("num")
        return;
    }
    
    if (row - 1 >= 0) {
        const up = getHtmlSpot(row-1, col)

        if (up.getAttribute("status") === "hidden") {

            if (up.getAttribute("num") !== null) {
                clearSpaces(row-1, col)
            }
        }

    }

    if (row + 1 < fieldHeight) {
        const down = getHtmlSpot(row+1, col)

        if (down.getAttribute("status") === "hidden") {

            if (down.getAttribute("num") !== null) {
                clearSpaces(row+1, col)
            }
        }

    }

    if (col - 1 >= 0) {
        const left = getHtmlSpot(row, col-1)

        if (left.getAttribute("status") === "hidden") {

            if (left.getAttribute("num") !== null) {
                clearSpaces(row, col-1)
            }
        }

    }

    if (col + 1 < fieldWidth) {
        const right = getHtmlSpot(row, col+1)

        if (right.getAttribute("status") === "hidden") {

            if (right.getAttribute("num") !== null) {
                clearSpaces(row, col+1)
            }
        }

    }
}
  
const spotClicked = (e) => {
    let row = e.getAttribute("row")
    let col = e.getAttribute("col")

    if (fieldData[row][col] == 1) {
        explodeField()
        return
    }

    clearSpaces(row, col)
    clear_steps = 20;
}

const startSpots = () => {
    document.querySelectorAll(".spot").forEach( x => {
        x.addEventListener("click", x => spotClicked(x.target));
    })
}

const generateBombs = () => {
    for (let i = 0; i < bombCount; i++) {
        let x = getRandomInt(fieldHeight);
        let y = getRandomInt(fieldWidth);

        fieldData[x][y] = 1;
    }
}

const countBombsAround = (row, col) => {
    let count = 0;

    if (row - 1 >= 0) {
        count += fieldData[row-1][col];

        if (col - 1 >= 0) {
            count += fieldData[row-1][col-1];
            count += fieldData[row][col-1];
        }
        
        if (col + 1 < fieldWidth) {
            count += fieldData[row-1][col+1];
            count += fieldData[row][col+1];
        }
    }

    
    if (row + 1 < fieldHeight) {
        count += fieldData[row+1][col];

        if (col - 1 >= 0) {
            count += fieldData[row+1][col-1];
        }
        
        if (col + 1 < fieldWidth) {
            count += fieldData[row+1][col+1];
        }
    }

    return count
}

const generateHints = () => {
    let count = 0;
    for (let i = 0; i < fieldWidth; i++) {        
        for (let j = 0; j < fieldHeight; j++) {
            if (fieldData[i][j] == 1) 
                continue;

            count = countBombsAround(i, j);

            document.querySelector(`[row="${i}"][col="${j}"]`).setAttribute("num", count);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < fieldWidth; i++) {
        const row = document.createElement("div");
        row.classList.add("grid-row");
        
        for (let j = 0; j < fieldHeight; j++) {
            row.insertAdjacentHTML("beforeend", `<div class="spot" row="${i}" col="${j}" status="hidden"></div>`);
        }

        fieldGrid.appendChild(row);
    }

    generateBombs()
    startSpots()
    generateHints()
})