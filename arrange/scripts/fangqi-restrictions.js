(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "fangqi-restrictions") {
     checkVersion(design, name, value);
  }
}

var isCorner = function(design, board, player, pos, dirs) {
  var r = true;
  _.each(dirs, function(dir) {
      var p = design.navigate(player, pos, dir);
      if (p === null) {
          r = false;
          return;
      }
      var piece = board.getPiece(p);
      if ((piece === null) || (piece.player != player)) {
          r = false;
      }
  });
  return r;
}

var addKo = function(board, move) {
  if ((move.actions.length > 0) && (move.actions[0][1] !== null)) {
       pos = move.actions[0][1][0];
       if (_.isUndefined(board.ko)) {
           board.ko = [];
       }
       if (_.indexOf(board.ko, pos) < 0) {
           board.ko.push(pos);
       }
  }
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = Dagaz.Model.design;
  var n  = design.getDirection("n");  var w  = design.getDirection("w");
  var s  = design.getDirection("s");  var e  = design.getDirection("e");
  var nw = design.getDirection("nw"); var sw = design.getDirection("sw");
  var ne = design.getDirection("ne"); var se = design.getDirection("se");
  _.each(board.moves, function(move) {
      if (move.isDropMove()) {
          var pos = move.actions[0][1][0];
          if (!isCorner(design, board, board.player, pos, [n, w, nw]) &&
              !isCorner(design, board, board.player, pos, [n, e, ne]) &&
              !isCorner(design, board, board.player, pos, [s, e, se]) &&
              !isCorner(design, board, board.player, pos, [s, w, sw])) {
              var player = design.nextPlayer(board.player);
              if (isCorner(design, board, player, pos, [n, w, nw]) ||
                  isCorner(design, board, player, pos, [n, e, ne]) ||
                  isCorner(design, board, player, pos, [s, e, se]) ||
                  isCorner(design, board, player, pos, [s, w, sw])) {
                  addKo(board, move);
                  move.failed = true;
              }
          }
      }
  });
  CheckInvariants(board);
}

})();
