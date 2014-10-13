inherit(InteractionBehavior, AttackBehavior);

function AttackBehavior(options) {
    InteractionBehavior.call(this, options);

    this.minRate = 10; // Per minute
    this.maxRate = 50; // Per minute

    this.minuteAttacks = [];
    this.lastTime = preciseTime();

    $.extend(true, this, options);

    this.generateAttacks();
}

classes['AttackBehavior'] = AttackBehavior;

AttackBehavior.editorHidden = true;
AttackBehavior.editableProperties = InteractionBehavior.editableProperties.concat([
    { name: 'minRate', friendly: 'Minimum Rate', type: 'float' },
    { name: 'maxRate', friendly: 'Maximum Rate', type: 'float' }
]);


AttackBehavior.prototype.generateAttacks = function() {
    this.minuteAttacks = [];

    var count = fast_floor(this.minRate + Math.random() * this.maxRate);

    for(var i = 0; i < count; i++) {
        this.minuteAttacks.push(Math.random() * 60 * 1000);
    }
};

AttackBehavior.prototype.interact = function (lastFrameTime, target) {
    InteractionBehavior.prototype.interact.call(this, lastFrameTime, target);

    if(this.attack(lastFrameTime, target))
        this.stopInteracting();
};

AttackBehavior.prototype.attack = function(lastFrameTime, target) {
    var attacked = false;

    var diff = preciseTime() - this.lastTime;

    for(var i = 0; i < this.minuteAttacks.length; i++) {
        if(diff >= this.minuteAttacks[i]) {
            this.minuteAttacks.splice(i, 1);
            attacked = true;
        }
    }

    if(diff >= 60 * 1000) {
        this.lastTime = preciseTime();
        this.generateAttacks();
    }

    return attacked;
};

AttackBehavior.prototype.serialize = function () {
    var r = InteractionBehavior.prototype.serialize.call(this);

    r.minRate = this.minRate;
    r.maxRate = this.maxRate;

    return r;
};

AttackBehavior.deserialize = function (data, entity, behavior) {
    behavior = InteractionBehavior.deserialize(data, entity, behavior);

    behavior.minRate = data.minRate;
    behavior.maxRate = data.maxRate;

    return behavior;
};