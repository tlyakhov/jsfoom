'use strict';

inherit(TalkAction, TalkActionGive);

function TalkActionGive(options) {
    TalkAction.call(this, options);

    this.item = null;
    this.delay = 0;

    $.extend(true, this, options);
}

TalkActionGive.create = function(item, id, gotoId) {
    var tag = new TalkActionGive();
    if(item)
        tag.item = item.serialize();
    if(id)
        tag.id = id;
    if(gotoId)
        tag.gotoId = gotoId;

    return tag;
};

TalkActionGive.editableProperties = TalkAction.editableProperties.concat([
    { name: 'item', friendly: 'Inventory Item', type: 'object', childType: 'Entity' }
]);

classes['TalkActionGive'] = TalkActionGive;

TalkActionGive.prototype.act = function () {
    if(!this.item)
        return;

    var realItem = classes[this.item._type].deserialize(this.item, this.behavior.entity.map);

    for(var i = 0; i < realItem.behaviors.length; i++)
    {
        if(isA(realItem.behaviors[i], InventoryItemBehavior))
        {
            realItem.behaviors[i].interact(0, this.behavior.entity.map.player);
            break;
        }
    }

    TalkAction.prototype.act.call(this);
};

TalkActionGive.prototype.serialize = function () {
    var r = TalkAction.prototype.serialize.call(this);

    r.item = this.item;

    return r;
};

TalkActionGive.deserialize = function (data, behavior, action) {
    action = TalkAction.deserialize(data, behavior, action);

    action.item = data.item;

    return action;
};