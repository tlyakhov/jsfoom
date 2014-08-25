inherit(EditorAction, AddEntityEditorAction);

function AddEntityEditorAction(editor) {
    this.editor = editor;
    this.entity = null;
    this.sector = null;
}

AddEntityEditorAction.prototype.act = function (newEntity) {
    this.editor.editState = 'addEntity';
    this.entity = newEntity;
};

AddEntityEditorAction.prototype.removeFromMap = function () {
    if (this.entity.sector) {
        var index = $.inArray(this.entity, this.entity.sector.entities);

        if (index >= 0)
            this.entity.sector.entities.splice(index, 1);
    }
};

AddEntityEditorAction.prototype.addToMap = function (sector) {
    this.entity.sector = sector;
    this.entity.map = this.editor.map;
    sector.entities.push(this.entity);
};

AddEntityEditorAction.prototype.onMouseDown = function (e) {
};

AddEntityEditorAction.prototype.onMouseMove = function (e) {
    var sector = this.editor.findSector();

    if (sector) {
        this.removeFromMap();
        this.addToMap(sector);

        this.sector = sector;
        this.entity.pos = vec3clone(this.editor.mouseWorld);
        this.entity.pos[2] = (sector.topZ + sector.bottomZ) / 2;
    }
};
AddEntityEditorAction.prototype.onMouseUp = function (e) {
    this.editor.editState = 'idle';
    this.editor.currentAction = null;
};

AddEntityEditorAction.prototype.undo = function () {
    this.removeFromMap();
};
AddEntityEditorAction.prototype.redo = function () {
    this.addToMap(this.sector);
};

