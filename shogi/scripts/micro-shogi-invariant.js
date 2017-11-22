(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "micro-shogi-invariant") {
      checkVersion(design, name, value);
  }
}

var checkGoals = Dagaz.Model.checkGoals;

Dagaz.Model.checkGoals = function(design, board, player) {
  var friends = 0;
  var enemies = 0;
  var king    = design.getPieceType("King");
  _.each(design.allPositions(), function(pos) {
      var piece = board.getPiece(pos);
      if ((piece !== null) && (piece.type == king)) {
          if (piece.player == player) {
              friends++;
          } else {
              enemies++;
          }
      }
  });
  if (enemies == 0) {
      return 1;
  }
  if (friends == 0) {
      return -1;
  }
  return checkGoals(design, board, player);
}

var findPiece = function(design, board, player, type) {
  for (var p = 0; p < design.positions.length; p++) {
       var piece = board.getPiece(p);
       if ((piece !== null) && (piece.type == type) && (piece.player == player)) {
           return p;
       }
  }
  return null;
}

var isKnightAttacked = function(design, board, player, pos, o, d, leapers) {
  var p = design.navigate(player, pos, o);
  if (p === null) return false;
  p = design.navigate(player, p, d);
  if (p === null) return false;
  var piece = board.getPiece(p);
  if (piece === null) return false;
  if (piece.player == player) return false;
  return _.indexOf(leapers, piece.type) >= 0;
}

var isAttacked = function(design, board, player, pos, dir, leapers, riders) {
  var p = design.navigate(player, pos, dir);
  if (p === null) return false;
  var piece = board.getPiece(p);
  if (piece !== null) {
      if (piece.player == player) return false;
      if (_.indexOf(leapers, piece.type) >= 0) return true;
      if (_.indexOf(riders, piece.type) >= 0) return true;
  }
  p = design.navigate(player, p, dir);
  while (p !== null) {
      piece = board.getPiece(p);
      if (piece !== null) {
          if (piece.player == player) return false;
          return _.indexOf(riders, piece.type) >= 0;
      }
      p = design.navigate(player, p, dir);
  }
  return false;
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;
  var king   = design.getPieceType("King");
  var bishop = design.getPieceType("Bishop");
  var tokin  = design.getPieceType("Tokin");
  var gold   = design.getPieceType("Gold");
  var rook   = design.getPieceType("Rook");
  var silver = design.getPieceType("Silver");
  var lance  = design.getPieceType("Lance");
  var knight = design.getPieceType("Knight");
  var pawn   = design.getPieceType("Pawn");
  var n  = design.getDirection("n");  var w  = design.getDirection("w");
  var s  = design.getDirection("s");  var e  = design.getDirection("e");
  var nw = design.getDirection("nw"); var sw = design.getDirection("sw");
  var ne = design.getDirection("ne"); var se = design.getDirection("se");
  _.each(board.moves, function(m) {
      var b = board.apply(m);
      var pos = findPiece(design, b, board.player, king);
      if (pos === null) {
          m.failed = true;
          return;
      }
      if (isAttacked(design, b, board.player, pos, n, [king, gold, tokin, silver, pawn], [rook, lance]) ||
          isAttacked(design, b, board.player, pos, s, [king, gold, tokin], [rook]) ||
          isAttacked(design, b, board.player, pos, w, [king, gold, tokin], [rook]) ||
          isAttacked(design, b, board.player, pos, e, [king, gold, tokin], [rook]) ||
          isAttacked(design, b, board.player, pos, nw, [king, gold, tokin, silver], [bishop]) ||
          isAttacked(design, b, board.player, pos, ne, [king, gold, tokin, silver], [bishop]) ||
          isAttacked(design, b, board.player, pos, sw, [king, silver], [bishop]) ||
          isAttacked(design, b, board.player, pos, se, [king, silver], [bishop])) {
          m.failed = true;
          return;
      }
      if (isKnightAttacked(design, b, board.player, pos, n, nw, [knight]) ||
          isKnightAttacked(design, b, board.player, pos, n, ne, [knight])) {
          m.failed = true;
          return;
      }
  });
  CheckInvariants(board);
}

})();
