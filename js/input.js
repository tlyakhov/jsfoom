var KEY_A = 65;
var KEY_B = 66;
var KEY_D = 68;
var KEY_H = 72;
var KEY_I = 73;
var KEY_R = 82;
var KEY_S = 83;
var KEY_T = 84;
var KEY_V = 86;
var KEY_W = 87;
var KEY_ARROW_UP = 38;
var KEY_ARROW_DOWN = 40;
var KEY_ARROW_LEFT = 37;
var KEY_ARROW_RIGHT = 39;
var KEY_WII_UP = 175;
var KEY_WII_DOWN = 176;
var KEY_WII_LEFT = 178;
var KEY_WII_RIGHT = 177;
var KEY_WII_B = 171;

var keys = {};

function keyDown(e) {
    var keynum;
    if (window.event)
        keynum = e.keyCode;
    else if (e.which)
        keynum = e.which;

    keys[keynum] = 1;
}
function keyUp(e) {
    var keynum;
    if (window.event) {
        keynum = e.keyCode;
    } else if (e.which) {
        keynum = e.which;
    }
    keys[keynum] = 0;
}

function checkInput() {
    if (keys[KEY_W] == 1) {
        player.move(player.angle, lastFrameTime);
    }

    if (keys[KEY_S] == 1) {
        player.move(player.angle + 180.0, lastFrameTime);
    }

    if (keys[KEY_A] == 1) {
        player.angle -= 5.0 * lastFrameTime / 30.0;
        player.angle = fast_floor(normalizeAngle(player.angle));
    }

    if (keys[KEY_D] == 1) {
        player.angle += 5.0 * lastFrameTime / 30.0;
        player.angle = fast_floor(normalizeAngle(player.angle));
    }
}