function ObjectCache(size, constr) {
    this.size = size;
    this.cache = Array();
    this.index = 0;

    for (var i = 0; i < size; i++) {
        this.cache.push(constr());
    }
}

ObjectCache.prototype.get = function () {
    var r = this.cache[this.index];

    this.index++;
    if (this.index >= this.size)
        this.index = 0;

    return r;
};