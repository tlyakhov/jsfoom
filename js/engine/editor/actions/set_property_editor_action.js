inherit(EditorAction, SetPropertyEditorAction);

function SetPropertyEditorAction(editor) {
    EditorAction.call(this, editor);

    this.selectedObjects = [];
    this.property = null;
    this.value = null;
    this.originalValues = [];
}

classes['SetPropertyEditorAction'] = SetPropertyEditorAction;

SetPropertyEditorAction.prototype.act = function (property, value) {
    this.selectedObjects = this.editor.selectedObjects;
    this.property = property;
    this.value = value;

    for (var i = 0; i < this.selectedObjects.length; i++) {
        this.originalValues.push(this.selectedObjects[i][property]);
        this.selectedObjects[i][property] = value;
    }
    this.editor.actionFinished();
};

SetPropertyEditorAction.prototype.undo = function () {
    for (var i = 0; i < this.selectedObjects.length; i++) {
        this.selectedObjects[i][this.property] = this.originalValues[i];
    }
    this.editor.refreshPropertyGrid();
};
SetPropertyEditorAction.prototype.redo = function () {
    for (var i = 0; i < this.selectedObjects.length; i++) {
        this.selectedObjects[i][this.property] = this.value;
    }
    this.editor.refreshPropertyGrid();
};

