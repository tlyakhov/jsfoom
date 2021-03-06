'use strict';

var EDITOR_CONSTANTS = {
    segmentSelectionEpsilon: 5.0,
    gridSize: 10.0,
    colorSelectionPrimary: '#0F0',
    colorSelectionSecondary: '#0FF',
    colorPVS: '#9F9'
};

function Editor(options) {
    this.canvasId = null;
    this.propEditorId = null;
    this.toolbarId = null;
    this.menuId = null;
    this.propExtrasId = null;

    this.editState = 'idle';
    this.map = null;
    this.pos = vec3blank();
    this.scale = 1.0;

    this.mouseDown = null;
    this.mouseDownWorld = null;
    this.mouse = vec3blank();
    this.mouseWorld = vec3blank();

    this.currentTool = 'default'; // 'addEntity', 'addSector'
    this.currentAction = null;
    this.undoHistory = [];
    this.redoHistory = [];

    this.selectedObjects = [];
    this.hoveringObjects = [];

    this.centerOnPlayer = false;
    this.sectorTypesVisible = false;
    this.entityTypesVisible = true;
    this.gridVisible = true;
    this.entitiesVisible = true;
    this.entitiesPaused = true;
    this.gridSize = EDITOR_CONSTANTS.gridSize;

    $.extend(true, this, options);
}

