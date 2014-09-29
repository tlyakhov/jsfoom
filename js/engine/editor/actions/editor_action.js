function EditorAction(editor) {
    this.editor = editor;
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
};
EditorAction.prototype.redo = function () {
};

