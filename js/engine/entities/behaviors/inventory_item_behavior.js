inherit(InteractionBehavior, InventoryItemBehavior);

function InventoryItemBehavior(options) {
    InteractionBehavior.call(this, options);

    this.minDistance = GAME_CONSTANTS.inventoryGatherDistance;
    this.name = 'Inventory Item';
    this.count = 1;
    this.mustBeFacing = false;
    this.givenTo = null;

    $.extend(true, this, options);
}

classes['InventoryItemBehavior'] = InventoryItemBehavior;

InventoryItemBehavior.editableProperties = InteractionBehavior.editableProperties.concat([
    { name: 'name', friendly: 'Name', type: 'string' },
    { name: 'count', friendly: 'Count', type: 'float' }
]);

InventoryItemBehavior.prototype.reset = function () {
    InteractionBehavior.prototype.reset.call(this);

    var map = this.entity.map;

    if(this.givenTo) {
        var index = $.inArray(this.entity, this.givenTo.inventory);

        if (index >= 0) {
            this.givenTo.inventory.splice(index, 1);
        }
    }

    if(this.entity.getBehavior(LightBehavior))
        map.clearLightmaps();
};


InventoryItemBehavior.prototype.interact = function(lastFrameTime, target) {
    InteractionBehavior.prototype.interact.call(this, lastFrameTime, target);

    var entity = this.entity;
    var map = this.entity.map;

    target.inventory.push(this);
    this.givenTo = target;

    if(isA(target, Player))
        globalGame.gameTextQueue.push({ text: 'Got ' + this.count + ' ' + this.name + '!', fillStyle: GAME_CONSTANTS.inventoryGatherTextStyle });

    entity.active = false;
    entity.visible = false;

    if(entity.getBehavior(LightBehavior))
        map.clearLightmaps();
};

InventoryItemBehavior.prototype.serialize = function () {
    var r = InteractionBehavior.prototype.serialize.call(this);

    r.name = this.name;
    r.count = this.count;

    return r;
};

InventoryItemBehavior.deserialize = function (data, entity, behavior) {
    behavior = InteractionBehavior.deserialize(data, entity, behavior);

    behavior.name = data.name;
    behavior.count = data.count;

    return behavior;
};