Editor.prototype.go = function () {
    var canvas = document.getElementById(this.canvasId);
    var jqCanvas = $('#' + this.canvasId);
    var jqPropEditor = $('#' + this.propEditorId);
    var jqToolbar = $('#' + this.toolbarId);
    var jqMenu = $('#' + this.menuId);

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
    jqCanvas.on('keydown', $.proxy(this.onKeyPress, this));

    jqPropEditor.DataTable({
        paging: false,
        info: false,
        searching: false,
        rowCallback: $.proxy(this.propertyRowCallback, this),
        columns: [
            { title: 'Name', name: 'name', data: $.proxy(this.renderPropertyName, this) },
            { title: 'Value', name: 'value', render: $.proxy(this.renderPropertyValue, this), data: $.proxy(this.dataPropertyValue, this) }
        ],
        data: []
    });

    $('body').on('click', '.prop-grid-array-add a', $.proxy(this.onPropGridArrayAdd, this));
    $('body').on('click', '.prop-grid-array-clear', $.proxy(this.onPropGridArrayClear, this));
    $('body').on('click', '.prop-grid-array-up', $.proxy(this.onPropGridArrayUp, this));
    $('body').on('click', '.prop-grid-array-down', $.proxy(this.onPropGridArrayDown, this));
    $('body').on('click', '.prop-grid-array-delete', $.proxy(this.onPropGridArrayDelete, this));
    $('body').on('click', '.prop-grid-object-add a', $.proxy(this.onPropGridObjectAdd, this));
    $('body').on('click', '.prop-grid-object-clear', $.proxy(this.onPropGridObjectClear, this));

    var entityTypes = subclassesOf(Entity).filter(function(s) { return !s.editorHidden; });
    var entityList = [];
    var sectorTypes = subclassesOf(MapSector).filter(function(s) { return !s.editorHidden; });
    var sectorList = [];

    for (var i = 0; i < entityTypes.length; i++) {
        entityList.push({
            id: entityTypes[i].name,
            text: entityTypes[i].name
        })
    }

    for (var i = 0; i < sectorTypes.length; i++) {
        sectorList.push({
            id: sectorTypes[i].name,
            text: sectorTypes[i].name
        })
    }

    jqToolbar.kendoToolBar({
        items: [
            { id: 'editGroup', type: 'buttonGroup', buttons: [
                { id: 'undo', type: 'button', spriteCssClass: 'toolbar-fa fa fa-undo fa-fw', text: '', encoded: false, click: $.proxy(this.undo, this) },
                { id: 'redo', type: 'button', spriteCssClass: 'toolbar-fa fa fa-repeat fa-fw', text: '', click: $.proxy(this.redo, this) },
                { id: 'delete', type: 'button', spriteCssClass: 'toolbar-fa fa fa-times fa-fw', text: '', click: $.proxy(this.delete, this) },
                { id: 'resetEntities', type: 'button', spriteCssClass: 'toolbar-fa fa fa-retweet fa-fw', text: '', click: $.proxy(this.resetEntities, this) },
                { id: 'addMaterial', type: 'button', spriteCssClass: 'toolbar-fa fa fa-plus fa-fw', text: 'Add Material', click: $.proxy(this.addMaterial, this) }
            ] },
            { type: 'separator' },
            { id: 'toolGroup', type: 'buttonGroup', buttons: [
                { id: 'toolDefault', type: 'button', spriteCssClass: 'toolbar-fa fa fa-arrows fa-fw', togglable: true, text: '', selected: true, group: 'tools', toggle: $.proxy(this.toggleTool, this) },
                { id: 'toolSplit', type: 'button', spriteCssClass: 'toolbar-fa fa fa-strikethrough fa-fw', togglable: true, text: '', group: 'tools', toggle: $.proxy(this.toggleTool, this) },
                { id: 'toolScissor', type: 'button', spriteCssClass: 'toolbar-fa fa fa-scissors fa-fw', togglable: true, text: '', group: 'tools', toggle: $.proxy(this.toggleTool, this) }
            ] },
            { type: 'separator' },
            { id: 'toolEntity', type: 'button', spriteCssClass: 'toolbar-fa fa fa-plus fa-fw', togglable: true, text: 'Entity', group: 'tools', toggle: $.proxy(this.toggleTool, this) },
            { id: 'dropdownEntity', template: "<input id='toolbar-dropdown-entity' class='toolbar-dropdown' />", overflow: 'never' },
            { type: 'separator' },
            { id: 'toolSector', type: 'button', spriteCssClass: 'toolbar-fa fa fa-plus fa-fw', togglable: true, text: 'Sector', group: 'tools', toggle: $.proxy(this.toggleTool, this) },
            { id: 'dropdownSector', template: "<input id='toolbar-dropdown-sector' class='toolbar-dropdown' />", overflow: 'never' }
        ]
    });

    $('#toolbar-dropdown-entity').kendoDropDownList({
        dataTextField: 'text',
        dataValueField: 'id',
        dataSource: entityList
    });

    $('#toolbar-dropdown-sector').kendoDropDownList({
        dataTextField: 'text',
        dataValueField: 'id',
        dataSource: sectorList
    });

    this.menuCheckToggle('#menu-view-show-sector-types', this.sectorTypesVisible);
    this.menuCheckToggle('#menu-view-show-entity-types', this.entityTypesVisible);
    this.menuCheckToggle('#menu-view-show-entities', this.entitiesVisible);
    this.menuCheckToggle('#menu-view-show-grid', this.gridVisible);
    this.menuCheckToggle('#menu-view-center-on-player', this.centerOnPlayer);
    this.menuCheckToggle('#menu-view-entities-paused', this.entitiesPaused);

    jqMenu.kendoMenu({
        select: $.proxy(this.menuSelect, this)
    });

    triggerResize();

    setInterval($.proxy(this.timer, this), 16);
};

Editor.prototype.toggleTool = function (e) {
    if (e.id == 'toolEntity') {
        this.currentTool = 'addEntity';
    }
    else if (e.id == 'toolSector') {
        this.currentTool = 'addSector';
    }
    else if (e.id == 'toolDefault') {
        this.currentTool = 'default';
    }
    else if (e.id == 'toolScissor') {
        this.currentTool = 'scissor';
    }
    else if (e.id == 'toolSplit') {
        this.currentTool = 'split';
    }

    if (this.currentAction)
        this.currentAction.cancel();
    else
        this.actTool();
};

