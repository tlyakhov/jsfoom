var EDITOR_CONSTANTS = {
    segmentSelectionEpsilon: 5.0,
    colorSelectionPrimary: '#0F0',
    colorSelectionSecondary: '#0FF'
};

function Editor(options) {
    this.canvasId = null;
    this.propEditorId = null;
    this.toolbarId = null;

    this.editState = 'idle';
    this.map = null;
    this.pos = vec3blank();
    this.scale = 1.0;

    this.mouseDownWorld = vec3blank();
    this.mouse = vec3blank();
    this.mouseWorld = vec3blank();

    this.originalPositions = {}; // For moving
    this.selectedObjects = [];
    this.hoveringObjects = [];

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
    var jqToolbar = $('#' + this.toolbarId);

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
    jqCanvas.on('contextmenu', function () {
        return false;
    });

    jqPropEditor.DataTable({
        paging: false,
        info: false,
        searching: false,
        columns: [
            { title: 'Name', name: 'name', data: $.proxy(this.renderPropertyName, this) },
            { title: 'Value', name: 'value', data: $.proxy(this.renderPropertyValue, this) }
        ],
        data: []
    });

    jqToolbar.kendoToolBar({
        items: [
            { type: 'button', text: 'Show Entity Types', togglable: true }
        ]
    });

    setInterval($.proxy(this.timer, this), 16);
};

Editor.prototype.renderPropertyName = function (row, type, set, meta) {
    if (type == 'sort') {
        if (row.name == 'id')
            return '!!!' + row.name;
        else if (row.type == 'type')
            return '!!' + row.name;
        else if (row.type == 'material_id')
            return '!' + row.name;
        else
            return row.name;
    }

    return row.name;
};

Editor.prototype.renderPropertyValue = function (row, type, set, meta) {
    var isArray = Object.prototype.toString.call(row.value) === '[object Array]';
    var isEnum = Object.prototype.toString.call(row.type) === '[object Array]';

    if (row.type == 'material_id') {
        var result = '';
        var materialIds = isArray ? row.value : [ row.value ];

        for (var i = 0; i < materialIds.length; i++) {
            if (result.length > 0)
                result += ', ';

            var material = this.map.getMaterial(materialIds[i]);

            if (!material) {
                result += 'ERROR - ' + materialIds[i];
                continue;
            }

            result += "<img src=\"" + material.textureSrc + "\" class=\"editor-property-image\" /><b>" + material.id + "</b>";
        }

        return result;
    }
    else if (row.type == 'vector') {
        var result = '';
        var vectors = isArray ? row.value : [ row.value ];

        for (var i = 0; i < vectors.length; i++) {
            if (result.length > 0)
                result += ', ';

            result += '[<b>' + vectors[i][0] + '</b>,<b>' + vectors[i][1] + '</b>,<b>' + vectors[i][2] + '</b>]';
        }

        return result;
    }

    if (isArray)
        return row.value.join(', ');
    else
        return row.value;
};

Editor.prototype.selectObject = function (objects) {
    var jqPropEditor = $('#' + this.propEditorId);
    var dt = jqPropEditor.DataTable();

    if (!objects || objects.length == 0)
        objects = [ this.map ];

    this.selectedObjects = objects;

    dt.rows().clear();

    if (objects.length == 0)
        return;

    var uniqueTypes = {};

    for (var i = 0; i < objects.length; i++) {
        uniqueTypes[objects[i].constructor.name] = true;
    }

    if (uniqueTypes.length > 1) {
        dt.row.add({ name: 'Error', value: 'Selected objects have multiple types', type: 'string' });
        return;
    }

    dt.row.add({ name: 'Type', value: objects[0].constructor.name, type: 'type' });

    var properties = objects[0].constructor.editableProperties;
    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        var all = [];
        for (var j = 0; j < objects.length; j++) {
            all.push(objects[j][prop.name]);
        }
        dt.row.add({ name: prop.friendly, value: all, type: prop.type });
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
    e.preventDefault();

    this.mouseDownWorld = this.screenToWorld(e.offsetX, e.offsetY);

    if (e.button == 2 && this.editState == 'idle') {
        this.editState = 'selectionStart';
    }
    else if (e.button == 0 && this.editState == 'idle' && this.selectedObjects.length > 0) {
        this.editState = 'movingStart';

        this.originalPositions = {};
        for (var i = 0; i < this.selectedObjects.length; i++) {
            var object = this.selectedObjects[i];
            var op = null;

            if (object.constructor.name == 'MapSegment') {
                op = vec3create(object.ax, object.ay, 0);
            }
            else if (object.parent.constructor.name == 'Entity') {
                op = vec3clone(object.pos);
            }
            else if (object.constructor.name == 'MapSector') {
                op = { segments: [], entities: [], adj: {} };
                for (var j = 0; j < object.segments.length; j++) {
                    op.segments.push(vec3create(object.segments[j].ax, object.segments[j].ay, 0));

                    var adj = object.segments[j].getAdjacentSegment();

                    if (adj) {
                        op.adj[adj.id] = vec3create(adj.ax, adj.ay, 0);
                    }
                }
                for (var j = 0; j < object.entities.length; j++) {
                    op.entities.push(vec3clone(object.entities[j].pos));
                }

            }
            this.originalPositions[object.constructor.name + '|' + object.id] = op;
        }
    }

    return false;
};

