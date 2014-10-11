inherit(EditorAction, MoveEditorAction);

function MoveEditorAction(editor) {
    EditorAction.call(this, editor);

    this.originalPositions = {};
    this.selectedObjects = [];
    this.dx = 0;
    this.dy = 0;
}

classes['MoveEditorAction'] = MoveEditorAction;

MoveEditorAction.prototype.onMouseDown = function (e) {
    var editor = this.editor;

    this.oldMap = editor.map.serialize();

    editor.setCursor('move');
    this.selectedObjects = editor.selectedObjects.slice(0);

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];
        var op = null;

        if (isA(object, MapPoint)) {
            op = vec3create(object.segment.ax, object.segment.ay, 0);
        }
        else if (isA(object, Entity)) {
            op = vec3clone(object.pos);
        }

        this.originalPositions[object.constructor.name + '|' + object.id] = op;
    }
};

MoveEditorAction.prototype.onMouseMove = function (e) {
    var editor = this.editor;

    this.dx = editor.mouseWorld[0] - editor.mouseDownWorld[0];
    this.dy = editor.mouseWorld[1] - editor.mouseDownWorld[1];

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];
        var op = this.originalPositions[object.constructor.name + '|' + object.id];
        if (isA(object, MapPoint)) {
            object.segment.ax = op[0] + this.dx;
            object.segment.ay = op[1] + this.dy;
            if (editor.gridVisible) {
                object.segment.ax = Math.round(object.segment.ax / editor.gridSize) * editor.gridSize;
                object.segment.ay = Math.round(object.segment.ay / editor.gridSize) * editor.gridSize;
            }
            object.segment.sector.update();
        }
        else if (isA(object, Entity)) {
            if (isA(object, Player) && editor.centerOnPlayer)
                continue; // Otherwise weird things happen.

            object.pos[0] = op[0] + this.dx;
            object.pos[1] = op[1] + this.dy;
            if (editor.gridVisible) {
                object.pos[0] = Math.round(object.pos[0] / editor.gridSize) * editor.gridSize;
                object.pos[1] = Math.round(object.pos[1] / editor.gridSize) * editor.gridSize;
            }
            object.collide();
            if(isA(object, Entity) && object.getBehavior(LightBehavior))
                this.editor.map.clearLightmaps();

        }
    }
};

MoveEditorAction.prototype.onMouseUp = function (e) {
    var editor = this.editor;

    editor.selectObject(editor.selectedObjects); // Updates properties.
    this.newMap = editor.map.serialize();
    this.editor.actionFinished();
};