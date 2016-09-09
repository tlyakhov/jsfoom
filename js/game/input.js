'use strict';

var KEY_0 = 48;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;
var KEY_6 = 54;
var KEY_7 = 55;
var KEY_8 = 56;
var KEY_9 = 57;
var KEY_A = 65;
var KEY_B = 66;
var KEY_C = 67;
var KEY_D = 68;
var KEY_E = 69;
var KEY_H = 72;
var KEY_I = 73;
var KEY_O = 79;
var KEY_Q = 81;
var KEY_R = 82;
var KEY_S = 83;
var KEY_T = 84;
var KEY_V = 86;
var KEY_W = 87;
var KEY_Y = 89;
var KEY_Z = 90;
var KEY_ESC = 27;
var KEY_SPACE = 32;
var KEY_DEL = 46;
var KEY_BACKSPACE = 8;
var KEY_ARROW_UP = 38;
var KEY_ARROW_DOWN = 40;
var KEY_ARROW_LEFT = 37;
var KEY_ARROW_RIGHT = 39;
var KEY_WII_UP = 175;
var KEY_WII_DOWN = 176;
var KEY_WII_LEFT = 178;
var KEY_WII_RIGHT = 177;
var KEY_WII_B = 171;

function keyDown(e) {
    var keynum;
    if (window.event)
        keynum = e.keyCode;
    else if (e.which)
        keynum = e.which;

    globalGame.prevKeys[keynum] = globalGame.keys[keynum];
    globalGame.keys[keynum] = true;
}
function keyUp(e) {
    var keynum;
    if (window.event) {
        keynum = e.keyCode;
    } else if (e.which) {
        keynum = e.which;
    }
    globalGame.prevKeys[keynum] = globalGame.keys[keynum];
    globalGame.keys[keynum] = false;
}

