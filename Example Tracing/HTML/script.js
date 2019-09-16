//var FEN_STRING = "";




var board,
  game = new Chess('N3k3/6QR/8/8/8/1B6/8/3R1R1K w - - 0 1'),
  //game = new Chess(FEN_STRING),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');


var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};



var onDragStart = function(source, piece, position, orientation) {

  

  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
  // see if the move is legal
  removeGreySquares();

  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';
  renderMoveHistory(game.history());
  updateStatus();
};

var onMouseoverSquare = function(square, piece) 
{
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) 
{
  removeGreySquares();
};

// update the board position after the piece snap 
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  

  // checkmate?
  if (game.in_checkmate() === true) {
    console.log('Game over, ' + moveColor + ' is in checkmate.');
    status = 'Game over, ' + moveColor + ' is in checkmate.';
    //document.getElementById('div#board').style.border = solid;
    $("div#board").css("border", "5px solid limegreen");
    $("div#board").css("box-shadow", "0px 0px 15px 5px limegreen");
    $("div#ctatdiv17").css("visibility","hidden");
    //$("div#ctatdiv17").value = "Well Done";
	$("div#concPartStr1").css("visibility","visible");
    $("div#ctatdiv18").css("visibility","visible");

    


    
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
    
    //game.undo_move();
    game.undo();
    // $("div#board").css("border", "solid");
    // $("div#board").css("border-color", "red");
  }

  // game still on
  else {
    //game.undo_move();
    game.undo();
    // $("div#board").css("border", "solid");
    // $("div#board").css("border-color", "red");
    
    // check?
    
  }





  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

var renderMoveHistory = function (moves) 
{
    
    //console.log(historyElement);
    //historyElement.empty();
    //console.log(historyElement);
    
    $('input#ctatdiv16').val(moves[0]);
    $('ctatdiv10').val(moves[0]);
    
    CTATShellTools.findComponent('ctatdiv10')[0].grade();
    
    //historyElement.scrollTop(historyElement[0].scrollHeight);
}

var cfg = {
  draggable: true,
  position: 'N3k3/6QR/8/8/8/1B6/8/3R1R1K w - - 0 1',
  //position : FEN_STRING,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
  
};
board = ChessBoard('board', cfg);



updateStatus();


