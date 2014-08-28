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
    this.redo();
    this.editor.actionFinished();
};

SplitEditorAction.prototype.undo = function () {
    for (var i = 0; i < this.newSegments.length; i++) {
        var sector = this.newSegments[i].sector;
        var index = $.inArray(this.newSegments[i], sector.segments);

        if (index != -1) {
            sector.segments.splice(index, 1);
        }
    }
};

SplitEditorAction.prototype.redo = function () {
    this.newSegments = [];
    var editor = this.editor;
    for (var i = 0; i < editor.map.sectors.length; i++) {
        var sector = editor.map.sectors[i];

        for (var j = 0; j < sector.segments.length; j++) {
            var segment = sector.segments[j];

            var intersection = segment.intersect(editor.mouseDownWorld[0], editor.mouseDownWorld[1],
                editor.mouseWorld[0], editor.mouseWorld[1]);

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
};

