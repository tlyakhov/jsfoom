'use strict';

inherit(EditorAction, AddEntityEditorAction);

function AddEntityEditorAction(editor) {
    this.editor = editor;
    this.entity = null;
    this.sector = null;
}

classes['AddEntityEditorAction'] = AddEntityEditorAction;

AddEntityEditorAction.prototype.act = function (newEntity) {
    this.editor.editState = 'addEntity';
    this.entity = newEntity;
    this.editor.selectObject([newEntity]);
};

AddEntityEditorAction.prototype.cancel = function () {
    this.removeFromMap();
    this.editor.selectObject();
    EditorAction.prototype.cancel.call(this);
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
    this.editor.map.clearLightmaps();
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

        if (this.editor.gridVisible) {
            this.entity.pos[0] = Math.round(this.entity.pos[0] / this.editor.gridSize) * this.editor.gridSize;
            this.entity.pos[1] = Math.round(this.entity.pos[1] / this.editor.gridSize) * this.editor.gridSize;
        }
    }
};
AddEntityEditorAction.prototype.onMouseUp = function (e) {
    this.editor.actionFinished();
};

AddEntityEditorAction.prototype.undo = function () {
    this.removeFromMap();
};
AddEntityEditorAction.prototype.redo = function () {
    this.addToMap(this.sector);
};

