Player.prototype = new Entity();
Player.prototype.constructor = Player;
Player.prototype.parent = Entity.prototype;

function Player(options) {
    this.parent.constructor.call(this, options);

    this.height = 32;
    this.x = this.map.spawnx;
    this.y = this.map.spawny;

    $.extend(true, this, options);
    this.updateSector();
}

Player.prototype.frame = function (lastFrameTime) {
    this.parent.frame.call(this, lastFrameTime);

    this.sector.actOnEntity(this);

    this.updateSector();
}

Player.prototype.move = function (angle, lastFrameTime) {
    var speed = 2.0 / 8;

    for (var i = 0; i < 8; i++) {
        var opx = this.x;
        var opy = this.y;

        this.velX += Math.cos(angle * deg2rad) * speed;

        this.x += this.velX * lastFrameTime / 10.0;
        this.y += this.velY * lastFrameTime / 10.0;

        if (!this.updateSector()) {
            this.velX = Math.cos(angle * deg2rad) * -0.1;
        }

        this.velY += Math.sin(angle * deg2rad) * speed;

        this.x = opx + this.velX * lastFrameTime / 10.0;
        this.y = opy + this.velY * lastFrameTime / 10.0;

        if (!this.updateSector()) {
            this.velY = Math.sin(angle * deg2rad) * -0.1;
        }

        this.x = opx;
        this.y = opy;
    }
}