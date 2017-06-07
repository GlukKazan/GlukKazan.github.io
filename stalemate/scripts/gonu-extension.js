(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "gonu-extension") {
     checkVersion(design, name, value);
  }
}

Dagaz.Model.checkGoals = function(design, board, player) {
  var enemies = 0;
  _.each(design.allPositions(), function(pos) {
      var piece = board.getPiece(pos);
      if ((piece !== null) && (piece.player != player)) {
          enemies++;
      }
  });
  if (enemies < 2) {
      return 1;
  } else {
      return 0;
  }
}

Dagaz.AI.heuristic = function(ai, design, board, move) {
  var r = 1;
  for (var i = 0; i < move.actions.length; i++) {
      if ((move.actions[i][0] !== null) && (move.actions[i][1] === null)) {
           r += 10;
      }
  }
  return r;
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;
  _.chain(board.moves)
   .filter(function(move) {
       return move.actions.length == 1;
    })
   .each(function(move) {
       var b = board.apply(move);
       var pos = move.actions[0][1][0];
       _.each(design.allDirections(), function(dir) {
           var o = design.navigate(0, pos, dir);
           var p = design.navigate(board.player, pos, dir);
           if (p !== null) {
               var piece = b.getPiece(p);
               if (piece !== null) {
                   if (piece.player == board.player) {
                       var q = design.navigate(board.player, p, dir);
                       if (q !== null) {
                           var enemy = b.getPiece(q);
                           if ((enemy !== null) && (enemy.player != board.player)) {
                               if (o === null) {
                                   o = design.navigate(board.player, q, dir);
                               }
                               if ((o !== null) && (b.getPiece(o) === null)) {
                                   move.capturePiece(q);
                               }
                           }
                       }
                   } else {
                       if (o !== null) {
                           var friend = b.getPiece(o);
                           if ((friend !== null) && (friend.player == board.player)) {
                               var q = design.navigate(board.player, p, dir);
                               if (q === null) {
                                   q = design.navigate(0, o, dir);
                               }
                               if ((q !== null) && (b.getPiece(q) === null)) {
                                   move.capturePiece(p);
                               }
                           }
                       }
                   }
               }
           }
       });
    });
  CheckInvariants(board);
}

})();
