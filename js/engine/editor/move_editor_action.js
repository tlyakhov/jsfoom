inherit(EditorAction, MoveEditorAction);

function MoveEditorAction(editor) {
    this.parent.constructor.call(this, editor);
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

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];
        var op = this.originalPositions[object.constructor.name + '|' + object.id];
        if (isA(object, MapSegment)) {
            object.ax = op[0] + dx;
            object.ay = op[1] + dy;
            object.sector.update();
        }
        else if (isA(object, Entity)) {
            object.pos[0] = op[0] + dx;
            object.pos[1] = op[1] + dy;
            object.updateSector();
        }
    }
};

MoveEditorAction.prototype.onMouseMove = function (e) {
    var editor = this.editor;

    if (editor.editState == 'movingStart') {
        editor.editState = 'moving';
    }

    if (editor.editState == 'moving') {
        this.dx = editor.mouseWorld[0] - editor.mouseDownWorld[0];
        this.dy = editor.mouseWorld[1] - editor.mouseDownWorld[1];
        this.move(false);
    }
};

MoveEditorAction.prototype.onMouseUp = function (e) {
    var editor = this.editor;

    if (editor.editState == 'moving') {
        editor.selectObject(editor.selectedObjects); // Updates properties.
    }

    editor.editState = 'idle';
};

MoveEditorAction.prototype.undo = function () {
    this.move(true);
};

MoveEditorAction.prototype.redo = function () {
    this.move(false);
};
