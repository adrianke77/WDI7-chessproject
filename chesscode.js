// general sequence:
// - reset game - board, listeners, drawing etc
// - start game. all steps from below onwards will cycle until checkmate occurs or either player resigns
// - ask player to pick a piece to move
// - build valid move array for that one piece. 
// - cancel choice of piece if no valid moves, revert to piece selection
// - ask player to move chosen piece (according to chess rules, no picking different piece after touch)
// - if move is in valid move array then go to next step, else warn invalid move and revert to move selection
// - do checkcheck on own King on the potential board state resulting from move. if true, player is warned and move is cancelled
// - (should not be possible that all moves result in a check since checkmate check would have been done previous turn)
// - if no issues, do move and update master board. Remove piece from arraypieces if capture occurs
// - update board, pieces etc
// - checkcheck for other player's King position
// - if in check, do checkMateSearch: 
//        run all of other player's pieces for all possible viable moves from current board state, 
//        make a board state for each, and 
//        for each board state, do a checkcheck on other player's King
//        if all checkchecks are true, checkMateSearch is true
//        (holy crap this is computationally expensive)
// - if above checkMateSearch is true, game is over and other player has lost. 
// - else change player and goto line 4 above
// - either player can resign at any time with a button
// - restart button is seperate, so there is a win/lose screen that lasts until restarted

// notes: 
// checkcheck takes a king piece and runs all the piece search functions on it to see if any pieces threaten it, 
//        returns true if threatened. 
// Should be possible to set up search functions to be symmetrical:
// - take arguments of piece object to check, and type of check (attack or defend)
// - attack: scan board starting from piece for valid positions (including enemy positions inside valid moves), update to validmoves
// (then player can do any move and a capture is just moving onto an existing enemy piece)
// - defend: same as above but only returns true for enemy positions, and only for enemies that match the search function's type 

// queenSearch is same as rookSearch followed by bishopSearch

var board = [
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"],
  ["000", "000", "000", "000", "000", "000", "000", "000"]
]

// universal position tracker, pieces are updated to the board 
// board stores the names of Piece objects in array index locations
// to access board use board[y][x]
// this is sort of double storing position information that is already in Piece objects, 
// but otherwise search functions have to access every Piece object once every search
// and the visualisation here helps to troubleshoot

var backRowOrder = ["R1", "N1", "B1", "Q1", "K1", "B2", "N2", "R2", ]

// back row pieces per side that need to be made/tracked in the game
// note the left to right order is on a board where white is bottom, black is top
// in chess the same left-to-right order is on both sides i.e. queen faces queen, king faces king

var arrayPieces = {}

// object to store all piece object instances
// stored by key = piece instance name, value = piece instance object 
// captured pieces are deleted from the array
// promoted pawns only have their type changed, do not change key 

function Piece(name, color, xPos, yPos, type) {
  //every piece will be an object made here
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
    // pieceSearch functions will add ones to positions that are valid to move to
    // so queenSearch will be rookSearch and then bishopSearch sequentially

}

// MAIN CODE BODY
setupGame()


function setupGame() {
  for (var i = 0; i < backRowOrder.length; i++) {
    //make all pieces as Piece instances
    var pieceName = backRowOrder[i]
    arrayPieces["B" + pieceName] = new Piece("B" + pieceName, "black", i, 0, pieceName.charAt(0))
      //make black backrow
    arrayPieces["W" + pieceName] = new Piece("W" + pieceName, "white", i, 7, pieceName.charAt(0))
      //make white backrow
    arrayPieces["BP" + i] = new Piece("BP" + i, "black", i, 1, "P") //make black pawns
    arrayPieces["WP" + i] = new Piece("WP" + i, "white", i, 6, "P") //make white pawns
  }
  updateBoardArray()
  drawPieces()
  makeListeners()
}


function updateBoardArray() {
  for (var key in arrayPieces) {
    var currentPiece = arrayPieces[key]
    board[currentPiece.yPos][currentPiece.xPos] = currentPiece.name
  }
}

function drawPieces() {
  for (var y = 0; y < board.length; y++) {
    for (var x = 0; x < board[0].length; x++) {
      $("." + y + x).text(board[y][x])
    }
  }
}

function makeListeners() {
  board.forEach(function(row, rowNo, board) {
    row.forEach(function(col, colNo, row) {
      var y = rowNo
      var x = colNo
      $("." + y + x).on("click",function () {
      boxClick(x, y)
      })
    })
  })
}

function boxClick(x, y) {
  console.log("Box at", x, y, "clicked")
}


