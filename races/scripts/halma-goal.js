(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name != "halma-goal") {
     checkVersion(design, name, value);
  }
}

if (!_.isUndefined(Dagaz.Controller.addSound)) {
    Dagaz.Controller.addSound(0, "../sounds/slide.ogg", true);
}

var allDirections = function(design) {
  if (design.dirs.length >= 8) {
      return _.range(7);
  } else {
      return _.range(3);
  }
}

var getGoals = function(design, board, player) {
  if (_.isUndefined(board.goals)) {
      board.goals = [];
      _.each(design.allPositions(), function(pos) {
          if (design.inZone(0, player, pos)) {
              board.goals.push(pos);
          }
      });
  }
  return board.goals;
}

var getTargets = function(design, board, player) {
  if (_.isUndefined(board.targets)) {
      board.targets = {
          goal:   [],
          first:  [],
          second: []
      };
      _.each(design.allPositions(), function(pos) {
          if (design.inZone(0, player, pos) && (board.getPiece(pos) === null)) {
              board.targets.goal.push(pos);
              _.each(allDirections(design), function(dir) {
                   var p = design.navigate(player, pos, dir);
                   if ((p !== null) && design.inZone(0, player, p) && (board.getPiece(p) !== null)) {
                        p = design.navigate(player, p, dir);
                        if ((p !== null) && !design.inZone(0, player, p) && (board.getPiece(p) === null)) {
                             board.targets.second.push(p);
                        }
                   }
              });
          }
      });
      var done = [];
      _.each(board.targets.goal, function(pos) {
          if (_.indexOf(done, pos) < 0) {
              var f = false;
              var group = [ pos ];        
              for (var i = 0; i < group.length; i++) {
                   _.each(allDirections(design), function(dir) {
                       var p = design.navigate(player, group[i], dir);
                       if ((p !== null) && (_.indexOf(group, p) < 0)) {
                           if (design.inZone(0, player, p)) {
                               if (board.getPiece(p) === null) {
                                   group.push(p);
                               }
                           } else {
                               f = true;
                           }
                       }
                   });
              }
              if (f) {
                  board.targets.first  = _.union(board.targets.first,  group);
                  board.targets.second = _.union(board.targets.second, group);
              }
              done = _.union(done, group);
          }
      });
  }
  return board.targets;
}

var distance = function(a, b) {
  return Math.abs(Dagaz.Model.getX(a) - Dagaz.Model.getX(b)) +
         Math.abs(Dagaz.Model.getY(a) - Dagaz.Model.getY(b));
}

var getDistance = function(list, pos) {
  var r = null;
  _.each(list, function(goal) {
      var d = distance(goal, pos);
      if ((r === null) || (r < d)) {
          r = d;
      }
  });
  return r;
}

var getMove = function(move) {
  var r = null;
  for (var i = 0; i < move.actions.length; i++) {
      if ((move.actions[i][0] !== null) && (move.actions[i][1] !== null)) {
          if (r === null) {
              r = {
                  start: move.actions[i][0][0]
              };
          }
          r.end = move.actions[i][1][0];
      }
  }
  return r;
}

var notBest = function(design, board, val) {
  if (_.isUndefined(board.bestVal)) {
      board.bestVal = val;
      return false;
  }
  if (board.bestVal > val) return true;
  board.bestVal = val;
  return false;
}

var isRestricted = function(design, board, player) {
  var list = [];
  _.each(design.allPositions(), function(pos) {
        if (design.inZone(0, player, pos)) {
            var piece = board.getPiece(pos);
            if ((piece !== null) && (piece.player != player)) {
                list.push(pos);
            }
        }
  });
  if (list.length == 0) return false;
  var done = [];
  var r = true;
  for (var i = 0; i < list.length; i++) {
       if (_.indexOf(done, list[i]) < 0) {
           var group = [ list[i] ];
           for (var j = 0; j < group.length; j++) {
                _.each(allDirections(design), function(dir) {
                    var p = design.navigate(player, group[j], dir);
                    if ((p !== null) && (_.indexOf(group, p) < 0)) {
                        if (!design.inZone(0, player, p)) {
                            r = false;
                            return;
                        }
                        var piece = board.getPiece(p);
                        if ((piece !== null) && (piece.player == player)) {
                             p = design.navigate(player, p, dir);
                             if ((p !== null) && (_.indexOf(group, p) < 0) && (board.getPiece(p) === null)) {
                                 group.push(p);
                             }
                        } else {
                            group.push(p);
                        }
                    }
                });
                if (!r) break;
           }
           done = _.union(done, group);
       }
  }
  return r;
}

Dagaz.AI.heuristic = function(ai, design, board, move) {
  var t = getTargets(design, board, board.player);
  var m = getMove(move);
  var r = 1;
  if (m !== null) {
      if (!design.inZone(0, board.player, m.start)) {
          if (_.indexOf(t.first, m.end) >= 0) {
              r = 1000 + getDistance(t.first, m.start) - getDistance(t.first, m.end);
          }
          if (_.indexOf(t.goal, m.end) >= 0) {
              r = 700 + getDistance(t.first, m.start) - getDistance(t.first, m.end);
          }
          if ((r == 1) && (_.indexOf(t.second, m.end) >= 0)) {
              r = 500 - getDistance(t.second, m.end);
          }
      }
      if (r == 1) {
          if (design.inZone(2, board.player, m.end) && !design.inZone(2, board.player, m.start)) {
              r = 200;
          } else {
              var goals = getGoals(design, board, board.player);
              r = 100 + getDistance(goals, m.start) - getDistance(goals, m.end);
          }
      }
      if (notBest(design, board, r)) return -1;
      var b = board.apply(move);
      if (isRestricted(design, b, board.player)) return -1;
  }
  return r;
}

var checkGoals = Dagaz.Model.checkGoals;

Dagaz.Model.checkGoals = function(design, board, player) {
  var m = 2;
  var c = [0, 0, 0, 0];
  var p = [0, 0, 0, 0];
  _.each(design.allPositions(), function(pos) {
      var piece = board.getPiece(pos);
      if (piece !== null) {
          if (!design.inZone(0, piece.player, pos)) {
              c[piece.player - 1]++;
          } else {
              p[piece.player - 1]++;
          }
          if (piece.player > m) {
              m = piece.player;
          }
      }
  });
  for (var i = 0; i < m; i++) {
      if ((c[i] == 0) && (p[i] != 0)) {
          if (i + 1 == player) {
              return 1;
          } else {
              return -1;
          }
      }
  }
  return checkGoals(design, board, player);
}

})();
