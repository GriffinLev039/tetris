const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreContainer = document.getElementById('scoreContainer');

//Represents the game board, 0 for unfilled space, 1 for piece player is currently controlling, 2-7 for other pieces. 
const tetrisBoard = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
];


const tetrisDict = {
    "T":[0, 1, 0, 0,
         1, 1, 1, 0,
    ],
    "O":[1, 1, 0, 0,
        1, 1, 0, 0,
    ],
    "I": [1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
    ],
    "S": [0, 1, 1, 0,
        1, 1, 0, 0,
    ],
    "Z": [1, 1, 0, 0,
        0, 1, 1, 0,
    ],
    "L": [1, 0, 0, 0,
        1, 0, 0, 0,
        1, 1, 0, 0,
    ],
    "J": [0, 1, 0, 0,
        0, 1, 0, 0,
        1, 1, 0, 0,
    ],
}

const rotatedDict = {
    "T": [
        [   0, 1, 0, 0,
            1, 1, 0, 0,
            0, 1, 0, 0,

        ], [1, 1, 1, 0,
            0, 1, 0, 0,

        ], [0, 1, 0, 0,
            0, 1, 1, 0,
            0, 1, 0, 0,
        ]
    ],
    "I": [[1, 1, 1, 1,]],
    "S": [[1, 0, 0, 0,
        1, 1, 0, 0,
        0, 1, 0, 0,]],
    "Z": [[0, 1, 0, 0,
        1, 1, 0, 0,
        1, 0, 0, 0,]
    ],
    "L": [[1, 1, 1, 0,
        1, 0, 0, 0,

    ], [1, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,

    ], [0, 0, 1, 0,
        1, 1, 1, 0,

    ]
    ], "J": [[1, 1, 1, 0,
        0, 0, 1, 0,

    ], [1, 1, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,

    ], [1, 0, 0, 0,
        1, 1, 1, 0,

    ]
    ]


}
const heightDict = {
    "T": 75,
    "O": 75,
    "I": 125,
    "S": 75,
    "Z": 75,
    "L": 100,
    "J": 100,
}

let score = 0;
let tempPiece = null;


document.addEventListener('keydown', (event) => {
    if (tempPiece == null) { console.log("null"); return; }
    if (event.key == "ArrowLeft") {
        console.log("moveleft");
        tempPiece.moveLR("ArrowLeft");
    } else if (event.key == "ArrowRight") {
        tempPiece.moveLR("ArrowRight");
    }
})


//FOR TESTING - 
//Pressing x creates a new test piece of random shape.
//Pressing z runs tick(), moving the board forward one state
document.addEventListener('keydown', (event) => {
    const letterArr = ["O", "J", "L", "T", "Z", "S", "I"];
    if (event.key == "c") {
        if (tempPiece == null || !tempPiece.isActive) {
            tempPiece = new TetrisPiece(letterArr[Math.floor(Math.random() * letterArr.length)]);
            tempPiece.writeToBoard();
            tempPiece.renderBoard();
            console.log("tempPiece:" + tempPiece.isActive);
            tempPiece.tickLoop();
        }
    } else if (event.key == "z" || event.key == "UpArrow" ) {
        tempPiece.rotatePiece();
    } else if (event.key == "ArrowDown") {
        tempPiece.tick();
    }
});

function newPiece() {
    const letterArr = ["O", "J", "L", "T", "Z", "S", "I"];
    if (tempPiece == null || !tempPiece.isActive) {
        tempPiece = new TetrisPiece(letterArr[Math.floor(Math.random() * letterArr.length)]);
        scoreCheck();
        tempPiece.writeToBoard();
        tempPiece.renderBoard();
        console.log("tempPiece:" + tempPiece.isActive);
        tempPiece.tickLoop();
    }
}

function scoreCheck() {
    console.log("SCORECHECK");
    let rowsCleared = 0;
    let filledCount = 0;
    for (let i = 0; i < tetrisBoard.length -10; i++) {
        if (tetrisBoard[i] != 0) {filledCount++;}
        if ((i-9)%10 == 0 || i==9) {
            if (filledCount==10) {
                console.log("ROW FILLED!");
                rowsCleared++;
                moveDown(Math.floor(i/10));
            }
            filledCount = 0;
        }
    }
    score+=1000*rowsCleared;
    scoreContainer.textContent = score;
}

function moveDown(targetRow) { //This function and the one above are bad code! DOES NOT WORK!!
    for (let i = 10*targetRow; i > 0; i--) {
        tetrisBoard[i+10] = tetrisBoard[i];
        console.log("PROOF+" +i);

    }
    tempPiece.renderBoard();
}


class TetrisPiece {
    constructor(shapeName) {
        this.shapeName = shapeName; // Name of the shape (e.g., 'T', 'O', 'I', etc.)
        this.heightPos = heightDict[shapeName]; // Initial height position
        this.widthPos = 100; // Initial width position
        this.isActive = true; // Status of the piece
        this.boardxPos = 4;
        this.boardyPos = 0;
        this.rotationState = 0;
    }

    renderBoard() {
        for (let i = 0; i < tetrisBoard.length; i++) {
            if (tetrisBoard[i] != 0 && tetrisBoard[i] != 2) {
                context.fillStyle = "rgba(0,0,0,0.5";
                context.fillRect(25 * (i % 10), 25 * (Math.floor(i / 10)), 25, 25);
            } else if (tetrisBoard[i] == 2) {
                context.fillStyle = "rgba(100,0,0,0.5";
                context.fillRect(25 * (i % 10), 25 * (Math.floor(i / 10)), 25, 25);

            } else {
                context.clearRect(25 * (i % 10), 25 * (Math.floor(i / 10)), 25, 25);

            }
        }
    }

