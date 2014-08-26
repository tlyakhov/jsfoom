inherit(EditorAction, MoveEditorAction);

function MoveEditorAction(editor) {
    EditorAction.call(this, editor);

    this.originalPositions = {};
    this.selectedObjects = [];
    this.dx = 0;
    this.dy = 0;
}

MoveEditorAction.prototype.onMouseDown = function (e) {
    var editor = this.editor;

    editor.editState = 'movingStart';
    this.selectedObjects = editor.selectedObjects.slice(0);

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];
        var op = null;

        if (isA(object, MapSegment)) {
            op = vec3create(object.ax, object.ay, 0);
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

    if (editor.gridVisible) {
        dx = Math.round(dx / editor.gridSize) * editor.gridSize;
        dy = Math.round(dy / editor.gridSize) * editor.gridSize;
    }

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];
        var op = this.originalPositions[object.constructor.name + '|' + object.id];
        if (isA(object, MapSegment)) {
            object.ax = op[0] + dx;
            object.ay = op[1] + dy;
            object.sector.update();
        }
        else if (isA(object, Entity)) {
            if (isA(object, Player) && editor.centerOnPlayer)
                continue; // Otherwise weird things happen.

            object.pos[0] = op[0] + dx;
            object.pos[1] = op[1] + dy;
            object.updateSector();
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
    editor.editState = 'idle';
    this.editor.currentAction = null;
};

MoveEditorAction.prototype.undo = function () {
    this.move(true);
};

MoveEditorAction.prototype.redo = function () {
    this.move(false);
};
