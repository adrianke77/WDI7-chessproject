var globalBoard = [
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"]
]

// universal position tracker, pieces are updated to here
// stores the names of Piece objects in array index locations
// to access use globalBoard[y][x] 
// where both are zero-index, x increases rightwards and y increases downwards 

var backRowOrder = ["R1", "N1", "B1", "Q1", "K1", "B2", "N2", "R2", ]

// back row pieces per side that need to be made/tracked in the game
// note the left to right order is on a board where white is bottom, black is top

var pieces = {}

// object to store all piece object instances
// stored by key = piece instance name, value = piece instance object 
// captured pieces are deleted from the array
// promoted pawns only have their type changed, do not change key 

var currentPlayer = "W"
  // "B" or "W" to represent whose turn it is

var gameState = ""
  // "waitForPick", "waitForMove"

function Piece(name, color, xPos, yPos, type) {
  //every piece will be an object made here
  //TESTED
  this.name = name
    //Piece names follow this three character notation:
    // color + type + number
    // color: side piece is on
    // type: King, Queen, Rook, Bishop, kNight, Pawn
    // number: which instance of the pieces with same type and color
    // eg BP5 is the fifth pawn on the black side 
  this.color = color //side the piece belongs to
  this.xPos = xPos
  this.yPos = yPos //tracks position on board
  this.type = type //single character representing type, see below comment notes
  this.movedBefore = false //set to true with every move. needed for some checks
  this.validMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
    // zero represents not a valid position to move to
    // pieceSearch functions will put 1's in positions that are valid to move to
}

// MAIN CODE BODY
loadGame()

function loadGame() {
  // help organise the sequence of actions for initially loading page/game
  makePieces()
  updateGlobalBoardArray()
  drawPieces()
  makeListeners()
  currentPlayer = "White"
  gameState = "waitForPick"
}

function restartGame() {
  //to be done
}

function makePieces() {
  //builds all the initial game pieces as instances of Piece and places them in pieces
  //TESTED
  for (var i = 0; i < backRowOrder.length; i++) {
    var pieceName = backRowOrder[i]
    pieces["B" + pieceName] = new Piece("B" + pieceName, "black", i, 0, pieceName.charAt(0))
      //make black backrow
    pieces["W" + pieceName] = new Piece("W" + pieceName, "white", i, 7, pieceName.charAt(0))
      //make white backrow
    pieces["BP" + i] = new Piece("BP" + i, "black", i, 1, "P") //make black pawns
    pieces["WP" + i] = new Piece("WP" + i, "white", i, 6, "P") //make white pawns
  }
}

function updateGlobalBoardArray() {
  //takes positions from the piece objects and updates the globalBoard
  //TESTED
  for (var key in pieces) {
    var currentPiece = pieces[key]
    globalBoard[currentPiece.yPos][currentPiece.xPos] = currentPiece.name
  }
}

function drawPieces() {
  // draws pieces on html from globalBoard array
  // TESTED
  for (var y = 0; y < globalBoard.length; y++) {
    for (var x = 0; x < globalBoard[0].length; x++) {
      $("." + y + x).text(globalBoard[y][x])
    }
  }
}

function makeListeners() {
  // attaches listeners to HTML cells and other buttons
  // TESTED
  globalBoard.forEach(function(row, rowNo, board) {
    row.forEach(function(col, colNo, row) {
      var y = rowNo
      var x = colNo
      $("." + y + x).on("click", function() {
        cellClick(x, y)
      })
    })
  })
}

function cellClick(x, y) {
  // runs logic for what to do when HTML cell is clicked
  console.log("Box at", x, y, "clicked")
}

//MOVE SEARCHING:

function pieceSearch(xpos, ypos, pieceType, boardToSearch, validMoves) {
  // takes a piece and related info and returns array with valid moves added
  // parameters:
  //    x and y positions of origin piece,
  //    type of piece, 
  //    a board array 
  //    a validMoves array
  // Reverse searches are searches that require the target move position to be occupied by
  // specified piece type. Used for check/checkmate to see if origin cell is threatened
  switch (pieceType) {
    case "K":
      console.log("K search triggered")
      break
      return kingSearch(xpos, ypos, boardToSearch, validMoves)
    case "Q":
      console.log("Q search triggered")
      break
      // rookedValidMoves = rookSearch(localBoard,validMovesArray)
      // return bishopSearch(localBoard,rookedValidMovesArray)  
  }
}

function kingSearch(xpos, ypos, boardToSearch, validMoves, isReverseCheck) {
  // checks eight neighbouring cells for valid moves
  // for time being (MVP) no castling check
  // if isReverseCheck(optional) is true, only enemy King locations are validMoves
  if (typeof isReverseCheck === "undefined") isReverseCheck = false
    // search 3 cells a rank in front of and behind piece:
  for (var x = -1; x < 2; x++) {
    ifCellAvailableAddValidMove(xpos + x, ypos - 1, currentPlayer, boardToSearch, validMoves, isReverseCheck, "K")
    ifCellAvailableAddValidMove(xpos + x, ypos + 1, currentPlayer, boardToSearch, validMoves, isReverseCheck, "K")
  }
  // search one cell on either side on same rank
  ifCellAvailableAddValidMove(xpos + 1, ypos, currentPlayer, boardToSearch, validMoves, isReverseCheck, "K")
  ifCellAvailableAddValidMove(xpos - 1, ypos, currentPlayer, boardToSearch, validMoves, isReverseCheck, "K")
}

function ifCellAvailableAddValidMove(
  xpos, ypos, alliedColor, board, validMoves, isReverseCheck, pieceType) {
  // checks a cell on board and if available, sets same cell on validMoves to 1
  // last two parameters optional
  // cell is available if:
  //    isReverseCheck is false and cell is not allied color
  //    isReverseCheck is true and cell is not allied color and cell is of pieceType
  // TESTED

  if (typeof isReverseCheck === "undefined") isReverseCheck = false
  if (ypos < 8 && xpos < 8 && ypos > -1 && xpos > -1) { //reject positions outside board
    if (board[ypos][xpos].charAt(0) !== alliedColor) { //check if cell is not allied (i.e valid move)
      if (!isReverseCheck) {
        validMoves[ypos][xpos] = 1
      } else if (isReverseCheck && board[ypos][xpos].charAt(1) === pieceType) {
        validMoves[ypos][xpos] = 1
      }
    }
  }
}

testVM = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]
currentPlayer = "W"
kingSearch(5, 0, globalBoard, testVM, true)
console.log(testVM)