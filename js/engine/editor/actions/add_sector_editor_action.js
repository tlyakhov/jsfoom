inherit(EditorAction, AddSectorEditorAction);

function AddSectorEditorAction(editor) {
    this.editor = editor;
    this.sector = null;
}

classes['AddSectorEditorAction'] = AddSectorEditorAction;

AddSectorEditorAction.prototype.act = function (newSector) {
    this.editor.editState = 'addSector';
    this.editor.setCursor('crosshair');
    this.sector = newSector;
    this.editor.selectObject([ newSector ]);
};

AddSectorEditorAction.prototype.cancel = function () {
    this.removeFromMap();
    this.editor.selectObject();
    EditorAction.prototype.cancel.call(this);
};


AddSectorEditorAction.prototype.removeFromMap = function () {
    var index = $.inArray(this.sector, this.editor.map.sectors);

    if (index >= 0)
        this.editor.map.sectors.splice(index, 1);

    this.editor.map.autoPortal();
};

AddSectorEditorAction.prototype.addToMap = function () {
    this.sector.map = this.editor.map;
    if ($.inArray(this.sector, this.editor.map.sectors) == -1)
        this.editor.map.sectors.push(this.sector);
    this.sector.update();
    this.editor.map.autoPortal([this.sector]);
};

AddSectorEditorAction.prototype.onMouseDown = function (e) {
    this.editor.editState = 'addSectorSegment';

    var segment = new MapSegment({
        ax: this.editor.mouseDownWorld[0],
        ay: this.editor.mouseDownWorld[1]
    });

    if (this.editor.gridVisible) {
        segment.ax = Math.round(segment.ax / this.editor.gridSize) * this.editor.gridSize;
        segment.ay = Math.round(segment.ay / this.editor.gridSize) * this.editor.gridSize;
    }

    this.sector.segments.push(segment);
    this.addToMap();
};

AddSectorEditorAction.prototype.onMouseMove = function (e) {
    if (this.editor.editState == 'addSectorSegment') {
        var segment = this.sector.segments[this.sector.segments.length - 1];

        segment.ax = this.editor.mouseWorld[0];
        segment.ay = this.editor.mouseWorld[1];

        if (this.editor.gridVisible) {
            segment.ax = Math.round(segment.ax / this.editor.gridSize) * this.editor.gridSize;
            segment.ay = Math.round(segment.ay / this.editor.gridSize) * this.editor.gridSize;
        }
        this.sector.update();
    }
};
AddSectorEditorAction.prototype.onMouseUp = function (e) {
    if (e.button == 0) {
        this.editor.editState = 'addSector';

        if (this.sector.segments.length > 1) {
            var lastSegment = this.sector.segments[this.sector.segments.length - 1];
            var firstSegment = this.sector.segments[0];

            if (Math.abs(firstSegment.ax - lastSegment.ax) < EDITOR_CONSTANTS.segmentSelectionEpsilon &&
                Math.abs(firstSegment.ay - lastSegment.ay) < EDITOR_CONSTANTS.segmentSelectionEpsilon) {
                this.sector.segments.splice(this.sector.segments.length - 1, 1); // Remove last segment
                this.editor.map.autoPortal([ this.sector]);
                this.editor.actionFinished();
            }
        }

    }
    else if (e.button == 2) {
        this.editor.map.autoPortal([ this.sector ]);
        this.editor.actionFinished();
    }
};

AddSectorEditorAction.prototype.undo = function () {
    this.removeFromMap();
};
AddSectorEditorAction.prototype.redo = function () {
    this.addToMap();
};

