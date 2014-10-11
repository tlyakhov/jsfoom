inherit(Behavior, InteractionBehavior);

function InteractionBehavior(options) {
    Behavior.call(this, options);

    this.entityClasses = [ 'Player' ];
    this.minDistance = GAME_CONSTANTS.interactionDistance;

    $.extend(true, this, options);
}

classes['InteractionBehavior'] = InteractionBehavior;

InteractionBehavior.editorHidden = true;
InteractionBehavior.editableProperties = Behavior.editableProperties.concat([
    { name: 'entityClasses', friendly: 'Entity Classes', type: 'tags' },
    { name: 'minDistance', friendly: 'Minimum Distance', type: 'float' }
]);


InteractionBehavior.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    var entity = this.entity;
    
    for(var sid in entity.sector.pvs) {
        var sector = entity.sector.pvs[sid];

        for (var i = 0; i < sector.entities.length; i++) {
            var target = sector.entities[i];

            var valid = false;
            var j = this.entityClasses.length;
            while(j--) {
                if(isA(target, classes[this.entityClasses[j]])) {
                    valid = true;
                    break;
                }
            }

            if(!valid)
                continue;
            if (this.minDistance && vec3dist2(entity.pos, target.pos) > sqr(this.minDistance))
                continue;
            
            this.interact(lastFrameTime, target);
        }
    }

};

InteractionBehavior.prototype.interact = function (lastFrameTime, target) {

};

InteractionBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.entityClasses = this.entityClasses;
    r.minDistance = this.minDistance;

    return r;
};

InteractionBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.entityClasses = data.entityClasses;
    behavior.minDistance = data.minDistance;

    return behavior;
};