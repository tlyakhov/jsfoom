inherit(Behavior, TalkBehavior);

function TalkBehavior(options) {
    Behavior.call(this, options);

    this.actions = [];
    this.onlyOnce = false;
    this.resetWhenPlayerLeaves = false;

    this.currentAction = null;
    this.actionTime = preciseTime();
    this.delay = 0;
    this.state = 'ready';

    $.extend(true, this, options);

    for (var i = 0; i < this.actions.length; i++) {
        this.actions[i].behavior = this;
    }
}

TalkBehavior.editableProperties = Behavior.editableProperties.concat([
    { name: 'onlyOnce', friendly: 'Only once?', type: 'bool' },
    { name: 'resetWhenPlayerLeaves', friendly: 'Reset When Player Leaves?', type: 'bool' },
    { name: 'actions', friendly: 'Actions', type: 'array', childType: 'TalkAction', parentReference: 'behavior' }
]);

classes['TalkBehavior'] = TalkBehavior;

TalkBehavior.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    if (this.actions.length == 0)
        return;

    var entity = this.entity;
    var map = this.entity.map;
    var player = map.player;

    if (vec3dist2(entity.pos, player.pos) <= sqr(GAME_CONSTANTS.talkDistance)) {
        if (this.currentAction == null && this.state != 'done') {
            this.currentAction = 0;
            this.state = 'act';
        }

        if (this.state == 'delay') {
            if (preciseTime() - this.actionTime > this.delay) {
                this.state = 'act';
            }
        }
        else if (this.state == 'act') {
            var ca = this.currentAction;
            this.actions[ca].act();
            this.actionTime = preciseTime();

            if (this.actions[ca].delay > 0) {
                this.state = 'delay';
                this.delay = this.actions[ca].delay;
            }
        }

        if (this.currentAction >= this.actions.length) {
            if (this.onlyOnce)
                this.state = 'done';
            else
                this.currentAction = 0;
        }
    }
    else if(this.resetWhenPlayerLeaves) {
        this.currentAction = null;
    }
};

TalkBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.onlyOnce = this.onlyOnce;
    r.resetWhenPlayerLeaves = this.resetWhenPlayerLeaves;

    r.actions = [];
    for (var i = 0; i < this.actions.length; i++) {
        r.actions.push(this.actions[i].serialize());
    }

    return r;
};

TalkBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.onlyOnce = data.onlyOnce;
    behavior.resetWhenPlayerLeaves = data.resetWhenPlayerLeaves;

    for (var i = 0; i < data.actions.length; i++) {
        if (i >= behavior.actions.length)
            behavior.actions.push(classes[data.actions[i]._type].deserialize(data.actions[i], behavior));
        else
            classes[data.actions[i]._type].deserialize(data.actions[i], behavior, behavior.actions[i]);
    }

    return behavior;
};