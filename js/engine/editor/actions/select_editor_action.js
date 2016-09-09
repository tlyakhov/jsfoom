'use strict';

inherit(EditorAction, SelectEditorAction);

function SelectEditorAction(editor) {
    EditorAction.call(this, editor);

    this.mode = 'new'; // or 'add' or 'sub'
    this.originalObjects = [];
    this.selectedObjects = [];
}

classes['SelectEditorAction'] = SelectEditorAction;

SelectEditorAction.prototype.onMouseDown = function (e) {
    this.originalObjects = this.editor.selectedObjects.slice(0);

    if (e.shiftKey)
        this.mode = 'add';
    else if (e.altKey)
        this.mode = 'sub';

    this.editor.editState = 'selectionStart';
    this.editor.setCursor('cell');
};

SelectEditorAction.prototype.onMouseMove = function (e) {
    this.editor.editState = 'selecting';
};

SelectEditorAction.prototype.onMouseUp = function (e) {
    var editor = this.editor;

    var objects = editor.hoveringObjects;

    if (objects.length == 0) // User is trying to select a sector?
    {
        objects = [];
        for (var i = 0; i < editor.map.sectors.length; i++) {
            if (editor.map.sectors[i].isPointInside(editor.mouseWorld[0], editor.mouseWorld[1]))
                objects.push(editor.map.sectors[i]);
        }
    }

    if (this.mode == 'add')
        this.selectedObjects = this.originalObjects.concat(objects);
    else if (this.mode == 'sub')
        this.selectedObjects = this.originalObjects.filter(function (i) {
            return objects.indexOf(i) < 0;
        });
    else
        this.selectedObjects = objects.slice(0);

    editor.selectObject(this.selectedObjects);
    editor.actionFinished();
};

SelectEditorAction.prototype.frame = function () {
};

SelectEditorAction.prototype.undo = function () {
    this.editor.selectObject(this.originalObjects);
};

SelectEditorAction.prototype.redo = function () {
    this.editor.selectObject(this.selectedObjects);
};

