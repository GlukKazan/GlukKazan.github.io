(function() {

var positions = [135, 143, 151, 159, 167, 175, 183, 191, 134, 142, 150, 158, 166, 174, 182, 190, 133, 141, 149, 157, 165, 173, 181, 189, 132, 140, 148, 156, 164, 172, 180, 188, 131, 139, 147, 155, 163, 171, 179, 187, 130, 138, 146, 154, 162, 170, 178, 186, 129, 137, 145, 153, 161, 169, 177, 185, 128, 136, 144, 152, 160, 168, 176, 184];
var price = [0, 20, 200, 80, 160, 0, 360, 1000];

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "turnover-invariant") {
      checkVersion(design, name, value);
  }
}

var getPiece = function(design, board, pos) {
  var r = 0; var o = null; var t = 1;
  while (pos !== null) {
       var piece = board.getPiece(pos);
       if (piece !== null) {
           if (o === null) o = piece.player;
           r += t;
       }
       t = t * 2;
       pos = design.navigate(1, pos, 8);
  }
  if (o === null) return null;
  return {
      type: r,
      player: o
  };
}

Dagaz.AI.heuristic = function(ai, design, board, move) {
  var r = 1;
  if ((move.actions.length > 0) && (move.actions[0][0] !== null) && (move.actions[0][1] !== null)) {
      var pos = move.actions[0][1][0];
      var piece = getPiece(design, board, pos);
      if ((piece !== null) && (piece.player != board.player) && (piece.type <= 7)) {
         r += price[piece.type];
      }
  }
  return r * 10;
}

var calcAttacker = function(design, board, player, pos, dir, attackers) {
  var p = design.navigate(player, pos, dir);
  if (p === null) return;
  var piece = getPiece(design, board, p);
  if ((piece === null) || (piece.type != 1)) return;
  if (piece.player != player) {
      attackers.push(p);
  }
}

var calcDefender = function(design, board, player, pos, dir, defenders) {
  var p = design.navigate(player, pos, dir);
  if (p === null) return;
  var piece = getPiece(design, board, p);
  if ((piece === null) || (piece.type != 1)) return;
  if (piece.player == player) {
      defenders.push(p);
  }
}

var calcKnight = function(design, board, player, pos, o, d, attackers, defenders) {
  var p = design.navigate(player, pos, o);
  if (p === null) return;
  p = design.navigate(player, p, d);
  if (p === null) return;
  var piece = getPiece(design, board, p);
  if (piece === null) return;
  if (piece.type != 3) return;
  if (piece.player == player) {
      defenders.push(p);
  } else {
      attackers.push(p);
  }
}

var calcSlide = function(design, board, player, pos, dir, tp, attackers, defenders) {
  var p = design.navigate(player, pos, dir);
  while (p !== null) {
      var piece = getPiece(design, board, p);
      if (piece !== null) {
          if ((piece.type != tp) && (piece.type != 6)) return;
          if (piece.player == player) {
              defenders.push(p);
          } else {
              attackers.push(p);
          }
          return;
      }
      p = design.navigate(player, p, dir);
  }
}

Dagaz.AI.eval = function(design, params, board, player) {
  var r = 0; var f = 0; var e = 0;
  _.each(positions, function(pos) {
      var piece = getPiece(design, board, pos);
      if ((piece === null) || (piece.type > 7)) return;
      var v = price[piece.type];
      var attackers = []; var defenders = [];
      calcAttacker(design, board, piece.player, pos, 0, attackers); calcDefender(design, board, piece.player, pos, 3, defenders);
      calcAttacker(design, board, piece.player, pos, 4, attackers); calcAttacker(design, board, piece.player, pos, 5, attackers);
      calcDefender(design, board, piece.player, pos, 6, defenders); calcDefender(design, board, piece.player, pos, 6, defenders);
      calcKnight(design, board, piece.player, pos, 0, 4, attackers, defenders);
      calcKnight(design, board, piece.player, pos, 0, 5, attackers, defenders);
      calcKnight(design, board, piece.player, pos, 3, 6, attackers, defenders);
      calcKnight(design, board, piece.player, pos, 3, 7, attackers, defenders);
      calcKnight(design, board, piece.player, pos, 2, 4, attackers, defenders);
      calcKnight(design, board, piece.player, pos, 2, 6, attackers, defenders);
      calcKnight(design, board, piece.player, pos, 1, 5, attackers, defenders);
      calcKnight(design, board, piece.player, pos, 1, 7, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 4, 2, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 5, 2, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 6, 2, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 7, 2, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 0, 4, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 1, 4, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 2, 4, attackers, defenders);
      calcSlide(design, board, piece.player, pos, 3, 4, attackers, defenders);
      if (piece.type == 7) {
          if ((attackers.length == 0) && (f < 3)) {
              r += v;
              f++;
          }
      } else {
          if (attackers.length > defenders.length) {
              v = (v / 2) | 0;
          }
      }
      if (piece.player == player) {
          r += v;
      } else {
          r -= v;
      }
  });
  return r;
}

