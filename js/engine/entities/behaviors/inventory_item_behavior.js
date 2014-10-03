inherit(Behavior, InventoryItemBehavior);

function InventoryItemBehavior(options) {
    Behavior.call(this, options);

    this.name = 'Inventory Item';
    this.count = 1;

    $.extend(true, this, options);
}

classes['InventoryItemBehavior'] = InventoryItemBehavior;

InventoryItemBehavior.editableProperties = Behavior.editableProperties;

InventoryItemBehavior.prototype.reset = function () {
    Behavior.prototype.reset.call(this);

    var map = this.entity.map;
    var player = map.player;

    var index = $.inArray(this.entity, player.inventory);

    if (index >= 0) {
        player.inventory.splice(index, 1);
    }
};

InventoryItemBehavior.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    var entity = this.entity;
    var map = this.entity.map;
    var player = map.player;

    if (vec3dist2(player.pos, entity.pos) > sqr(GAME_CONSTANTS.inventoryGatherDistance))
        return;

    player.inventory.push(this);
    globalGame.gameTextQueue.push({ text: 'Got ' + this.count + ' ' + this.name + '!', fillStyle: GAME_CONSTANTS.inventoryGatherTextStyle });
    entity.active = false;
    entity.visible = false;
};


InventoryItemBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.name = this.name;
    r.count = this.count;

    return r;
};

InventoryItemBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.name = data.name;
    behavior.count = data.count;

    return behavior;
};