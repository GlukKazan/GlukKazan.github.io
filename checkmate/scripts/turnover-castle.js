(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "turnover-castle") {
     checkVersion(design, name, value);
  }
}

var isCastle = function(design, board, pos) {
  var p = design.navigate(1, pos, 8);
  while (p !== null) {
      if (board.getPiece(p) === null) return false;
      p = design.navigate(1, p, 8);
  }
  return true;
}

var getPiece = function(design, board, pos) {
  var t = 0; var m = 1; var p = null;
  while (pos !== null) {
      var piece = board.getPiece(pos);
      if (piece !== null) {
          p = piece.player;
          t += m;
      }
      pos = design.navigate(1, pos, 8);
      m = m << 1;
  }
  return {
      type: t,
      player: p
  };
}

var isAttackedStep = function(design, board, player, pos, dir) {
  var p = design.navigate(player, pos, dir);
  if (p === null) return false;
  var piece = board.getPiece(p);
  if (piece === null) return false;
  return piece.player != player;
}

var isAttackedJump = function(design, board, player, pos, o, d) {
  var p = design.navigate(1, pos, o);
  if (p === null) return false;
  p = design.navigate(1, p, d);
  if (p === null) return false;
  var piece = getPiece(design, board, p);
  if (piece.type != 3) return false;
  return piece.player != player;
}

var isAttackedSlideDir = function(design, board, player, pos, dir, types) {
  var p = design.navigate(1, pos, dir);
  while (p !== null) {
      var piece = getPiece(design, board, p);
      if (piece.type != 0) {
          if (piece.player == player) return false;
          return _.indexOf(types, piece.type) >= 0;
      }
      p = design.navigate(1, p, dir);
  }
  return false;
}

var isAttackedSlide = function(design, board, player, pos, dirs, types) {
  for (var i = 0; i < dirs.length; i++) {
       if (isAttackedSlideDir(design, board, player, pos, dirs[i], types)) return true;
  }
  return false;
}

var isAttacked = function(design, board, player, pos) {
  return isAttackedSlide(design, board, player, pos, [0, 1, 2, 3], [6, 4]) ||
         isAttackedSlide(design, board, player, pos, [4, 5, 6, 7], [6, 2]) ||
         isAttackedJump(design, board, player, pos, 0, 4) ||
         isAttackedJump(design, board, player, pos, 0, 5) ||
         isAttackedJump(design, board, player, pos, 3, 6) ||
         isAttackedJump(design, board, player, pos, 3, 7) ||
         isAttackedJump(design, board, player, pos, 1, 5) ||
         isAttackedJump(design, board, player, pos, 1, 7) ||
         isAttackedJump(design, board, player, pos, 2, 4) ||
         isAttackedJump(design, board, player, pos, 2, 6) ||
         isAttackedStep(design, board, player, pos, 4) ||
         isAttackedStep(design, board, player, pos, 5);
}

var disableMove = function(design, board, pos, dir) {
  var p = design.navigate(1, pos, dir);
  if (p === null) return;
  _.each(board.moves, function(move) {
      if (move.actions.length < 1) return;
      if (move.actions[0][0] === null) return;
      if (move.actions[0][1] === null) return;
      if (move.actions[0][0][0] != pos) return;
      if (move.actions[0][1][0] != p) return;
      move.failed = true;
  });
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;
  var f = []; var e = [];
  for (pos = Dagaz.Model.stringToPos("a8b"); pos < design.positions.length; pos++) {
       var piece = board.getPiece(pos);
       if ((piece !== null) && isCastle(design, board, pos)) {
           if (piece.player == board.player) {
               f.push(pos);
           } else {
               e.push(pos);
           }
       }
  }
  _.each(f, function(pos) {
       if (!isAttacked(design, board, board.player, pos)) return;
       _.each(_.range(8), function(dir) {
            var move = Dagaz.Model.createMove(0);
            var p = pos;
            while (p !== null) {
                var piece = board.getPiece(p);
                if (piece === null) return;
                var q = design.navigate(1, p, dir);
                if (q === null) return;
                var t = board.getPiece(q);
                if ((t !== null) && (t.player == board.player)) return;
                move.movePiece(p, q, piece);
                p = design.navigate(1, p, 8);
            }
            if (f.length == 1) {
                var p = design.navigate(1, pos, dir);
                if (p !== null) {
                    if ((e.length > 1) || !isCastle(design, board, p)) {
                        var b = board.apply(move);
                        if (isAttacked(design, b, board.player, p)) return;
                    }
                }
            }
            disableMove(design, board, pos, dir);
            board.moves.push(move);
       });
  });
  CheckInvariants(board);
}

var checkGoals = Dagaz.Model.checkGoals;

Dagaz.Model.checkGoals = function(design, board, player) {
  var design = Dagaz.Model.design;
  board.generate();
  if (board.moves.length == 0) {
      var f = [];
      for (pos = Dagaz.Model.stringToPos("a8b"); pos < design.positions.length; pos++) {
           var piece = board.getPiece(pos);
           if ((piece !== null) && isCastle(design, board, pos)) {
               if (piece.player == board.player) {
                   f.push(pos);
               }
           }
      }
      for (var i = 0; i < f.length; i++) {
           if (!isAttacked(design, board, board.player, f[i])) return 0;
      }
  }
  return checkGoals(design, board, player);
}

})();