Editor.prototype.menuCheckToggle = function (item, checked) {
    var icon = $(item).find("[class*='fa-check']").first();

    if (checked == undefined)
        icon.toggle();
    else if (checked)
        icon.show();
    else
        icon.hide();
};

Editor.prototype.saveAs = function () {
    var levels = EditorStorage.allLevelNames();

    bootbox.prompt({
        title: 'Save Level',
        message: 'Please enter the name of your level:',
        value: 'Untitled Level',
        callback: $.proxy(function (resultName) {
            if (!resultName)
                return;

            if ($.inArray(resultName, levels) != -1) {
                bootbox.confirm('"' + resultName + '" already exists. Do you want to overwrite?', $.proxy(function (resultOverwrite) {
                    if (!resultOverwrite)
                        return;

                    this.map.id = resultName;
                    EditorStorage.saveLevel(resultName, this.map);
                }, this));
            }
            else {
                this.map.id = resultName;
                EditorStorage.saveLevel(resultName, this.map);
            }
        }, this) });
};

Editor.prototype.menuSelect = function (e) {
    var item = e.item;

    if (item.id == 'menu-file-new') {
        bootbox.confirm('Are you sure you want to create a new level?', $.proxy(function (result) {
            if (!result)
                return;
            this.map = Map.deserialize(globalDefaultMap);
            this.map.entitiesPaused = this.entitiesPaused;
            globalGame.map = this.map;
            if (globalGame.renderer)
                globalGame.renderer.map = this.map;
        }, this));
    }
    else if (item.id == 'menu-file-open') {
        var levels = EditorStorage.allLevelNames();
        var div = $('<div></div>');
        var select = $('<select></select>').attr('id', 'menu-file-open-select').appendTo(div);
        var data = [];
        for (var i = 0; i < levels.length; i++) {
            var name = levels[i];

            var option = $('<option></option>').attr('value', name).text(name);

            option.appendTo(select);
        }

        bootbox.confirm({
            title: 'Open Level',
            message: div.html(),
            callback: $.proxy(function (result) {
                if (!result)
                    return;
                var v = $('#menu-file-open-select').val();

                this.map = EditorStorage.loadLevel(v);
                globalGame.map = this.map;
                if (globalGame.renderer)
                    globalGame.renderer.map = this.map;
                this.map.entitiesPaused = this.entitiesPaused;

                globalGame.resetRenderWorkers();

                this.pos = vec3blank();
                this.scale = 1.0;

            }, this)
        });

        $('#menu-file-open-select').select2({
            width: '100%'
        });
    }
    else if (item.id == 'menu-file-save') {
        if (this.map.id == null)
            this.saveAs();
        EditorStorage.saveLevel(this.map.id, this.map);
    }
    else if (item.id == 'menu-file-save-as') {
        this.saveAs();
    }
    else if (item.id == 'menu-file-download') {
        var s = stringSerialize(this.map);

        window.open('data:application/json;base64,' + (window.btoa ? btoa(s) : s));
    }
    else if (item.id == 'menu-edit-undo')
        this.undo();
    else if (item.id == 'menu-edit-redo')
        this.redo();
    else if (item.id == 'menu-edit-delete')
        this.delete();
    else if (item.id == 'menu-view-show-entity-types') {
        this.entityTypesVisible = !this.entityTypesVisible;
        this.menuCheckToggle(item);
    }
    else if (item.id == 'menu-view-show-sector-types') {
        this.sectorTypesVisible = !this.sectorTypesVisible;
        this.menuCheckToggle(item);
    }
    else if (item.id == 'menu-view-show-entities') {
        this.entitiesVisible = !this.entitiesVisible;
        this.menuCheckToggle(item);
    }
    else if (item.id == 'menu-view-show-grid') {
        this.gridVisible = !this.gridVisible;
        this.menuCheckToggle(item);
    }
    else if (item.id == 'menu-view-center-on-player') {
        this.centerOnPlayer = !this.centerOnPlayer;
        this.menuCheckToggle(item);
    }
    else if (item.id == 'menu-view-entities-paused') {
        this.map.entitiesPaused = this.entitiesPaused = !this.entitiesPaused;
        this.menuCheckToggle(item);
    }
};

