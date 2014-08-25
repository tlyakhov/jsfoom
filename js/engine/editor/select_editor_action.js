inherit(EditorAction, SelectEditorAction);

function SelectEditorAction(editor) {
    this.parent.constructor.call(this, editor);

    this.editor = editor;
    this.originalObjects = [];
    this.selectedObjects = [];
}

SelectEditorAction.prototype.onMouseDown = function (e) {
    this.originalObjects = this.editor.selectedObjects.slice(0);

    this.editor.editState = 'selectionStart';
};

SelectEditorAction.prototype.onMouseMove = function (e) {
    if (this.editor.editState == 'selectionStart') {
        this.editor.editState = 'selecting';
    }
};

SelectEditorAction.prototype.onMouseUp = function (e) {
    this.selectedObjects = this.editor.hoveringObjects.slice(0);
    this.editor.selectObject(this.editor.hoveringObjects);
    this.editor.editState = 'idle';
};

SelectEditorAction.prototype.frame = function () {
};

SelectEditorAction.prototype.undo = function () {
    this.editor.selectObject(this.originalObjects);
};

SelectEditorAction.prototype.redo = function () {
    this.editor.selectObject(this.selectedObjects);
};

