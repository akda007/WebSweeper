const fieldWidth = 6
const fieldHeight = 6
const bombCount = 6;

const fieldGrid = document.querySelector("#field-grid")

const fieldData = Array(fieldHeight).fill(Array()).map(() => Array(fieldWidth).fill(0))


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  
const spotClicked = (e) => {
    let row = e.getAttribute("row")
    let col = e.getAttribute("col")

    if (fieldData[row][col] == 1) {
        alert("Booom!");
        return
    }

    e.setAttribute("status", "reveled")
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