    //Updates the board state, calls writeToBoard and renderBoard.
    tick() {
        // if (this.heightPos == 625) { tempPiece.isActive = false; this.writeToBoard(); tempPiece = null; return; }
        // context.clearRect(this.widthPos, this.heightPos, 125, 125); // Clear previous position
        console.log("tick!");
        if (this.isBelowFree()) {
            this.heightPos += 25; // Move the piece down
            this.boardyPos++;
            this.wipeCurrentPiece();
            this.writeToBoard();
            this.renderBoard(); // Render at new position
        } else {

            this.writeToBoard();
            tempPiece = null;
            newPiece();
        }
    }

    wipeCurrentPiece() {
        for (let i = 0; i < tetrisBoard.length; i++) {
            if (tetrisBoard[i] == 1) {
                tetrisBoard[i] = 0;
            }
        }
    }

    writeToBoard() {
        let chosenShape = null;
        let boardPos = this.boardxPos + (10 * this.boardyPos) - 1;
        if (this.rotationState != 0) {
             chosenShape = rotatedDict[this.shapeName][this.rotationState -1];
        } else {
             chosenShape = tetrisDict[this.shapeName];
        }
        for (let i = 0; i < chosenShape.length; i++) {
            if (chosenShape[i] != 0) {
                if (this.isActive == false) {
                }
                tetrisBoard[boardPos + (i % 4) + (Math.floor(i / 4) * 10)] = this.isActive ? 1 : 2;
            }
        }
    }

    isBelowFree() {
        let boardPos = this.boardxPos + (10 * this.boardyPos) - 1;
        const chosenShape = tetrisDict[this.shapeName];
        for (let i = 0; i < chosenShape.length; i++) {
            if (tetrisBoard[boardPos + (i % 4) + (Math.floor(i / 4) * 10)] == 1 && tetrisBoard[boardPos + (i % 4) + (Math.floor(i / 4) * 10) + 10] >= 2) {
                this.isActive = false;
                return false;
            }
        }
        return true;
    }
    isLFree() {
        let boardPos = this.boardxPos + (10 * this.boardyPos) - 1;
        const chosenShape = tetrisDict[this.shapeName];
        for (let i = 0; i < chosenShape.length; i++) {
            if (tetrisBoard[boardPos + i % 4 + (Math.floor(i / 4) * 10)] == 1) {
                if ((boardPos + i % 4 + (Math.floor(i / 4) * 10)) % 10 == 0) {
                    return false;
                }
            }
            if (tetrisBoard[boardPos + (i % 4) + (Math.floor(i / 4) * 10)] == 1 && tetrisBoard[boardPos + (i % 4) + (Math.floor(i / 4) * 10) - 1] == 2) {
                return false;
            }
        }
        return true;
    }

    isRFree() {
        let boardPos = this.boardxPos + (10 * this.boardyPos) - 1;
        const chosenShape = tetrisDict[this.shapeName];
        for (let i = 0; i < chosenShape.length; i++) {
            if (tetrisBoard[boardPos + i % 4 + (Math.floor(i / 4) * 10)] == 1) {
                if ((boardPos + i % 4 + (Math.floor(i / 4) * 10) + 1) % 10 == 0) {
                    return false;
                }
            }

            if (tetrisBoard[boardPos + (i % 4) + (Math.floor(i / 4) * 10)] == 1 && tetrisBoard[boardPos + (i % 4) + (Math.floor(i / 4) * 10) + 1] == 2) {
                return false;
            }
        }
        return true;

    }

    moveLR(userInput) {
        if (userInput == "ArrowLeft") {
            if (!this.isLFree()) { console.log("NOT FREE NOT FREE"); return; }
            this.boardxPos--;
            console.log(this.boardxPos);
        } else if (userInput == "ArrowRight") {
            if (!this.isRFree()) { console.log("NOT FREE NOT FREE"); return; }
            this.boardxPos++;
            console.log("moveright");
        }
        this.wipeCurrentPiece();
        this.writeToBoard();
        this.renderBoard();
    }

    rotatePiece() {
        if (this.shapeName == "O") {return;}
        if (!this.isRotationValid()) {return;}

        else if (this.shapeName == "I" || this.shapeName == "S" || this.shapeName == "Z") {
            this.rotationState == 0 ? this.rotationState++ : this.rotationState--;
        } else {
            this.rotationState < 3 ? this.rotationState++ : this.rotationState=0;
        }
        this.wipeCurrentPiece();
        this.writeToBoard();
        this.renderBoard();
    }
    
    isRotationValid() {
        console.log("Checking rotation...");
        if (!this.isRFree()) {
            console.log("NOT FREE TO ROTATE R");
        }
        if (!this.isLFree()) {
            console.log("NOT FREE TO ROTATE L");
        }
        if (this.shapeName == "O") {return true;}
        if (this.isRFree() && this.isLFree() && this.isBelowFree()) {
            this.isActive = true;
            console.log("TEST AIHJSIOFASIOJF");
            return true;
        }
        this.isActive = true;
        return false;
    }

    tickLoop() {
        if (this.isActive) {
            this.tick();
            setTimeout(() => this.tickLoop(), 250);
        }
    }   
}


