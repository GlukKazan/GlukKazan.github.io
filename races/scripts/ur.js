ZRF = {
    JUMP:          0,
    IF:            1,
    FORK:          2,
    FUNCTION:      3,
    IN_ZONE:       4,
    FLAG:          5,
    SET_FLAG:      6,
    POS_FLAG:      7,
    SET_POS_FLAG:  8,
    ATTR:          9,
    SET_ATTR:      10,
    PROMOTE:       11,
    MODE:          12,
    ON_BOARD_DIR:  13,
    ON_BOARD_POS:  14,
    PARAM:         15,
    LITERAL:       16,
    VERIFY:        20
};

if (!_.isUndefined(Dagaz.Controller.addSound)) {
    Dagaz.Controller.addSound(0, "../sounds/slide.ogg", true);
    Dagaz.Controller.addSound(10, "../sounds/dice.wav", true);
}

Dagaz.Model.BuildDesign = function(design) {
    design.checkVersion("z2j", "2");
    design.checkVersion("smart-moves", "from");
    design.checkVersion("pass-turn", "forced");
    design.checkVersion("pass-partial", "false");
    design.checkVersion("show-hints", "false");
    design.checkVersion("show-blink", "false");
    design.checkVersion("show-captures", "false");
    design.checkVersion("show-drops", "false");
    design.checkVersion("advisor-wait", "10");

    design.addDirection("up");         // 0
    design.addDirection("down");       // 1
    design.addDirection("next");       // 2
    design.addDirection("next-black"); // 3
    design.addDirection("prom");       // 4
    design.addDirection("prom-black"); // 5
    design.addDirection("free");       // 6
    design.addDirection("home");       // 7
    design.addDirection("dice");       // 8

    design.addPlayer("White", [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    design.addPlayer("Black", [0, 1, 3, 0, 5, 1, 7, 6, 2]);

    design.addTurn(1, [1, 2, 3, 4]); // 0
    design.repeatMark();
    design.addRandom(2, [0]); // 1
    design.addRandom(2, [0]); // 2
    design.addRandom(2, [0]); // 3
    design.addTurn(2, [1, 2, 3, 4]); // 4
    design.addRandom(1, [0]); // 5
    design.addRandom(1, [0]); // 6
    design.addRandom(1, [0]); // 7
    design.addTurn(1, [1, 2, 3, 4]); // 8

    design.addPosition("x3", [0, 0, 0, 0, 0, 0, 3, 52, 0]);
    design.addPosition("x2", [0, 0, 0, 0, 0, 0, 0, 0, -1]);
    design.addPosition("x1", [0, 0, 0, 0, 0, 0, 0, 0, -1]);
    design.addPosition("a40", [1, 0, 0, 13, 0, 0, 1, 0, 0]);
    design.addPosition("b40", [1, 0, 0, 12, 0, 0, 1, 0, 0]);
    design.addPosition("c40", [1, 0, 0, 11, 0, 0, 1, 0, 0]);
    design.addPosition("d40", [1, 0, 0, 10, 0, 0, 1, 0, 0]);
    design.addPosition("e40", [1, 0, 0, 9, 0, 0, 1, 0, 0]);
    design.addPosition("f40", [1, 0, 0, 8, 0, 0, 1, 0, 0]);
    design.addPosition("g40", [0, 0, 0, 7, 0, 0, 0, 0, 0]);
    design.addPosition("a30", [0, 0, 0, 13, 0, 0, 0, 0, 0]);
    design.addPosition("b30", [1, 0, 0, -1, 0, 0, 0, 0, 0]);
    design.addPosition("b31", [1, -1, 0, -2, 0, 0, 0, 0, 0]);
    design.addPosition("b32", [1, -1, 0, -3, 0, 0, 0, 0, 0]);
    design.addPosition("b33", [0, -1, 0, -4, 0, 0, 0, 0, 0]);
    design.addPosition("c30", [0, 0, 0, -4, 0, 0, 0, 0, 0]);
    design.addPosition("d30", [1, 0, 0, -1, 0, 0, 0, 0, 0]);
    design.addPosition("d31", [1, -1, 0, -2, 0, 0, 0, 0, 0]);
    design.addPosition("d32", [1, -1, 0, -3, 0, 0, 0, 0, 0]);
    design.addPosition("d33", [0, -1, 0, -4, 0, 0, 0, 0, 0]);
    design.addPosition("g30", [0, 0, 15, 1, 15, 0, 0, 0, 0]);
    design.addPosition("h30", [0, 0, -1, 18, -1, 0, 0, 0, 0]);
    design.addPosition("z0", [0, 0, 0, 0, 0, 0, -19, 30, 0]);
    design.addPosition("a20", [0, 0, 1, 1, -1, -1, 0, 0, 0]);
    design.addPosition("b20", [0, 0, 1, 1, -1, -1, 0, 0, 0]);
    design.addPosition("c20", [1, 0, 4, 4, -1, -1, 0, 0, 0]);
    design.addPosition("c21", [1, -1, 3, 3, -2, -2, 0, 0, 0]);
    design.addPosition("c22", [1, -1, 2, 2, -3, -3, 0, 0, 0]);
    design.addPosition("c23", [0, -1, 1, 1, -4, -4, 0, 0, 0]);
    design.addPosition("d20", [0, 0, 1, 1, -4, -4, 0, 0, 0]);
    design.addPosition("e20", [0, 0, 1, 1, -1, -1, 0, 0, 0]);
    design.addPosition("f20", [1, 0, 4, 4, -1, -1, 0, 0, 0]);
    design.addPosition("f21", [1, -1, 3, 3, -2, -2, 0, 0, 0]);
    design.addPosition("f22", [1, -1, 2, 2, -3, -3, 0, 0, 0]);
    design.addPosition("f23", [0, -1, 1, 1, -4, -4, 0, 0, 0]);
    design.addPosition("g20", [1, 0, 15, -15, -4, -4, 0, 0, 0]);
    design.addPosition("g21", [1, -1, 14, -16, -5, -5, 0, 0, 0]);
    design.addPosition("g22", [1, -1, 13, -17, -6, -6, 0, 0, 0]);
    design.addPosition("g23", [0, -1, 12, -18, -7, -7, 0, 0, 0]);
    design.addPosition("h20", [0, 0, -18, 12, -18, 12, 0, 0, 0]);
    design.addPosition("a10", [0, 0, -17, 0, 0, 0, 0, 0, 0]);
    design.addPosition("b10", [1, 0, -1, 0, 0, 0, 0, 0, 0]);
    design.addPosition("b11", [1, -1, -2, 0, 0, 0, 0, 0, 0]);
    design.addPosition("b12", [1, -1, -3, 0, 0, 0, 0, 0, 0]);
    design.addPosition("b13", [0, -1, -4, 0, 0, 0, 0, 0, 0]);
    design.addPosition("c10", [0, 0, -4, 0, 0, 0, 0, 0, 0]);
    design.addPosition("d10", [1, 0, -1, 0, 0, 0, 0, 0, 0]);
    design.addPosition("d11", [1, -1, -2, 0, 0, 0, 0, 0, 0]);
    design.addPosition("d12", [1, -1, -3, 0, 0, 0, 0, 0, 0]);
    design.addPosition("d13", [0, -1, -4, 0, 0, 0, 0, 0, 0]);
    design.addPosition("g10", [0, 0, 1, -15, 0, -15, 0, 0, 0]);
    design.addPosition("h10", [0, 0, -12, -1, 0, -1, 0, 0, 0]);
    design.addPosition("a00", [1, 0, -6, 0, 0, 0, 0, 1, 0]);
    design.addPosition("b00", [1, 0, -7, 0, 0, 0, 0, 1, 0]);
    design.addPosition("c00", [1, 0, -8, 0, 0, 0, 0, 1, 0]);
    design.addPosition("d00", [1, 0, -9, 0, 0, 0, 0, 1, 0]);
    design.addPosition("e00", [1, 0, -10, 0, 0, 0, 0, 1, 0]);
    design.addPosition("f00", [1, 0, -11, 0, 0, 0, 0, 1, 0]);
    design.addPosition("g00", [0, 0, -12, 0, 0, 0, 0, 0, 0]);

    design.addZone("end", 1, [22]);
    design.addZone("end", 2, [22]);
    design.addZone("promo", 1, [51]);
    design.addZone("promo", 2, [21]);
    design.addZone("safe", 1, [35]);
    design.addZone("safe", 2, [35]);
    design.addZone("fin", 1, [23]);
    design.addZone("fin", 2, [23]);
    design.addZone("dices", 1, [2, 1, 0]);
    design.addZone("dices", 2, [2, 1, 0]);
    design.addZone("star", 1, [40, 10, 29, 50, 20]);
    design.addZone("star", 2, [40, 10, 29, 50, 20]);

    design.addCommand(0, ZRF.IN_ZONE,	4);	// dices
    design.addCommand(0, ZRF.FUNCTION,	20);	// verify
    design.addCommand(0, ZRF.FUNCTION,	3);	// friend?
    design.addCommand(0, ZRF.FUNCTION,	0);	// not
    design.addCommand(0, ZRF.FUNCTION,	20);	// verify
    design.addCommand(0, ZRF.FUNCTION,	25);	// to
    design.addCommand(0, ZRF.FUNCTION,	28);	// end

    design.addCommand(1, ZRF.FUNCTION,	24);	// from
    design.addCommand(1, ZRF.PARAM,	0);	// $1
    design.addCommand(1, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(1, ZRF.FUNCTION,	25);	// to
    design.addCommand(1, ZRF.FUNCTION,	28);	// end

    design.addCommand(2, ZRF.FUNCTION,	24);	// from
    design.addCommand(2, ZRF.PARAM,	0);	// $1
    design.addCommand(2, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(2, ZRF.PARAM,	1);	// $2
    design.addCommand(2, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(2, ZRF.FUNCTION,	25);	// to
    design.addCommand(2, ZRF.FUNCTION,	28);	// end

    design.addCommand(3, ZRF.FUNCTION,	24);	// from
    design.addCommand(3, ZRF.PARAM,	0);	// $1
    design.addCommand(3, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(3, ZRF.PARAM,	1);	// $2
    design.addCommand(3, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(3, ZRF.PARAM,	2);	// $3
    design.addCommand(3, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(3, ZRF.FUNCTION,	25);	// to
    design.addCommand(3, ZRF.FUNCTION,	28);	// end

    design.addCommand(4, ZRF.FUNCTION,	24);	// from
    design.addCommand(4, ZRF.PARAM,	0);	// $1
    design.addCommand(4, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(4, ZRF.PARAM,	1);	// $2
    design.addCommand(4, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(4, ZRF.PARAM,	2);	// $3
    design.addCommand(4, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(4, ZRF.PARAM,	3);	// $4
    design.addCommand(4, ZRF.FUNCTION,	22);	// navigate
    design.addCommand(4, ZRF.FUNCTION,	25);	// to
    design.addCommand(4, ZRF.FUNCTION,	28);	// end

    design.addPiece("d0", 0);
    design.addDrop(0, 0, [], 0, 10);

    design.addPiece("d1", 1);
    design.addDrop(1, 0, [], 0, 10);

    design.addPiece("Man", 2);
    design.addMove(2, 1, [2], 1);
    design.addMove(2, 2, [2, 2], 2);
    design.addMove(2, 3, [2, 2, 2], 3);
    design.addMove(2, 4, [2, 2, 2, 2], 4);

    design.addPiece("King", 3);
    design.addMove(3, 1, [4], 1);
    design.addMove(3, 2, [4, 4], 2);
    design.addMove(3, 3, [4, 4, 4], 3);
    design.addMove(3, 4, [4, 4, 4, 4], 4);

    design.setup("White", "Man", 52);
    design.setup("White", "Man", 53);
    design.setup("White", "Man", 54);
    design.setup("White", "Man", 55);
    design.setup("White", "Man", 56);
    design.setup("White", "Man", 57);
    design.setup("White", "Man", 58);
    design.setup("White", "d0", 1);
    design.setup("White", "d0", 2);
    design.setup("White", "d1", 0);
    design.setup("Black", "Man", 3);
    design.setup("Black", "Man", 4);
    design.setup("Black", "Man", 5);
    design.setup("Black", "Man", 6);
    design.setup("Black", "Man", 7);
    design.setup("Black", "Man", 8);
    design.setup("Black", "Man", 9);
}

Dagaz.View.configure = function(view) {
    view.defBoard("Board");
    view.defPiece("Whited0", "White d0");
    view.defPiece("Blackd0", "Black d0");
    view.defPiece("Whited1", "White d1");
    view.defPiece("Blackd1", "Black d1");
    view.defPiece("WhiteMan", "White Man");
    view.defPiece("BlackMan", "Black Man");
    view.defPiece("WhiteKing", "White King");
    view.defPiece("BlackKing", "Black King");
 
    view.defPosition("x3", 660, 108, 50, 53);
    view.defPosition("x2", 660, 176, 50, 53);
    view.defPosition("x1", 660, 244, 50, 53);
    view.defPosition("a40", 67, 38, 29, 29);
    view.defPosition("b40", 134, 38, 29, 29);
    view.defPosition("c40", 201, 38, 29, 29);
    view.defPosition("d40", 268, 38, 29, 29);
    view.defPosition("e40", 335, 38, 29, 29);
    view.defPosition("f40", 402, 38, 29, 29);
    view.defPosition("g40", 469, 38, 29, 29);
    view.defPosition("a30", 67, 115, 29, 29);
    view.defPosition("b30", 135, 115, 29, 29);
    view.defPosition("b31", 132, 112, 28, 28);
    view.defPosition("b32", 128, 108, 28, 28);
    view.defPosition("b33", 124, 104, 28, 28);
    view.defPosition("c30", 201, 115, 29, 29);
    view.defPosition("d30", 269, 115, 29, 29);
    view.defPosition("d31", 266, 112, 28, 28);
    view.defPosition("d32", 262, 108, 28, 28);
    view.defPosition("d33", 258, 104, 28, 28);
    view.defPosition("g30", 470, 115, 29, 29);
    view.defPosition("h30", 536, 115, 29, 29);
    view.defPosition("z0", -31, 186, 25, 25);
    view.defPosition("a20", 67, 184, 29, 29);
    view.defPosition("b20", 133, 186, 29, 29);
    view.defPosition("c20", 201, 186, 29, 29);
    view.defPosition("c21", 198, 182, 28, 28);
    view.defPosition("c22", 194, 177, 28, 28);
    view.defPosition("c23", 190, 173, 28, 28);
    view.defPosition("d20", 268, 185, 29, 29);
    view.defPosition("e20", 334, 185, 29, 29);
    view.defPosition("f20", 403, 185, 29, 29);
    view.defPosition("f21", 399, 181, 28, 28);
    view.defPosition("f22", 395, 177, 28, 28);
    view.defPosition("f23", 391, 173, 28, 28);
    view.defPosition("g20", 470, 185, 29, 29);
    view.defPosition("g21", 467, 182, 28, 28);
    view.defPosition("g22", 463, 178, 28, 28);
    view.defPosition("g23", 459, 174, 28, 28);
    view.defPosition("h20", 536, 185, 29, 29);
    view.defPosition("a10", 67, 255, 29, 29);
    view.defPosition("b10", 134, 255, 29, 29);
    view.defPosition("b11", 131, 252, 28, 28);
    view.defPosition("b12", 127, 248, 28, 28);
    view.defPosition("b13", 123, 244, 28, 28);
    view.defPosition("c10", 200, 255, 29, 29);
    view.defPosition("d10", 268, 255, 29, 29);
    view.defPosition("d11", 265, 252, 28, 28);
    view.defPosition("d12", 261, 248, 28, 28);
    view.defPosition("d13", 257, 244, 28, 28);
    view.defPosition("g10", 470, 255, 29, 29);
    view.defPosition("h10", 536, 255, 29, 29);
    view.defPosition("a00", 67, 330, 29, 29);
    view.defPosition("b00", 134, 330, 29, 29);
    view.defPosition("c00", 201, 330, 29, 29);
    view.defPosition("d00", 268, 330, 29, 29);
    view.defPosition("e00", 335, 330, 29, 29);
    view.defPosition("f00", 402, 330, 29, 29);
    view.defPosition("g00", 469, 330, 29, 29);
}
