const backRowOrder = ["R", "N", "B", "Q", "K", "B", "N", "R", ]
  // left to right on a board with black starting at top, white starting at 
  // bottom


function Piece(type, color) {
  //every piece will be an object made here
  this.color = color //side the piece belongs to
  this.type = type //single character representing type
    // King, Queen, Rook, Bishop, kNight, Pawn
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
    // stores valid moves to rest of board starting from position of piece
    // zero represents not a valid position to move to
    // pieceSearch functions will put 1's in positions that are valid 
    // enPassant will put 2's to mark enemy pawn behind to be captured
}


function Board() {
  this.layout = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ]
    // to be filled up by .makePieces with Piece objects`
}
Board.prototype.fillStartingBoard = function() {
  //makes every Piece instance by calling MakePiece individually for each 
  //piece and storing the instances in .layout
  //TESTED
  for (var i = 0; i < backRowOrder.length; i++) {
    this.layout[0][i] = this.makePiece(backRowOrder[i], "B")
    this.layout[7][i] = this.makePiece(backRowOrder[i], "W")
    this.layout[1][i] = this.makePiece("P", "B")
    this.layout[6][i] = this.makePiece("P", "W")
  }
}
Board.prototype.makePiece = function(type, color) {
  var newPiece = new Piece(type, color)
  if (type != "P") return newPiece
    // if not a pawn, return th objecte basic Piece
    // if pawn, continue to make Pawn object
  var newPawn = Object.create(newPiece, {
    "justDoubleMoved": {
      value: false
    }
  })
  return newPawn
}
Board.prototype.isThisPieceMine = function(x, y, player) {
  if (this.layout[y][x].color === player) return true
  return false
}
Board.prototype.pickPiece = function(x, y, player) {
  this.makeValidMoves(x, y, player)
  if (this.areThereValidMoves(x, y) === false) return false
  return true
}
Board.prototype.movePiece = function(pieceX, pieceY, targetX, targetY, player) {
  if (board.layout[pieceY][pieceX].validMoves[targetY][targetX] === 1) {
    board.layout[targetY][targetX] = board.layout[pieceY][pieceX]
    board.layout[pieceY][pieceX] = null
    return true
  }
  return false
}
Board.prototype.areThereValidMoves = function(x, y, player) {
  this.makeValidMoves(x, y, player)
  result = false
  this.layout[y][x].validMoves.forEach(function(row) {
    if (row.indexOf(1) > -1) {
      result = true
    }
  })
  return result
}
Board.prototype.makeValidMoves = function(x, y, player, special) {
  //special is optional argument 
  //updates the ValidMoves array of piece at position x,y
  //if no ValidMoves were added, returns false, else true
  for (var i = 0; i < 8; i++)
    for (var j = 0; j < 8; j++)
      this.layout[y][x].validMoves[j][i] = 0 //empty existing ValidMoves array
  switch (this.layout[y][x].type) {
    case "K":
      this.kingMovesSearch(x, y, player, special)
      break
    case "R":
      this.rookMovesSearch(x, y, player, special)
      break
    case "B":
      this.bishopMovesSearch(x, y, player, special)
      break
    case "N":
      this.knightMovesSearch(x, y, player, special)
      break
    case "P":
      this.pawnMovesSearch(x, y, player, special)
      break
    case "Q":
      this.queenMovesSearch(x, y, player, special)
      break
  }
}
Board.prototype.kingMovesSearch = function(x, y, player, special) {
  //TESTED
  // no castling yet
  for (var i = -1; i < 2; i++) {
    this.addMoveIfValid(x, y, x + i, y - 1, player, special)
    this.addMoveIfValid(x, y, x + i, y + 1, player, special)
  } //check north and south 6 cells and add to validMoves
  this.addMoveIfValid(x, y, x - 1, y, player, special)
  this.addMoveIfValid(x, y, x + 1, y, player, special)
    // check cell to west and cell to east
}
Board.prototype.rookMovesSearch = function(x, y, player, special) {
  var blocks = [1, 1, 1, 1] //N S E W 
    //track whether search directions have encountered a block
    //for every cell check, will store:
    // 0 is allied piece, blocked
    // 1 is not blocked(first check, or last cell checked was null)
    // 2 is enemy piece, blocked
  for (var i = 1; i < 8; i++) {
    if (blocks[0] === 1)
      blocks[0] = this.addMoveIfValid(x, y, x, y - i, player, special)
    if (blocks[1] === 1)
      blocks[1] = this.addMoveIfValid(x, y, x, y + i, player, special)
    if (blocks[2] === 1)
      blocks[2] = this.addMoveIfValid(x, y, x + i, y, player, special)
    if (blocks[3] === 1)
      blocks[3] = this.addMoveIfValid(x, y, x - i, y, player, special)
  }
}
Board.prototype.bishopMovesSearch = function(x, y, player, special) {
  var blocks = [1, 1, 1, 1] //NE SE SW NW
    // similar logic to rookSearch, see above
  for (var i = 1; i < 8; i++) {
    if (blocks[0] === 1)
      blocks[0] = this.addMoveIfValid(x, y, x + i, y - i, player, special)
    if (blocks[1] === 1)
      blocks[1] = this.addMoveIfValid(x, y, x + i, y + i, player, special)
    if (blocks[2] === 1)
      blocks[2] = this.addMoveIfValid(x, y, x - i, y + i, player, special)
    if (blocks[3] === 1)
      blocks[3] = this.addMoveIfValid(x, y, x - i, y - i, player, special)
  }
}
Board.prototype.queenMovesSearch = function(x, y, player, special) {
  this.rookMovesSearch(x, y, player, special)
  this.bishopMovesSearch(x, y, player, special)
    //feelsgoodman.jpg
}
Board.prototype.knightMovesSearch = function(x, y, player, special) {
  this.addMoveIfValid(x, y, x + 1, y - 2, player, special)
  this.addMoveIfValid(x, y, x + 1, y + 2, player, special)
  this.addMoveIfValid(x, y, x + 2, y - 1, player, special)
  this.addMoveIfValid(x, y, x + 2, y + 1, player, special)
  this.addMoveIfValid(x, y, x - 1, y + 2, player, special)
  this.addMoveIfValid(x, y, x - 1, y - 2, player, special)
  this.addMoveIfValid(x, y, x - 2, y - 1, player, special)
  this.addMoveIfValid(x, y, x - 2, y + 1, player, special)
    //feelsbadman.jpg maybe refactor later
}
Board.prototype.pawnMovesSearch = function(x, y, player, special) {
    //CHECKCHECK FUNCTION NOT ADDED YET
    // no en passant for time being
    var forwardDir =
      player === "W" ? -1 : 1
      // if white forward direction is -y, if black forward is +y
    var homeRank =
      player === "W" ? 6 : 1
      // if white starting rank (y position) is 6, if black 1 
    if (this.addMoveIfValid(x, y, x, y + forwardDir, player, 1) === 1
      // check one cell forward, add move if null
      && y === homeRank) {
      this.addMoveIfValid(x, y, x, y + 2 * forwardDir, player, 1)
    }
    // if one cell forward is null and current cell is at homerank, 
    // check two cells forward, add move if null
    this.addMoveIfValid(x, y, x + 1, y + forwardDir, player, 2)
    this.addMoveIfValid(x, y, x - 1, y + forwardDir, player, 2)
      // add move if enemy piece is diagonal forward to either side
      // this.addEnPassantIfValid(x, y, player)
  }
  // Board.prototype.addEnPassantIfValid =
  //   function(pieceX, pieceY, player) {
  //     var fifthRank =
  //       player === "W" ? 3 : 4
  //       // add En Passant move if valid
  //       // this adds a "2" into Valid Moves instead of "1"
  //       // to flag that enemy pawn behind piece after move is to be removed
  //       var piece = this.layout[pieceY][pieceX]
  //     if (pieceY === fifthRank)

