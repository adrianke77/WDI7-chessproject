function GameSys() {
  this.player = "" // W or B  1
  this.gameState = "" // waitForPick, waitForMove.. 
  this.pickedPiece = [] // stores picked piece location as [x,y]
}
GameSys.prototype.boxClick = function(y, x) {
  if (this.gameState === "waitForPick") {
    if (board.layout[y][x] === null) return false
    if (board.isThisPieceMine(x, y, this.player)) {
      if (board.areThereValidMoves(x, y, this.player) === true) {
        this.drawPieceSelected(x, y)
        this.pickedPiece = [x, y]
        this.gameState = "waitForMove"
        this.updateStatusDisplays()
        return true
      } else {
        $(".instructions").text("That piece has no valid moves, please pick another piece")
      }
    } else {
      $(".instructions").text("That piece is not on your side, please pick another piece")
    }
  }
  if (this.gameState === "waitForMove") {
    var didPieceMove = board.movePiece(this.pickedPiece[0], this.pickedPiece[1], x, y, this.player)
    if (didPieceMove === true) {
      this.drawLayoutToHtml()
      this.gameState = "waitForPick"
      this.player =
        this.player === "W" ? "B" : "W"
      this.updateStatusDisplays()
      this.undrawPieceSelected(this.pickedPiece[0], this.pickedPiece[1])
    } else {
      $(".instructions").text("Move is invalid, please pick another location to move to")
    }
  }
}
GameSys.prototype.makeGridListeners = function() {
  //TESTED
  self = this
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      (function(i, j) {
        $(".b" + i + j).on("click", function() {
          self.boxClick(i, j)
        })
      })(i, j)
      // wrapped everything in IIFE to make callback get values not 
      // references 
    }
  }
}
GameSys.prototype.updateStatusDisplays = function() {
  statusString =
    this.player === "W" ? "White Player's Turn" : "Black Player's Turn"
  instructionsString =
    this.gameState === "waitForPick" ? "Please pick a piece" :
    "Please move the piece you have picked"
  $(".status").text(statusString)
  $(".instructions").text(instructionsString)
}
GameSys.prototype.drawLayoutToHtml = function() {
  board.layout.forEach(function(row, rowidx, arr) {
    row.forEach(function(piece, colidx, arr) {
      $(".b" + rowidx + colidx).removeClass(function(idx, className) {
        return className.slice(7, className.length)
      })
      if (piece !== null) $(".b" + rowidx + colidx).addClass("sprites").addClass("sprite" + piece.type + piece.color)
    })
  })
}
GameSys.prototype.newgame = function() {
  this.player = "W"
  this.gameState = "waitForPick"
  board = new Board
  board.fillStartingBoard()
  this.drawLayoutToHtml()
  this.makeGridListeners()
  this.updateStatusDisplays()
}
GameSys.prototype.drawPieceSelected = function(x, y) {
  $(".b" + y + x).addClass("selected")
}
GameSys.prototype.undrawPieceSelected = function(x, y) {
  $(".b" + y + x).removeClass("selected")
}

//main code
var gameSys = new GameSys
gameSys.newgame()

//testing
// board.layout[5][2] = board.makePiece("N", "B")
// board.layout[5][4] = board.makePiece("Q", "B")
// gameSys.drawLayoutToHtml()
// board.pawnMovesSearch(3, 6, "W")
// cl(board.layout[6][3].validMoves)
// cl(board.areThereValidMoves(3, 6))
console.log(board.findKings())