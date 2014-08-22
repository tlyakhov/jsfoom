function Editor(options) {
    $.extend(true, this, options);
}

Editor.prototype.init = function (canvasId) {
    this.context = document.getElementById(canvasId).getContext('2d');
    this.width = $('#' + canvasId).width();
    this.height = $('#' + canvasId).height();
    this.pos = vec3blank();
    this.centerOnPlayer = true;

    this.sectorTypesVisible = true;
    this.entityTypesVisible = true;
    this.gridVisible = true;
    this.entitiesVisible = true;

    setInterval($.proxy(this.timer, this), 16);
};

Editor.prototype.drawEntity = function (entity) {
    if (entity.constructor == Player) {
        // Let's get fancy:
        this.context.strokeStyle = '#999';
        this.context.beginPath();
        this.context.arc(entity.pos[0], entity.pos[1], entity.boundingRadius / 2, 0, 2 * Math.PI, false);
        this.context.stroke();
        this.context.strokeStyle = '#FFF';
    }
    else if (entity.constructor == LightEntity)
        this.context.strokeStyle = '#' + rgb2hex(entity.diffuse);
    this.context.beginPath();
    this.context.arc(entity.pos[0], entity.pos[1], entity.boundingRadius, 0, 2 * Math.PI, false);
    this.context.stroke();

    if (this.entityTypesVisible) {
        this.context.fillStyle = '#555';
        this.context.textAlign = 'center';
        this.context.fillText(entity.constructor.name, entity.pos[0], entity.pos[1]);
    }
};

Editor.prototype.drawSector = function (sector) {
    if (sector.segments.length == 0)
        return;

    if (this.entitiesVisible) {
        for (var j = 0; j < sector.entities.length; j++) {
            this.drawEntity(sector.entities[j]);
        }
    }

    for (var j = 0; j < sector.segments.length; j++) {
        var segment = sector.segments[j];
        var nextSegment = sector.segments[(j + 1) % sector.segments.length];

        if (segment.midMaterialId)
            this.context.strokeStyle = '#FFF';
        else
            this.context.strokeStyle = '#F00';

        this.context.beginPath();
        this.context.moveTo(segment.ax, segment.ay);
        this.context.lineTo(nextSegment.ax, nextSegment.ay);
        this.context.stroke();
    }

    if (this.sectorTypesVisible) {
        this.context.fillStyle = '#333';
        this.context.textAlign = 'center';
        this.context.fillText(sector.constructor.name, sector.centerX, sector.centerY);
    }
};

Editor.prototype.timer = function () {
    if (this.centerOnPlayer)
        this.pos = map.player.pos;

    this.context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.translate(-this.pos[0] + this.width / 2, -this.pos[1] + this.height / 2);

    for (var i = 0; i < map.sectors.length; i++) {
        this.drawSector(map.sectors[i]);
    }

    this.drawEntity(map.player);
};

var globalEditor = new Editor();