Editor.prototype.addMaterial = function() {
    var action = this.newAction(AddMaterialEditorAction);
    action.act();
};

Editor.prototype.selectObject = function (objects) {
    if (!objects || objects.length == 0)
        objects = [ this.map ];

    this.selectedObjects = objects;
    this.refreshPropertyGrid();
};

Editor.prototype.screenToWorld = function (x, y) {
    return vec3create((x - this.width / 2) / this.scale + this.pos[0],
            (y - this.height / 2) / this.scale + this.pos[1], 0);
};

Editor.prototype.worldToScreen = function (x, y) {
    return vec3create((x - this.pos[0]) * this.scale + this.width / 2,
            (y - this.pos[1]) * this.scale + this.height / 2, 0);
};

Editor.prototype.newAction = function (clazz) {
    this.currentAction = new clazz(this);
    this.undoHistory.push(this.currentAction);
    if (this.undoHistory.length > 100) {
        this.undoHistory = this.undoHistory.slice(this.undoHistory.length - 100);
    }
    this.redoHistory = [];

    return this.currentAction;
};

Editor.prototype.actionFinished = function () {
    this.setCursor();
    this.editState = 'idle';
    this.currentAction = null;
    this.actTool();
};

Editor.prototype.actTool = function () {
    if (this.currentTool == 'addEntity') {
        var ddl = $('#toolbar-dropdown-entity').data('kendoDropDownList');
        this.newAction(AddEntityEditorAction).act(new classes[ddl.dataItem().id]());
    }
    else if (this.currentTool == 'addSector') {
        var ddl = $('#toolbar-dropdown-sector').data('kendoDropDownList');
        this.newAction(AddSectorEditorAction).act(new classes[ddl.dataItem().id]());
    }
    else if (this.currentTool == 'scissor') {
        this.newAction(ScissorEditorAction);
    }
    else if (this.currentTool == 'split') {
        this.newAction(SplitEditorAction);
    }
};

Editor.prototype.undo = function () {
    var action = this.undoHistory.pop();

    if (!action)
        return;

    action.undo();

    this.redoHistory.push(action);
};

Editor.prototype.redo = function () {
    var action = this.redoHistory.pop();

    if (!action)
        return;

    action.redo();

    this.undoHistory.push(action);
};

Editor.prototype.delete = function () {
    this.newAction(DeleteEditorAction).act();
};

Editor.prototype.resetEntities = function () {
    this.map.resetAllEntities();
};

Editor.prototype.onKeyPress = function (e) {
    if (e.keyCode == KEY_O && e.ctrlKey) {
        $('#menu-file-open').trigger('click');
    }
    else if (e.keyCode == KEY_S && e.ctrlKey) {
        $('#menu-file-save').trigger('click');
    }
    else if (e.keyCode == KEY_Z && e.ctrlKey) {
        $('#menu-edit-undo').trigger('click');
    }
    else if (e.keyCode == KEY_Y && e.ctrlKey) {
        $('#menu-edit-redo').trigger('click');
    }
    else if (e.keyCode == KEY_DEL || e.keyCode == KEY_BACKSPACE) {
        $('#menu-edit-delete').trigger('click');
    }
    else if (e.keyCode == KEY_E && e.ctrlKey) {
        $('#menu-view-entities-paused').trigger('click');
    }

    e.preventDefault();
};

Editor.prototype.onMouseDown = function (e) {
    e.preventDefault();

    $('#' + this.canvasId).focus();

    this.mouseDown = vec3create(e.offsetX, e.offsetY, 0);
    this.mouseDownWorld = this.screenToWorld(e.offsetX, e.offsetY);

    if (e.button == 2 && !this.currentAction) {
        this.newAction(SelectEditorAction);
    }
    if (e.button == 1 && !this.currentAction) {
        this.newAction(PanEditorAction);
    }
    else if (e.button == 0 && !this.currentAction && this.selectedObjects.length > 0) {
        this.newAction(MoveEditorAction);
    }

    if (this.currentAction)
        this.currentAction.onMouseDown(e);

    return false;
};

