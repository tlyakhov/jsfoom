inherit(EditorAction, SetPropertyEditorAction);

function SetPropertyEditorAction(editor) {
    EditorAction.call(this, editor);

    this.selectedObjects = [];
    this.property = null;
    this.value = null;
    this.originalValues = [];
}

classes['SetPropertyEditorAction'] = SetPropertyEditorAction;

SetPropertyEditorAction.prototype.act = function (objects, property, value) {
    this.selectedObjects = objects;
    this.property = property;
    this.value = value;

    for (var i = 0; i < this.selectedObjects.length; i++) {
        this.originalValues.push(this.selectedObjects[i][property]);
        this.selectedObjects[i][property] = value;
        if((isA(this.selectedObjects[i], Entity) && this.selectedObjects[i].getBehavior(LightBehavior)) ||
            isA(this.selectedObjects[i], LightBehavior))
            this.editor.map.clearLightmaps();
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

