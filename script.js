const fieldWidth = 12
const fieldHeight = 12
const bombCount = 30;

const fieldGrid = document.querySelector("#field-grid")

const fieldData = Array(fieldHeight).fill(Array()).map(() => Array(fieldWidth).fill(0))

let clearSteps = 5;

function writeText(element, text) {
    element.querySelector("span").innerText = text
}

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
                writeText(getHtmlSpot(i, j), "bomb")
                await delay(10);
            }
        }
    }
}

const getHtmlSpot = (row, col) => document.querySelector(`[row="${row}"][col="${col}"]`)

const clearSpaces = (row, col) => {
    if (--clearSteps < 0) {
        clearSteps = 5;
        return;
    }

    const current = getHtmlSpot(row, col);

    if (current.getAttribute("status") !== "hidden") return;

    current.setAttribute("status", "reveled")
    
    if (current.getAttribute("num") !== "0") {
        current.querySelector("span").className = "game-font";
        writeText(current, current.getAttribute("num"))
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
    e.stopPropagation()
    const element = e.currentTarget

    let row = element.getAttribute("row")
    let col = element.getAttribute("col")

    if (element.getAttribute("data-flagged") === "true") {
        return
    }

    if (fieldData[row][col] == 1) {
        explodeField()
        return
    }

    clearSpaces(row, col)
    clearSteps = 5;
}

const rightClicked = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const element = e.currentTarget;

    if (element.getAttribute("status") === "reveled") {
        return
    }
    
    if (element.getAttribute("data-flagged") === "true") {
        element.setAttribute("data-flagged", false);
        writeText(element, "")

        return
    }
    
    writeText(element, "flag")
    element.setAttribute("data-flagged", true)
}

const startSpots = () => {
    document.querySelectorAll(".spot").forEach( x => {
        x.addEventListener("click", spotClicked);
        x.addEventListener("contextmenu", rightClicked)
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

    if (col - 1 >= 0) {
        count += fieldData[row][col-1];
    }

    if (col + 1 < fieldWidth) {
        count += fieldData[row][col+1];
    }

    if (row - 1 >= 0) {
        count += fieldData[row-1][col];

        if (col - 1 >= 0) {
            count += fieldData[row-1][col-1];
        }
        
        if (col + 1 < fieldWidth) {
            count += fieldData[row-1][col+1];
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
            row.insertAdjacentHTML("beforeend", `
                <div class="spot" row="${i}" col="${j}" status="hidden" data-flagged="false">
                    <span class="material-symbols-outlined"></span>
                </div>
                `);
        }

        fieldGrid.appendChild(row);
    }

    generateBombs()
    startSpots()
    generateHints()
})