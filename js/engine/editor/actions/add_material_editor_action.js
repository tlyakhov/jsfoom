'use strict';

inherit(EditorAction, AddMaterialEditorAction);

function AddMaterialEditorAction(editor) {
    EditorAction.call(this, editor);

    this.material = null;
    this.previousSelection = null;
}

classes['AddMaterialEditorAction'] = AddMaterialEditorAction;

AddMaterialEditorAction.prototype.act = function (options) {
    this.material = new Material(options);
    this.previousSelection = this.editor.selectedObjects.slice(0);
    this.editor.map.materials.push(this.material);
    this.editor.selectObject([ this.material ]);
    this.editor.actionFinished();
};

AddMaterialEditorAction.prototype.undo = function () {
    for(var i = 0; i < this.editor.map.materials.length; i++) {
        if(this.editor.map.materials[i] == this.material) {
            this.editor.map.materials.splice(i, 1);
        }
    }
    this.editor.selectObject(this.previousSelection);
};
AddMaterialEditorAction.prototype.redo = function () {
    this.editor.map.materials.push(this.material);
    this.editor.selectObject([ this.material ]);
};

