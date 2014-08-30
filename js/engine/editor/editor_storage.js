function EditorStorage() {

}

EditorStorage.prefix = 'foom_edit.';
EditorStorage.prefixLevel = EditorStorage.prefix + 'level.';

EditorStorage.allLevelNames = function () {
    var result = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);

        if (key.indexOf(EditorStorage.prefixLevel) != 0)
            continue;

        var name = key.substring(EditorStorage.prefixLevel.length);

        result.push(name);
    }

    return result;
};

EditorStorage.saveLevel = function (name, map) {
    localStorage.setItem(EditorStorage.prefixLevel + name, map.stringSerialize());
};

EditorStorage.loadLevel = function (name, map) {
    var map = Map.deserialize(JSON.parse(localStorage.getItem(EditorStorage.prefixLevel + name)));

    for (var i = 0; i < map.sectors.length; i++)
        map.sectors[i].update();

    return map;
};