Editor.prototype.findSector = function () {
    for (var i = 0; i < this.map.sectors.length; i++) {
        var sector = this.map.sectors[i];

        if (sector.isPointInside(this.mouseWorld[0], this.mouseWorld[1])) {
            return sector;
        }
    }

    return null;
};

Editor.prototype.onMouseMove = function (e) {
    e.preventDefault();

    this.mouse = vec3create(e.offsetX, e.offsetY, 0);
    this.mouseWorld = this.screenToWorld(this.mouse[0], this.mouse[1]);

    if (this.currentAction)
        this.currentAction.onMouseMove(e);

    return false;
};

Editor.prototype.onMouseUp = function (e) {
    e.preventDefault();

    if (this.currentAction)
        this.currentAction.onMouseUp(e);

    this.mouseDown = null;
    this.mouseDownWorld = null;
    return false;
};

Editor.prototype.onMouseWheel = function (e) {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (this.scale > 0.25)
        this.scale += delta * 0.2;
    else if (this.scale > 0.025)
        this.scale += delta * 0.02;
    else if (this.scale > 0.0025)
        this.scale += delta * 0.002;
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

    if (isA(entity, Player)) {
        // Let's get fancy:
        this.context.strokeStyle = '#999';
        this.context.beginPath();
        this.context.arc(entity.pos[0], entity.pos[1], entity.boundingRadius / 2, 0, 2 * Math.PI, false);
        this.context.stroke();
        this.context.strokeStyle = '#FFF';

        this.context.strokeStyle = '#555';
        this.drawEntityAngle(entity);
    }
    else if (isA(entity, LightEntity)) {
        var behavior = entity.getBehavior(LightBehavior);
        if(behavior)
            this.context.strokeStyle = '#' + rgb2hex(behavior.diffuse);
    }
    else if (isA(entity, SpriteEntity)) {
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

    for (var i = 0; i < entity.behaviors.length; i++) {
        var behavior = entity.behaviors[i];

        if ((isA(behavior, WanderBehavior) || isA(behavior, WaypointBehavior)) && behavior.target) {
            this.context.strokeStyle = '#F00';
            this.context.beginPath();
            this.context.arc(behavior.target[0], behavior.target[1], 5, 0, 2 * Math.PI, false);
            this.context.stroke();
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillText(behavior.constructor.name, behavior.target[0], behavior.target[1]);
        }
    }

    if (this.entityTypesVisible) {
        this.context.fillStyle = '#555';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(entity.constructor.name, entity.pos[0], entity.pos[1]);
    }
};

Editor.prototype.drawHandle = function (x, y, style) {
    var v = this.worldToScreen(x, y);
    var v1 = this.screenToWorld(v[0] - 3.0, v[1] - 3.0);
    var v2 = this.screenToWorld(v[0] + 3.0, v[1] + 3.0);
    this.context.strokeStyle = style;
    this.context.strokeRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
};

Editor.prototype.mapPoint = function (segment) {
    if (!segment.mapPoint)
        segment.mapPoint = new MapPoint(segment);

    return segment.mapPoint;
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

        if (!segment.adjacentSectorId)
            this.context.strokeStyle = '#FFF';
        else
            this.context.strokeStyle = '#FF0';

        if (sectorHovering || sectorSelected) {
            if (!segment.adjacentSectorId)
                this.context.strokeStyle = EDITOR_CONSTANTS.colorSelectionPrimary;
            else
                this.context.strokeStyle = EDITOR_CONSTANTS.colorSelectionSecondary;
        }
        else if (segmentHovering || segmentSelected) {
            this.context.strokeStyle = segmentHovering ? EDITOR_CONSTANTS.colorSelectionSecondary : EDITOR_CONSTANTS.colorSelectionPrimary;
        }

        for (var k = 0; k < this.selectedObjects.length; k++) {
            var object = this.selectedObjects[k];
            if (object == sector || !isA(object, MapSector))
                continue;
            if (object.pvs[sector.id]) {
                this.context.strokeStyle = EDITOR_CONSTANTS.colorPVS;
            }
        }

        this.context.beginPath();
        this.context.moveTo(segment.ax, segment.ay);
        this.context.lineTo(nextSegment.ax, nextSegment.ay);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo((segment.ax + nextSegment.ax) / 2, (segment.ay + nextSegment.ay) / 2);
        this.context.lineTo((segment.ax + nextSegment.ax) / 2 + segment.normal[0] * 4, (segment.ay + nextSegment.ay) / 2 + segment.normal[1] * 4);
        this.context.stroke();

        var mapPointHovering = ($.inArray(this.mapPoint(segment), this.hoveringObjects) != -1);
        var mapPointSelected = ($.inArray(this.mapPoint(segment), this.selectedObjects) != -1);

        if (mapPointHovering || mapPointSelected) {
            this.drawHandle(segment.ax, segment.ay, mapPointHovering ? EDITOR_CONSTANTS.colorSelectionSecondary : EDITOR_CONSTANTS.colorSelectionPrimary);
        }
        else {
            this.context.strokeRect(segment.ax - 1.0, segment.ay - 1.0, 2.0, 2.0);
        }

    }

    if (this.sectorTypesVisible) {
        this.context.fillStyle = '#333';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(sector.constructor.name, sector.center[0], sector.center[1]);
    }
};

