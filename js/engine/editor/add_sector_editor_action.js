inherit(EditorAction, AddSectorEditorAction);

function AddSectorEditorAction(editor) {
    this.editor = editor;
    this.sector = null;
}

AddSectorEditorAction.prototype.act = function (newSector) {
    this.editor.editState = 'addSector';
    this.sector = newSector;
};

AddSectorEditorAction.prototype.removeFromMap = function () {
    var index = $.inArray(this.sector, this.editor.map.sectors);

    if (index >= 0)
        this.editor.map.sectors.splice(index, 1);
};

AddSectorEditorAction.prototype.addToMap = function () {
    this.sector.map = this.editor.map;
    if ($.inArray(this.sector, this.editor.map.sectors) == -1)
        this.editor.map.sectors.push(this.sector);
    this.sector.update();
};

AddSectorEditorAction.prototype.onMouseDown = function (e) {
    var segment = new MapSegment({
        ax: this.editor.mouseDownWorld[0],
        ay: this.editor.mouseDownWorld[1]
    });

    this.sector.segments.push(segment);
    this.addToMap();
};

AddSectorEditorAction.prototype.onMouseMove = function (e) {
};
AddSectorEditorAction.prototype.onMouseUp = function (e) {
    if (e.button == 2) {
        this.editor.editState = 'idle';
        this.editor.currentAction = null;
    }
};

AddSectorEditorAction.prototype.undo = function () {
    this.removeFromMap();
};
AddSectorEditorAction.prototype.redo = function () {
    this.addToMap();
};

