function Editor(options) {
    this.canvasId = null;
    this.propEditorId = null;
    this.map = null;
    this.pos = vec3blank();
    this.mouse = vec3blank();
    this.selectedObjects = [];
    this.hoveringObjects = [];

    this.scale = 1.0;
    this.centerOnPlayer = true;

    this.sectorTypesVisible = true;
    this.entityTypesVisible = true;
    this.gridVisible = true;
    this.entitiesVisible = true;
    this.gridSize = 10;

    $.extend(true, this, options);
}

Editor.prototype.go = function () {
    var canvas = document.getElementById(this.canvasId);
    var jqCanvas = $('#' + this.canvasId);
    var jqPropEditor = $('#' + this.propEditorId);

    this.context = canvas.getContext('2d');
    this.width = jqCanvas.width();
    this.height = jqCanvas.height();

    if (canvas.addEventListener) {
        canvas.addEventListener('mousewheel', $.proxy(this.onMouseWheel, this), false);
        canvas.addEventListener('DOMMouseScroll', $.proxy(this.onMouseWheel, this), false);
    }
    else
        canvas.attachEvent('onmousewheel', $.proxy(this.onMouseWheel, this));

    jqCanvas.on('mousedown', $.proxy(this.onMouseDown, this));
    jqCanvas.on('mousemove', $.proxy(this.onMouseMove, this));
    jqCanvas.on('mouseup', $.proxy(this.onMouseUp, this));

    jqPropEditor.DataTable({
        paging: false,
        info: false,
        searching: false,
        columns: [
            { title: 'Name' },
            { title: 'Value' }
        ],
        data: []
    });

    setInterval($.proxy(this.timer, this), 16);
};

Editor.prototype.selectObject = function (objects) {
    var jqPropEditor = $('#' + this.propEditorId);
    var dt = jqPropEditor.DataTable();

    this.selectedObjects = objects;

    dt.rows().clear();

    if (objects.length == 0)
        return;

    var uniqueTypes = {};

    for (var i = 0; i < objects.length; i++) {
        uniqueTypes[objects[i].constructor.name] = true;
    }

    if (uniqueTypes.length > 1) {
        dt.row.add([ 'Selected objects have multiple types', '']);
        return;
    }

    var properties = objects[0].constructor.editableProperties;
    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        var unique = {};
        for (var j = 0; j < objects.length; j++) {
            unique[objects[j][prop.name]] = true;
        }
        dt.row.add([ prop.friendly, Object.keys(unique).join(', ')  ]);
    }

    dt.rows().invalidate().draw();
};

Editor.prototype.screenToWorld = function (x, y) {
    return vec3create((x - this.width / 2) / this.scale + this.pos[0],
            (y - this.height / 2) / this.scale + this.pos[1], 0);
};

Editor.prototype.worldToScreen = function (x, y) {
    return vec3create((x - this.pos[0]) * this.scale + this.width / 2,
            (y - this.pos[1]) * this.scale + this.height / 2, 0);
};

Editor.prototype.onMouseDown = function (e) {
};

Editor.prototype.onMouseMove = function (e) {
    this.mouse = vec3create(e.offsetX, e.offsetY, 0);
};

Editor.prototype.onMouseUp = function (e) {
    this.selectObject(this.hoveringObjects);
};

Editor.prototype.onMouseWheel = function (e) {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (this.scale > 0.15)
        this.scale += delta * 0.1;
    else if (this.scale > 0.015)
        this.scale += delta * 0.01;
    else if (this.scale > 0.0015)
        this.scale += delta * 0.001;
};

Editor.prototype.drawEntity = function (entity) {
    if (entity.constructor == Player) {
        // Let's get fancy:
        this.context.strokeStyle = '#999';
        this.context.beginPath();
        this.context.arc(entity.pos[0], entity.pos[1], entity.boundingRadius / 2, 0, 2 * Math.PI, false);
        this.context.stroke();
        this.context.strokeStyle = '#FFF';

        this.context.lineWidth = 2;
        this.context.strokeStyle = '#555';
        this.context.beginPath();
        this.context.moveTo(entity.pos[0], entity.pos[1]);
        this.context.lineTo(entity.pos[0] + Math.cos(deg2rad * entity.angle) * entity.boundingRadius * 2,
                entity.pos[1] + Math.sin(deg2rad * entity.angle) * entity.boundingRadius * 2);
        this.context.stroke();
        this.context.lineWidth = 1;
    }
    else if (entity.constructor == LightEntity)
        this.context.strokeStyle = '#' + rgb2hex(entity.diffuse);

    this.context.beginPath();
    this.context.arc(entity.pos[0], entity.pos[1], entity.boundingRadius, 0, 2 * Math.PI, false);
    this.context.stroke();


    if (this.entityTypesVisible) {
        this.context.fillStyle = '#555';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
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

        if ($.inArray(segment, this.selectedObjects) != -1) {
            var v = this.worldToScreen(segment.ax, segment.ay);
            var v1 = this.screenToWorld(v[0] - 3.0, v[1] - 3.0);
            var v2 = this.screenToWorld(v[0] + 3.0, v[1] + 3.0);
            this.context.strokeStyle = '#CCC';
            this.context.strokeRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
        }

        if (this.hoveringObjects.length == 0 ||
            (this.hoveringObjects[0].constructor == MapSegment &&
                this.hoveringObjects[0].ax == segment.ax &&
                this.hoveringObjects[0].ay == segment.ay)) {
            var v = this.worldToScreen(segment.ax, segment.ay);
            if (vec3length(vec3sub(this.mouse, v, vec3blank(true))) < 5.0) {
                var v1 = this.screenToWorld(v[0] - 3.0, v[1] - 3.0);
                var v2 = this.screenToWorld(v[0] + 3.0, v[1] + 3.0);
                this.context.strokeStyle = '#FFF';
                this.context.strokeRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
                this.hoveringObjects.push(segment);
            }
        }
    }

    if (this.sectorTypesVisible) {
        this.context.fillStyle = '#333';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(sector.constructor.name, sector.centerX, sector.centerY);
    }
};

Editor.prototype.timer = function () {
    this.width = $('#' + this.canvasId).width();
    this.height = $('#' + this.canvasId).height();
    //var canvas = document.getElementById(this.canvasId);
    //this.context = canvas.getContext('2d');


    if (this.centerOnPlayer)
        this.pos = this.map.player.pos;

    this.context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.translate(-this.pos[0] * this.scale + this.width / 2, -this.pos[1] * this.scale + this.height / 2);
    this.context.scale(this.scale, this.scale);

    if (this.gridVisible && this.scale * this.gridSize > 3.0) {
        this.context.fillStyle = '#333';
        var vStart = this.screenToWorld(0, 0);
        var vEnd = this.screenToWorld(this.width, this.height);
        var xStart = fast_floor(vStart[0] / this.gridSize) * this.gridSize;
        var xEnd = fast_floor(vEnd[0] / this.gridSize) * this.gridSize;
        var yStart = fast_floor(vStart[1] / this.gridSize + 1.0) * this.gridSize;
        var yEnd = fast_floor(vEnd[1] / this.gridSize + 1.0) * this.gridSize;

        for (var x = xStart; x < xEnd; x += 10) {
            for (var y = yStart; y < yEnd; y += 10) {
                this.context.fillRect(x, y, 1, 1);
            }
        }
    }

    this.hoveringObjects = [];

    for (var i = 0; i < this.map.sectors.length; i++) {
        this.drawSector(this.map.sectors[i]);
    }

    this.drawEntity(this.map.player);
};