//   }
Board.prototype.addMoveIfValid =
  function(pieceX, pieceY, targetX, targetY, player, special, pieceType) {
    // special is optional, piecetype is only used if special === 3
    // check if move valid and adds to piece.ValidMoves
    // default (special not given): add if null or capture
    // if special = 1, add only if null
    // if special = 2, add only if capture
    // if special = 3, add only if target has type pieceType (threat check)
    // return = 0 if no move added, 
    // = 1 if added a move to null, 
    // = 2 if added a move to enemy piece (capture)
    // = 3 if added a move to enemy piece of type selected
    // TESTED UP TO 2
    if (!special) special = 0
    if (!pieceType) pieceType = null
    var piece = this.layout[pieceY][pieceX]
    if (targetX > -1 && targetX < 8 && targetY > -1 && targetY < 8) {
      //check if target outside board
      var target = this.layout[targetY][targetX]
      if (special === 0) {
        if (target === null) {
          piece.validMoves[targetY][targetX] = 1
          return 1
        } else if (target.color !== player) {
          piece.validMoves[targetY][targetX] = 1
          return 2
        }
      }
      if (special === 1)
        if (target === null) {
          piece.validMoves[targetY][targetX] = 1
          return 1
        }
      if (special === 2)
        if (target !== null)
          if (target.color !== player) {
            piece.validMoves[targetY][targetX] = 1
            return 2
          }
      if (special === 3)
        if (target !== null)
          if (target.color !== player && target.type === pieceType) {
            piece.validMoves[targetY][targetX] = 1
            return 3
          }
    }
    return 0
  }
Board.prototype.checkCheck = function(player) {
  var coords = this.findKings()
  blackX = coords[0]
  blackY = coords[1]
  whiteX = coords[2]
  whiteY = coords[3]
  for (var i = 0; i < 8; i++)
    for (var j = 0; j < 8; j++)
      this.layout[blackY][blackX].validMoves[j][i] = 0
    // clear validMoves for king pieces



}
Board.prototype.findKings = function() {
  //returns the positions of two kings in an array
  //[blackX,blackY,whiteX,whiteY]
  var result = []
  var blackX, blackY, whiteX, whiteY
  board.layout.forEach(function(row, rowidx, arr) {
    row.forEach(function(piece, colidx, arr) {
      if (piece !== null)
        if (piece.type === "K") {
          if (piece.color === "W") {
            whiteX = colidx
            whiteY = rowidx
          } else {
            blackX = colidx
            blackY = rowidx
          }
        }
    })
  })
  result = [blackX, blackY, whiteX, whiteY]
  return result
}
Board.prototype.checkMateCheck = function() {
  // NOT DONE
}