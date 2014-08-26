inherit(EditorAction, PanEditorAction);

function PanEditorAction(editor) {
    EditorAction.call(this, editor);
    this.delta = null;
    this.originalPosition = null;
}

classes['PanEditorAction'] = PanEditorAction;

PanEditorAction.prototype.onMouseDown = function (e) {
    this.editor.editState = 'panStart';
    this.originalPosition = vec3clone(this.editor.pos);
    this.editor.setCursor('all-scroll');
};

PanEditorAction.prototype.onMouseMove = function (e) {
    this.editor.editState = 'panning';
    this.delta = vec3sub(this.editor.mouse, this.editor.mouseDown, vec3blank());

    this.editor.pos[0] = this.originalPosition[0] - this.delta[0];
    this.editor.pos[1] = this.originalPosition[1] - this.delta[1];
};

PanEditorAction.prototype.onMouseUp = function (e) {
    this.editor.actionFinished();
};

PanEditorAction.prototype.undo = function () {
    this.editor.pos = vec3clone(this.originalPosition);
};
PanEditorAction.prototype.redo = function () {
    this.editor.pos[0] = this.originalPosition[0] - this.delta[0];
    this.editor.pos[1] = this.originalPosition[1] - this.delta[1];
};