Editor.prototype.onMouseMove = function (e) {
    e.preventDefault();

    if (this.editState == 'selectionStart') {
        this.editState = 'selecting';
    }
    else if (this.editState == 'movingStart') {
        this.editState = 'moving';
    }

    this.mouse = vec3create(e.offsetX, e.offsetY, 0);
    this.mouseWorld = this.screenToWorld(this.mouse[0], this.mouse[1]);

    if (this.editState == 'moving') {
        var dx = this.mouseWorld[0] - this.mouseDownWorld[0];
        var dy = this.mouseWorld[1] - this.mouseDownWorld[1];

        for (var i = 0; i < this.selectedObjects.length; i++) {
            var object = this.selectedObjects[i];
            var op = this.originalPositions[object.constructor.name + '|' + object.id];
            if (object.constructor.name == 'MapSegment') {
                object.ax = op[0] + dx;
                object.ay = op[1] + dy;
                object.sector.update();
            }
            else if (object.parent.constructor.name == 'Entity') {
                object.pos[0] = op[0] + dx;
                object.pos[1] = op[1] + dy;
                object.updateSector();
            }
            else if (object.constructor.name == 'MapSector') {
                for (var j = 0; j < object.segments.length; j++) {
                    var segment = object.segments[j];

                    segment.ax = op.segments[j][0] + dx;
                    segment.ay = op.segments[j][1] + dy;

                    var adj = segment.getAdjacentSegment();

                    if (adj) {
                        adj.ax = op.adj[adj.id][0] + dx;
                        adj.ay = op.adj[adj.id][1] + dy;
                        adj.sector.update();
                    }
                }
                for (var j = 0; j < object.entities.length; j++) {
                    object.entities[j].pos[0] = op.entities[j][0] + dx;
                    object.entities[j].pos[1] = op.entities[j][1] + dy;
                }
                object.update();
            }
        }
    }

    return false;
};

