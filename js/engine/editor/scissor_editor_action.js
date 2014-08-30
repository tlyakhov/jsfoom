inherit(EditorAction, ScissorEditorAction);

function ScissorEditorAction(editor) {
    EditorAction.call(this, editor);

    this.oldSectors = [];
    this.newSectors = [];
    this.oldPortals = {};
}

classes['ScissorEditorAction'] = ScissorEditorAction;

ScissorEditorAction.prototype.act = function () {
};

ScissorEditorAction.prototype.cancel = function () {
    EditorAction.prototype.cancel.call(this);
};

ScissorEditorAction.prototype.onMouseDown = function (e) {
};
ScissorEditorAction.prototype.onMouseMove = function (e) {
};
ScissorEditorAction.prototype.onMouseUp = function (e) {
    this.redo();
    this.editor.actionFinished();
};

ScissorEditorAction.prototype.undo = function () {
    for (var i = 0; i < this.oldSectors.length; i++) {
        var index = $.inArray(this.oldSectors[i], this.editor.map.sectors);

        if (index == -1) {
            this.editor.map.sectors.push(this.oldSectors[i]);
        }
    }
    for (var i = 0; i < this.newSectors.length; i++) {
        var index = $.inArray(this.newSectors[i], this.editor.map.sectors);

        if (index != -1) {
            this.editor.map.sectors.splice(index, 1);
        }
    }
};

ScissorEditorAction.prototype.redo = function () {
    this.oldSectors = [];
    this.oldPortals = {};
    this.newSectors = [];
    var editor = this.editor;
    var md = vec3clone(editor.mouseDownWorld);
    var m = vec3clone(editor.mouseWorld);
    if (editor.gridVisible) {
        md[0] = Math.round(md[0] / editor.gridSize) * editor.gridSize;
        md[1] = Math.round(md[1] / editor.gridSize) * editor.gridSize;
        m[0] = Math.round(m[0] / editor.gridSize) * editor.gridSize;
        m[1] = Math.round(m[1] / editor.gridSize) * editor.gridSize;
    }

    for (var i = 0; i < editor.map.sectors.length; i++) {
        var sector = editor.map.sectors[i];

        var slicedSectors = sector.slice(md[0], md[1], m[0], m[1]);

        if (slicedSectors.length == 0 || (slicedSectors.length == 1 && slicedSectors[0] == sector))
            continue;

        this.oldSectors.push(sector);

        editor.map.sectors.splice(i, 1);

        for (var j = 0; j < slicedSectors.length; j++) {
            editor.map.sectors.splice(i, 0, slicedSectors[j]);
        }

        i += slicedSectors.length - 1;

        for (var j = 0; j < slicedSectors.length; j++)
            this.newSectors.push(slicedSectors[j]);
    }
    editor.map.autoPortal();
    editor.map.player.sector = null;
    editor.map.player.updateSector();
};