Editor.prototype.timer = function () {
    this.width = $('#' + this.canvasId).width();
    this.height = $('#' + this.canvasId).height();
    //var canvas = document.getElementById(this.canvasId);
    //this.context = canvas.getContext('2d');

    if (this.currentAction)
        this.currentAction.frame();

    if (this.centerOnPlayer)
        this.pos = vec3clone(this.map.player.pos);

    this.context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.translate(-this.pos[0] * this.scale + this.width / 2, -this.pos[1] * this.scale + this.height / 2);
    this.context.scale(this.scale, this.scale);

    if (this.gridVisible && this.scale * this.gridSize > 5.0) {
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
    var v2 = this.mouseDownWorld ? vec3clone(this.mouseDownWorld) : null;

    if (v2) {
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
    }

    // Hovering
    for (var i = 0; i < this.map.sectors.length; i++) {
        var sector = this.map.sectors[i];

        var sectorHovering = ($.inArray(sector, this.hoveringObjects) != -1);

        for (var j = 0; j < sector.segments.length; j++) {
            var segment = sector.segments[j];

            if (!this.currentAction) {
                var hov = this.hoveringObjects[0] || null;
                var isSameLocation = hov && hov.constructor == MapSegment && hov.ax == segment.ax && hov.ay == segment.ay;

                if (!hov || isSameLocation) {
                    var v = this.worldToScreen(segment.ax, segment.ay);
                    if (vec3length(vec3sub(this.mouse, v, vec3blank(true))) < EDITOR_CONSTANTS.segmentSelectionEpsilon) {
                        this.hoveringObjects.push(segment);
                    }
                }
            }
            if (isA(this.currentAction, SelectEditorAction) && v1 && v2) {
                if (segment.ax >= v1[0] && segment.ay >= v1[1] &&
                    segment.ax <= v2[0] && segment.ay <= v2[1]) {

                    if ($.inArray(this.mapPoint(segment), this.hoveringObjects) == -1) {
                        this.hoveringObjects.push(this.mapPoint(segment));
                    }
                }
                if (segment.aabbIntersect(v1[0], v1[1], v2[0], v2[1])) {

                    if ($.inArray(segment, this.hoveringObjects) == -1) {
                        this.hoveringObjects.push(segment);
                    }
                }
            }
        }

        if (isA(this.currentAction, SelectEditorAction) && v1 && v2) {
            for (var j = 0; j < sector.entities.length; j++) {
                var entity = sector.entities[j];

                if (entity.pos[0] + entity.boundingRadius >= v1[0] && entity.pos[0] - entity.boundingRadius <= v2[0] &&
                    entity.pos[1] + entity.boundingRadius >= v1[1] && entity.pos[1] - entity.boundingRadius <= v2[1]) {
                    if ($.inArray(entity, this.hoveringObjects) == -1) {
                        this.hoveringObjects.push(entity);
                    }
                }
            }
        }
    }

    // Drawing
    for (var i = 0; i < this.map.sectors.length; i++) {
        this.drawSector(this.map.sectors[i]);
    }

    if (isA(this.currentAction, AddSectorEditorAction)) {
        var gridMouse = vec3clone(this.mouseWorld);

        if (this.gridVisible) {
            gridMouse[0] = Math.round(gridMouse[0] / this.gridSize) * this.gridSize;
            gridMouse[1] = Math.round(gridMouse[1] / this.gridSize) * this.gridSize;
        }

        this.drawHandle(gridMouse[0], gridMouse[1], EDITOR_CONSTANTS.colorSelectionPrimary);
    }
    else if (isA(this.currentAction, ScissorEditorAction) || isA(this.currentAction, SplitEditorAction)) {
        var gridMouseDown = this.mouseDownWorld ? vec3clone(this.mouseDownWorld) : null;
        var gridMouse = vec3clone(this.mouseWorld);

        if (this.gridVisible) {
            if (gridMouseDown) {
                gridMouseDown[0] = Math.round(gridMouseDown[0] / this.gridSize) * this.gridSize;
                gridMouseDown[1] = Math.round(gridMouseDown[1] / this.gridSize) * this.gridSize;
            }
            gridMouse[0] = Math.round(gridMouse[0] / this.gridSize) * this.gridSize;
            gridMouse[1] = Math.round(gridMouse[1] / this.gridSize) * this.gridSize;
        }

        if (gridMouseDown) {
            this.context.strokeStyle = EDITOR_CONSTANTS.colorSelectionPrimary;
            this.context.beginPath();
            this.context.moveTo(gridMouseDown[0], gridMouseDown[1]);
            this.context.lineTo(gridMouse[0], gridMouse[1]);
            this.context.stroke();

            this.drawHandle(gridMouseDown[0], gridMouseDown[1], EDITOR_CONSTANTS.colorSelectionPrimary);
        }

        this.drawHandle(gridMouse[0], gridMouse[1], EDITOR_CONSTANTS.colorSelectionPrimary);
    }
    else if (isA(this.currentAction, SelectEditorAction)) {
        var v1 = this.mouseDownWorld;
        var v2 = this.mouseWorld;

        this.context.globalAlpha = 0.3;
        this.context.fillStyle = '#33F';
        this.context.fillRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
        this.context.strokeStyle = '#AAF';
        this.context.strokeRect(v1[0], v1[1], v2[0] - v1[0], v2[1] - v1[1]);
        this.context.globalAlpha = 1;
    }
};

Editor.prototype.setCursor = function (cursor) {
    if (cursor)
        $('#' + this.canvasId).css('cursor', cursor);
    else
        $('#' + this.canvasId).css('cursor', 'auto');
};

Editor.prototype.gamePick = function(picked) {
    for(var i = 0; i < picked.length; i++) {
        if(picked[i].type == 'hi' || picked[i].type == 'lo' || picked[i].type == 'mid') {
            this.selectObject([ picked[i].segment ]);
        }
        else if(picked[i].type == 'floor' || picked[i].type == 'ceiling') {
            this.selectObject([ picked[i].sector ]);
        }
        else
            this.selectObject([ picked[i].entity ]);
    }
};