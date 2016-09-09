'use strict';

function EditorAction(editor) {
    this.editor = editor;

    this.oldMap = null;
    this.newMap = null;
}

classes['EditorAction'] = EditorAction;

EditorAction.prototype.act = function () {
};

EditorAction.prototype.cancel = function () {
    this.editor.undoHistory.pop(); // Remove current action
    this.editor.actionFinished();
};

EditorAction.prototype.onMouseDown = function (e) {
};
EditorAction.prototype.onMouseMove = function (e) {
};
EditorAction.prototype.onMouseUp = function (e) {
};

EditorAction.prototype.frame = function () {
};
EditorAction.prototype.undo = function () {
    if(this.oldMap)
        this.editor.map = Map.deserialize(this.oldMap, this.editor.map);
};
EditorAction.prototype.redo = function () {
    if(this.newMap)
        this.editor.map = Map.deserialize(this.newMap, this.editor.map);
};

