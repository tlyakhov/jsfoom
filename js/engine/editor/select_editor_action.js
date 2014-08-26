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

    if (this.mode == 'add')
        this.selectedObjects = this.originalObjects.concat(editor.hoveringObjects);
    else if (this.mode == 'sub')
        this.selectedObjects = this.originalObjects.filter(function (i) {
            return editor.hoveringObjects.indexOf(i) < 0;
        });
    else
        this.selectedObjects = editor.hoveringObjects.slice(0);

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

