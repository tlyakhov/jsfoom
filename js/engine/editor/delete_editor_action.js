inherit(EditorAction, DeleteEditorAction);

function DeleteEditorAction(editor) {
    EditorAction.call(this, editor);

    this.selectedObjects = [];
    this.indexes = [];
}

classes['DeleteEditorAction'] = DeleteEditorAction;

DeleteEditorAction.prototype.act = function () {
    this.selectedObjects = this.editor.selectedObjects.slice(0);

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];

        if (isA(object, Player))
            continue;
        else if (isA(object, MapSegment)) {
            this.indexes[i] = $.inArray(object, object.sector.segments);
        }
        else if (isA(object, Entity)) {
            this.indexes[i] = $.inArray(object, object.sector.entities);
        }
        else if (isA(object, MapSector)) {
            this.indexes[i] = $.inArray(object, this.editor.map.sectors);
        }
    }

    this.redo();
    this.editor.actionFinished();
};

DeleteEditorAction.prototype.cancel = function () {
    EditorAction.prototype.cancel.call(this);
};

DeleteEditorAction.prototype.undo = function () {
    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];

        if (isA(object, Player))
            continue;
        else if (isA(object, MapSegment)) {
            if ($.inArray(object, object.sector.segments) == -1) {
                object.sector.segments.splice(this.indexes[i], 0, object);
            }
            object.sector.update();
        }
        else if (isA(object, Entity)) {
            object.sector = null;
            object.map = this.editor.map;
        }
        else if (isA(object, MapSector)) {
            object.map = this.editor.map;
            if ($.inArray(object, this.editor.map.sectors) == -1)
                this.editor.map.sectors.splice(this.indexes[i], 0, object);
            object.update();
        }
    }
};

DeleteEditorAction.prototype.redo = function () {
    for (var i = 0; i < this.selectedObjects.length; i++) {
        var object = this.selectedObjects[i];

        if (isA(object, Player))
            continue;
        else if (isA(object, MapSegment)) {
            var index = $.inArray(object, object.sector.segments);

            if (index >= 0)
                object.sector.segments.splice(index, 1);

            object.sector.update();
        }
        else if (isA(object, Entity)) {
            if (object.sector) {
                var index = $.inArray(object, object.sector.entities);

                if (index >= 0)
                    object.sector.entities.splice(index, 1);
            }
        }
        else if (isA(object, MapSector)) {
            var index = $.inArray(object, this.editor.map.sectors);

            if (index >= 0)
                this.editor.map.sectors.splice(index, 1);
        }
    }
};

