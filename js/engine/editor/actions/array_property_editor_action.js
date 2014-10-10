inherit(EditorAction, ArrayPropertyEditorAction);

function ArrayPropertyEditorAction(editor) {
    EditorAction.call(this, editor);

    this.selectedObject = null;
    this.property = null;
    this.value = null;
    this.originalValue = null;
}

classes['ArrayPropertyEditorAction'] = ArrayPropertyEditorAction;

ArrayPropertyEditorAction.prototype.act = function (object, property, value) {
    this.selectedObject = object;
    this.property = property;
    this.value = value;
    this.originalValue = object[property];
    this.redo();

    this.editor.actionFinished();
};

ArrayPropertyEditorAction.prototype.undo = function () {
    this.selectedObject[this.property] = this.originalValue;
    this.editor.refreshPropertyGrid();
};
ArrayPropertyEditorAction.prototype.redo = function () {
    this.selectedObject[this.property] = this.value;
    this.editor.refreshPropertyGrid();
};