var notCastle = function(design, board, player, pos) {
  while (pos !== null) {
       var piece = board.getPiece(pos);
       if (piece === null) return true;
       if (piece.player != player) return true;
       pos = design.navigate(player, pos, 8);
  }
  return false;
}

var notEmpty = function(design, board, player, pos) {
  while (pos !== null) {
       if (board.getPiece(pos) !== null) return true;
       pos = design.navigate(player, pos, 8);
  }
  return false;
}

var checkPawn = function(design, board, player, pos, dir) {
  var p = design.navigate(player, pos, dir);
  if (p === null) return false;
  var piece = board.getPiece(p);
  if (piece === null) return false;
  if (piece.player == player) return false;
  p = design.navigate(player, p, 8);
  if (p === null) return false;
  if (board.getPiece(p) === null) return true;
  p = design.navigate(player, p, 8);
  if (p === null) return false;
  return board.getPiece(p) !== null;
}

var checkKnight = function(design, board, player, pos, o, d) {
  var p = design.navigate(player, pos, o);
  if (p === null) return false;
  p = design.navigate(player, p, d);
  if (p === null) return false;
  var piece = board.getPiece(p);
  if (piece === null) return false;
  if (piece.player == player) return false;
  p = design.navigate(player, p, 8);
  if (p === null) return false;
  if (board.getPiece(p) === null) return false;
  p = design.navigate(player, p, 8);
  if (p === null) return false;
  return board.getPiece(p) === null;
}

var checkRook = function(design, board, player, pos, dir) {
  var p = design.navigate(player, pos, dir);
  while (p !== null) {
      if (notEmpty(design, board, player, p)) {
          if (board.getPiece(p) !== null) return false;
          p = design.navigate(player, p, 8);
          if (p === null) return false;
          p = design.navigate(player, p, 8);
          if (p === null) return false;
          var piece = board.getPiece(p);
          if (piece === null) return false;
          return piece.player != player;
      }
      p = design.navigate(player, p, dir);
  }
  return false;
}

var checkBishop = function(design, board, player, pos, dir) {
  var p = design.navigate(player, pos, dir);
  while (p !== null) {
      if (notEmpty(design, board, player, p)) {
          if (board.getPiece(p) !== null) return false;
          p = design.navigate(player, p, 8);
          if (p === null) return false;
          var piece = board.getPiece(p);
          if (piece === null) return false;
          return piece.player != player;
      }
      p = design.navigate(player, p, dir);
  }
  return false;
}

var isAttacked = function(design, board, player, pos) {
  if (checkPawn(design, board, player, pos, 4)) return true;
  if (checkPawn(design, board, player, pos, 5)) return true;
  if (checkKnight(design, board, player, pos, 0, 4)) return true;
  if (checkKnight(design, board, player, pos, 0, 5)) return true;
  if (checkKnight(design, board, player, pos, 3, 6)) return true;
  if (checkKnight(design, board, player, pos, 3, 7)) return true;
  if (checkKnight(design, board, player, pos, 1, 5)) return true;
  if (checkKnight(design, board, player, pos, 1, 7)) return true;
  if (checkKnight(design, board, player, pos, 2, 4)) return true;
  if (checkKnight(design, board, player, pos, 2, 6)) return true;
  if (checkRook(design, board, player, pos, 0)) return true;
  if (checkRook(design, board, player, pos, 1)) return true;
  if (checkRook(design, board, player, pos, 2)) return true;
  if (checkRook(design, board, player, pos, 3)) return true;
  if (checkBishop(design, board, player, pos, 4)) return true;
  if (checkBishop(design, board, player, pos, 5)) return true;
  if (checkBishop(design, board, player, pos, 6)) return true;
  if (checkBishop(design, board, player, pos, 7)) return true;
  return false;
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;  
  _.each(board.moves, function(move) {
      var f = true;
      if (_.isUndefined(move.failed)) {
          var b = board.apply(move);
          _.each(positions, function(pos) {
                if (notCastle(design, b, board.player, pos)) return;
                if (isAttacked(design, b, board.player, pos)) return;
                f = false;
          });
      }
      if (f) {
          move.failed = true;
      }
  });
  CheckInvariants(board);
}

})();