Editor.prototype.onMouseUp = function (e) {
    e.preventDefault();

    if (e.button == 2) {
        this.selectObject(this.hoveringObjects);
    }

    if (this.editState == 'moving') {
        this.selectObject(this.selectedObjects); // Updates properties.
    }

    this.editState = 'idle';
    return false;
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

Editor.prototype.drawEntityAngle = function (entity) {
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(entity.pos[0], entity.pos[1]);
    this.context.lineTo(entity.pos[0] + Math.cos(deg2rad * entity.angle) * entity.boundingRadius * 2,
            entity.pos[1] + Math.sin(deg2rad * entity.angle) * entity.boundingRadius * 2);
    this.context.stroke();
    this.context.lineWidth = 1;
};

Editor.prototype.drawEntity = function (entity) {
    var entityHovering = ($.inArray(entity, this.hoveringObjects) != -1);
    var entitySelected = ($.inArray(entity, this.selectedObjects) != -1);

    if (entity.constructor == Player) {
        // Let's get fancy:
        this.context.strokeStyle = '#999';
        this.context.beginPath();
        this.context.arc(entity.pos[0], entity.pos[1], entity.boundingRadius / 2, 0, 2 * Math.PI, false);
        this.context.stroke();
        this.context.strokeStyle = '#FFF';

        this.context.strokeStyle = '#555';
        this.drawEntityAngle(entity);
    }
    else if (entity.constructor == LightEntity)
        this.context.strokeStyle = '#' + rgb2hex(entity.diffuse);
    else if (entity.constructor == StaticEntity) {
        this.context.strokeStyle = '#AAA';
        this.drawEntityAngle(entity);
        this.context.strokeStyle = '#888';
    }

    if (entityHovering || entitySelected) {
        this.context.strokeStyle = EDITOR_CONSTANTS.colorSelectionPrimary;
    }

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

    var sectorHovering = ($.inArray(sector, this.hoveringObjects) != -1);
    var sectorSelected = ($.inArray(sector, this.selectedObjects) != -1);

    if (this.entitiesVisible) {
        for (var j = 0; j < sector.entities.length; j++) {
            this.drawEntity(sector.entities[j]);
        }
    }

    for (var j = 0; j < sector.segments.length; j++) {
        var segment = sector.segments[j];
        var nextSegment = sector.segments[(j + 1) % sector.segments.length];

        var segmentHovering = ($.inArray(segment, this.hoveringObjects) != -1);
        var segmentSelected = ($.inArray(segment, this.selectedObjects) != -1);

        if (segment.midMaterialId)
            this.context.strokeStyle = '#FFF';
        else
            this.context.strokeStyle = '#FF0';

        if (sectorHovering || sectorSelected) {
            if (segment.midMaterialId)
                this.context.strokeStyle = EDITOR_CONSTANTS.colorSelectionPrimary;
            else
                this.context.strokeStyle = EDITOR_CONSTANTS.colorSelectionSecondary;
        }
        else if (segmentHovering || segmentSelected) {
            this.context.strokeStyle = segmentHovering ? EDITOR_CONSTANTS.colorSelectionSecondary : EDITOR_CONSTANTS.colorSelectionPrimary;
        }

        this.context.beginPath();
        this.context.moveTo(segment.ax, segment.ay);
        this.context.lineTo(nextSegment.ax, nextSegment.ay);
        this.context.stroke();

        if (segmentHovering || segmentSelected) {
            var v = this.worldToScreen(segment.ax, segment.ay);
            var v1 = this.screenToWorld(v[0] - 3.0, v[1] - 3.0);
            var v2 = this.screenToWorld(v[0] + 3.0, v[1] + 3.0);
            this.context.strokeStyle = segmentHovering ? EDITOR_CONSTANTS.colorSelectionSecondary : EDITOR_CONSTANTS.colorSelectionPrimary;
            this.context.strokeRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
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

    var v1 = vec3clone(this.mouseWorld);
    var v2 = vec3clone(this.mouseDownWorld);

    if (v2[0] < v1[0]) {
        var tmp = v1[0];
        v1[0] = v2[0];
        v2[0] = tmp;
    }

    if (v2[1] < v1[1]) {
        var tmp = v1[1];
        v1[1] = v2[1];
        v2[1] = tmp;
    }

    // Selection
    for (var i = 0; i < this.map.sectors.length; i++) {
        var sector = this.map.sectors[i];

        var sectorHovering = ($.inArray(sector, this.hoveringObjects) != -1);

        for (var j = 0; j < sector.segments.length; j++) {
            var segment = sector.segments[j];

            if (this.editState == 'idle' || this.editState == 'selecting') {
                var hov = this.hoveringObjects[0] || null;
                var isSameLocation = hov && hov.constructor == MapSegment && hov.ax == segment.ax && hov.ay == segment.ay;

                if (!hov || isSameLocation) {
                    var v = this.worldToScreen(segment.ax, segment.ay);
                    if (vec3length(vec3sub(this.mouse, v, vec3blank(true))) < EDITOR_CONSTANTS.segmentSelectionEpsilon) {
                        this.hoveringObjects.push(segment);
                    }
                }
            }
            if (this.editState == 'selecting') {
                if (segment.ax >= v1[0] && segment.ay >= v1[1] &&
                    segment.ax <= v2[0] && segment.ay <= v2[1]) {

                    if ($.inArray(segment, this.hoveringObjects) == -1) {
                        this.hoveringObjects.push(segment);
                    }
                }
            }
        }

        for (var j = 0; j < sector.entities.length; j++) {
            var entity = sector.entities[j];

            if (entity.pos[0] - entity.boundingRadius >= v1[0] && entity.pos[0] + entity.boundingRadius <= v2[0] &&
                entity.pos[1] - entity.boundingRadius >= v1[1] && entity.pos[1] + entity.boundingRadius <= v2[1]) {
                if ($.inArray(entity, this.hoveringObjects) == -1) {
                    this.hoveringObjects.push(entity);
                }
            }
        }
    }

    // Drawing
    for (var i = 0; i < this.map.sectors.length; i++) {
        this.drawSector(this.map.sectors[i]);
    }

    if (this.editState == 'selecting') {
        var v1 = this.mouseDownWorld;
        var v2 = this.mouseWorld;

        this.context.globalAlpha = 0.3;
        this.context.fillStyle = '#33F';
        this.context.fillRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
        this.context.strokeStyle = '#AAF';
        this.context.strokeRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
        this.context.globalAlpha = 1;
    }

    this.drawEntity(this.map.player);
};
