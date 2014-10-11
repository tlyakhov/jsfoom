inherit(EditorAction, ScissorEditorAction);

function ScissorEditorAction(editor) {
    EditorAction.call(this, editor);
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
    var editor = this.editor;

    this.oldMap = editor.map.serialize();

    var mouseDownWorld = vec3clone(editor.mouseDownWorld);
    var mouseWorld = vec3clone(editor.mouseWorld);
    if (editor.gridVisible) {
        mouseDownWorld[0] = Math.round(mouseDownWorld[0] / editor.gridSize) * editor.gridSize;
        mouseDownWorld[1] = Math.round(mouseDownWorld[1] / editor.gridSize) * editor.gridSize;
        mouseWorld[0] = Math.round(mouseWorld[0] / editor.gridSize) * editor.gridSize;
        mouseWorld[1] = Math.round(mouseWorld[1] / editor.gridSize) * editor.gridSize;
    }

    for (var i = 0; i < editor.map.sectors.length; i++) {
        var sector = editor.map.sectors[i];

        var slicedSectors = sector.slice(mouseDownWorld[0], mouseDownWorld[1], mouseWorld[0], mouseWorld[1]);

        if (slicedSectors.length == 0 || (slicedSectors.length == 1 && slicedSectors[0] == sector))
            continue;

        editor.map.sectors.splice(i, 1);

        for (var j = 0; j < slicedSectors.length; j++) {
            editor.map.sectors.splice(i, 0, slicedSectors[j]);
        }

        i += slicedSectors.length - 1;
    }
    editor.map.autoPortal();
    editor.map.player.sector = null;
    editor.map.player.collide();
    this.newMap = editor.map.serialize();
    editor.actionFinished();
};

