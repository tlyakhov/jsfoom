'use strict';

inherit(EditorAction, SplitEditorAction);

function SplitEditorAction(editor) {
    EditorAction.call(this, editor);

    this.newSegments = [];
}

classes['SplitEditorAction'] = SplitEditorAction;

SplitEditorAction.prototype.act = function () {
};

SplitEditorAction.prototype.cancel = function () {
    EditorAction.prototype.cancel.call(this);
};

SplitEditorAction.prototype.onMouseDown = function (e) {
};
SplitEditorAction.prototype.onMouseMove = function (e) {
};
SplitEditorAction.prototype.onMouseUp = function (e) {
    var editor = this.editor;

    this.oldMap = editor.map.serialize();
    this.newSegments = [];
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

        for (var j = 0; j < sector.segments.length; j++) {
            var segment = sector.segments[j];

            var intersection = segment.intersect(md[0], md[1], m[0], m[1]);

            if (!intersection)
                continue;

            var newSegment = segment.clone();
            newSegment.id = new MapSegment().id; // Gotta be unique!
            newSegment.ax = intersection[0];
            newSegment.ay = intersection[1];

            sector.segments.splice(j + 1, 0, newSegment);
            this.newSegments.push(newSegment);
            sector.update();
            j++; // Otherwise, infinite splitting loop!
        }
    }
    editor.actionFinished();
    this.newMap = editor.map.serialize();
};
