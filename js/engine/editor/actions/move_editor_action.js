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

    editor.setCursor('move');
    editor.editState = 'movingStart';
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

MoveEditorAction.prototype.move = function (toOriginal) {
    var editor = this.editor;
    var dx = toOriginal ? 0 : this.dx;
    var dy = toOriginal ? 0 : this.dy;

    /*    if (editor.gridVisible) {
     dx = Math.round(dx / editor.gridSize) * editor.gridSize;
     dy = Math.round(dy / editor.gridSize) * editor.gridSize;
     }*/

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];
        var op = this.originalPositions[object.constructor.name + '|' + object.id];
        if (isA(object, MapPoint)) {
            object.segment.ax = op[0] + dx;
            object.segment.ay = op[1] + dy;
            if (editor.gridVisible) {
                object.segment.ax = Math.round(object.segment.ax / editor.gridSize) * editor.gridSize;
                object.segment.ay = Math.round(object.segment.ay / editor.gridSize) * editor.gridSize;
            }
            object.segment.sector.update();
        }
        else if (isA(object, Entity)) {
            if (isA(object, Player) && editor.centerOnPlayer)
                continue; // Otherwise weird things happen.

            object.pos[0] = op[0] + dx;
            object.pos[1] = op[1] + dy;
            if (editor.gridVisible) {
                object.pos[0] = Math.round(object.pos[0] / editor.gridSize) * editor.gridSize;
                object.pos[1] = Math.round(object.pos[1] / editor.gridSize) * editor.gridSize;
            }
            object.collide();
        }
    }
};

MoveEditorAction.prototype.onMouseMove = function (e) {
    var editor = this.editor;

    editor.editState = 'moving';

    this.dx = editor.mouseWorld[0] - editor.mouseDownWorld[0];
    this.dy = editor.mouseWorld[1] - editor.mouseDownWorld[1];
    this.move(false);
};

MoveEditorAction.prototype.onMouseUp = function (e) {
    var editor = this.editor;

    editor.selectObject(editor.selectedObjects); // Updates properties.
    this.editor.actionFinished();
};

MoveEditorAction.prototype.undo = function () {
    this.move(true);
};

MoveEditorAction.prototype.redo = function () {
    this.move(false);
};
