Editor.prototype.renderPropertyName = function (row, type, set, meta) {
    if (type == 'sort') {
        var depth = padNumber(row.depth, 2);
        var index = 4;
        if (row.name == 'id')
            index = 1;
        else if (row.type == 'type')
            index = 0;
        else if (row.type == 'material_id')
            index = 2;

        return row.friendly;
    }

    return "<span style='padding-left:" + row.depth * 10 + "px'></span>" + row.friendly;
};

Editor.prototype.dataPropertyValue = function (row, type, set, meta) {
    if (type == 'set') {
        if (row.type == 'float') {
            set = parseFloat(set);
        }
        else if (row.type == 'vector') {
            var split = set.split(',')
            set = vec3create(parseFloat(split[0]), parseFloat(split[1]), parseFloat(split[2]));
        }

        row.value = set;

        var sp = this.newAction(SetPropertyEditorAction);
        sp.act(row.objects, row.name, set);
    }

    return row.value;
};

Editor.prototype.renderMaterial = function (m) {
    if (!m) {
        return '<i>[empty]</i>';
    }

    var material = this.map.getMaterial(m);

    if (!material) {
        return 'ERROR - ' + m;
    }

    return "<img src=\"" + material.textureSrc + "\" class=\"editor-property-image\" /><b>" + material.id + "</b>";
};

Editor.prototype.onPropGridArrayAdd = function(evt) {
    var selectedClass = $(evt.target).text();
    var dt = $('#' + this.propEditorId).DataTable();
    var cell = dt.cell($(evt.target).parent().parent().parent().parent());
    var rowData = dt.row(cell.index().row).data();
    var object = rowData.objects[0];

    var props = object.constructor.editableProperties;
    var prop = null;

    for(var i = 0; i < props.length; i++) {
        if(props[i].name == rowData.name) {
            prop = props[i];
            break;
        }
    }

    var newObject = createFromName(selectedClass);
    if(prop.parentReference)
        newObject[prop.parentReference] = object;
    if(newObject.map != undefined && newObject.map)
        newObject.map = this.map;

    var newArray = object[rowData.name].slice(0);
    newArray.push(newObject);

    var ap = this.newAction(ArrayPropertyEditorAction);
    ap.act(object, rowData.name, newArray);
};

Editor.prototype.onPropGridArrayClear = function(evt) {
    var dt = $('#' + this.propEditorId).DataTable();
    var cell = dt.cell($(evt.currentTarget).parent().parent());
    var rowData = dt.row(cell.index().row).data();
    var object = rowData.objects[0];

    var ap = this.newAction(ArrayPropertyEditorAction);
    ap.act(object, rowData.name, []);
};

Editor.prototype.onPropGridArrayUp = function(evt) {
    var dt = $('#' + this.propEditorId).DataTable();
    var cell = dt.cell($(evt.currentTarget).parent().parent());
    var rowData = dt.row(cell.index().row).data();
    var object = rowData.objects[0];
    var array = rowData.objects[1];
    var parent = rowData.objects[2];

    var newArray = array.slice(0);
    newArray.splice(rowData.index, 1);
    newArray.splice(rowData.index - 1, 0, object);

    var ap = this.newAction(ArrayPropertyEditorAction);
    ap.act(parent, rowData.name, newArray);
};

Editor.prototype.onPropGridArrayDown = function(evt) {
    var dt = $('#' + this.propEditorId).DataTable();
    var cell = dt.cell($(evt.currentTarget).parent().parent());
    var rowData = dt.row(cell.index().row).data();
    var object = rowData.objects[0];
    var array = rowData.objects[1];
    var parent = rowData.objects[2];

    var newArray = array.slice(0);
    newArray.splice(rowData.index, 1);
    newArray.splice(rowData.index + 1, 0, object);

    var ap = this.newAction(ArrayPropertyEditorAction);
    ap.act(parent, rowData.name, newArray);
};

Editor.prototype.onPropGridArrayDelete = function(evt) {
    var dt = $('#' + this.propEditorId).DataTable();
    var cell = dt.cell($(evt.currentTarget).parent().parent());
    var rowData = dt.row(cell.index().row).data();
    var array = rowData.objects[1];
    var parent = rowData.objects[2];

    var newArray = array.slice(0);
    newArray.splice(rowData.index, 1);

    var ap = this.newAction(ArrayPropertyEditorAction);
    ap.act(parent, rowData.name, newArray);
};

Editor.prototype.renderPropertyValue = function (data, type, row, meta) {
    var isArray = typeof2(row.value) === '[object Array]';
    var isEnum = typeof2(row.type) === '[object Array]';

    var result = '';
    var values = isArray ? row.value : [ row.value ];

    if(row.type == 'serializable') {
        return stringSerialize(values[0]);
    }
    else if(row.type == 'array') {
        var options = [];

        var object = row.objects[0];
        var props = object.constructor.editableProperties;
        var prop = null;

        for(var i = 0; i < props.length; i++) {
            if(props[i].name == row.name) {
                prop = props[i];
                break;
            }
        }

        var available = subclassesOf(prop.childType).filter(function(s) { return !s.editorHidden; });

        for(var i = 0; i < available.length; i++) {
            options.push("<li><a href='#'>" + available[i].name + "</a></li>");
        }

        return "<div class='btn-group btn-group-xs'>" +
            "    <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'><span class='glyphicon glyphicon-plus'></span></button>" +
            "    <ul class='dropdown-menu prop-grid-array-add' role='menu'>" +
            options.join('') +
            "    </ul>" +
            "    <button type='button' class='btn btn-default prop-grid-array-clear'><span class='glyphicon glyphicon-remove'></span></button>" +
            "</div>";
    }
    else if (row.type == 'arrayElement') {
        var result = "<div class='btn-group btn-group-xs'>";

        if(row.index > 0)
            result += "    <button type='button' class='btn btn-default prop-grid-array-up'><span class='glyphicon glyphicon-chevron-up'></span></button>";
        if(row.index < row.objects[2][row.name].length - 1)
            result += "    <button type='button' class='btn btn-default prop-grid-array-down'><span class='glyphicon glyphicon-chevron-down'></span></button>";

        result += "    <button type='button' class='btn btn-default prop-grid-array-delete'><span class='glyphicon glyphicon-minus'></span></button>";
        result += "</div>";

        return result;
    }

    for (var i = 0; i < values.length; i++) {
        var value = values[i];

        if (result.length > 0)
            result += ', ';

        if (row.type == 'material_id') {
            result += this.renderMaterial(value);
        }
        else if (row.type == 'vector') {
            result += '[<b>' + value[0] + '</b>,<b>' + value[1] + '</b>,<b>' + value[2] + '</b>]';
        }
        else if (row.type == 'bool') {
            result += value ? "<span class='glyphicon glyphicon-ok'></span>" : "<span class='glyphicon glyphicon-ban-circle'></span>";
        }
        else
            result += value;
    }

    if(row.name == 'id')
        result = '<b>' + result + '</b>';
    else if(row.type == 'type')
        result = '<i>' + result + '</i>';

    return result;
};

var EDITOR_PROPERTY_TYPE_MAP = {
    bool: 'checklist',
    float: 'text',
    string: 'text',
    material_id: 'select2',
    tags: 'select2',
    vector: 'text'
};

Editor.prototype.propertySelectFormatter = function (option) {
    var isEnum = typeof2(option.type) === '[object Array]';

    if (isEnum) {
        return option.id;
    }
    else if (option.type == 'material_id') {
        return this.renderMaterial(option.id);
    }

    return option.id;
};

Editor.prototype.propertyRowCallback = function (row, data) {
    var editor = this;
    var map = this.map;
    var dt = $('#' + this.propEditorId).DataTable();

    $(row).find('td').each(function (index, element) {
        element = $(element);
        var cell = dt.cell(element);
        var cellData = cell.data();
        var rowData = dt.row(cell.index().row).data();

        if (rowData.name.length == 0 || rowData.name == 'type' || cell.index().column == 0 ||
            rowData.type == 'array' || rowData.type == 'arrayElement')
            return;

        if(rowData.type == 'bool') {
            element.off('click');
            element.on('click',  function(evt) {
                var tcell = dt.cell(evt.delegateTarget);
                tcell.data(!tcell.data()).draw();
                return true;
            });
            return;
        }
        var isEnum = typeof2(rowData.type) == '[object Array]';

        element.editable({
            success: function (response, value) {
                dt.cell(this).data(value).draw();
            },
            value: function (value, element) {
                var isArray = typeof2(cellData) === '[object Array]';
                if (isArray)
                    cellData = cellData[0];

                if (rowData.type == 'vector') {
                    return cellData[0] + ', ' + cellData[1] + ', ' + cellData[2];
                }

                return cellData;
            },
            display: function (value) {
                var cell = dt.cell(this);
                var cellData = cell.data();
                var rowData = dt.row(cell.index().row).data();

                var isArray = typeof2(cellData) === '[object Array]';
                if (isArray)
                    cellData = cellData[0];

                return cellData;
            },
            source: function () {
                var cell = dt.cell(this);
                var cellData = cell.data();
                var rowData = dt.row(cell.index().row).data();

                var result = [];

                if (isEnum) {
                    for (var i = 0; i < rowData.type.length; i++) {
                        result.push({ type: rowData.type, id: rowData.type[i] });
                    }
                }
                else if (rowData.type == 'material_id') {
                    for (var i = 0; i < map.materials.length; i++) {
                        result.push({
                            type: rowData.type,
                            id: map.materials[i].id
                        });
                    }
                }

                return result;
            },
            select2: {
                formatResult: $.proxy(editor.propertySelectFormatter, editor),
                formatSelection: $.proxy(editor.propertySelectFormatter, editor),
                width: '300px',
                tags: rowData.type == 'tags' ? [ 'tags1', 'tags2' ] : undefined
            },
            mode: 'inline',
            type: isEnum ? 'select2' : EDITOR_PROPERTY_TYPE_MAP[rowData.type],
            event: 'dblclick',
            showbuttons: false,
            onblur: 'submit'
        });
    });
};

Editor.prototype.addPropertyGridExtraSector = function (sector) {
    var jqPropExtras = $('#' + this.propExtrasId);

    var anchor = $('<a></a>').html('Select <b>' + sector.id + '</b><br/>');
    anchor.on('click', $.proxy(function (e) {
        this.selectObject([sector]);
    }, this));
    anchor.appendTo(jqPropExtras);
};

Editor.prototype.propertyGridObject = function(type, dt, objects, parent, depth) {
    var properties = type.editableProperties;

    if(!properties)
        return;

    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        var fullFriendly = parent ? parent + '.' + prop.friendly : prop.friendly;

        if(prop.type == 'array' && objects.length > 1) {
            dt.row.add({ name: prop.name,
                friendly: fullFriendly,
                value: "Can't edit array for multiple objects.",
                type: prop.type,
                parent: parent,
                depth: depth,
                objects: objects });
        }
        else if(prop.type == 'array') {
            dt.row.add({ name: prop.name,
                friendly: fullFriendly,
                value: '',
                type: prop.type,
                parent: parent,
                depth: depth,
                objects: objects });
            var array = objects[0][prop.name];
            for(var j = 0; j < array.length; j++) {
                var thisParent = fullFriendly + '[' + j + ']';
                dt.row.add({ friendly: thisParent,
                    name: prop.name,
                    value: '',
                    type: 'arrayElement',
                    parent: thisParent,
                    depth: depth + 1,
                    objects: [ array[j], array, objects[0] ],
                    index: j });
                dt.row.add({ friendly: thisParent + '.Type',
                    name: 'type',
                    value: array[j].constructor.name,
                    type: 'type',
                    parent: thisParent,
                    depth: depth + 1,
                    objects: objects });
                this.propertyGridObject(array[j].constructor, dt, [ array[j] ], thisParent, depth + 1);
            }
        }
        else {
            var all = [];
            for (var j = 0; j < objects.length; j++) {
                if (isA(objects[j], MapPoint)) // Ignore points, they have no properties
                    continue;

                all.push(objects[j][prop.name]);
            }
            dt.row.add({ name: prop.name,
                friendly: fullFriendly,
                value: all,
                type: prop.type,
                parent: parent,
                depth: depth,
                objects: objects });
        }
    }
};

Editor.prototype.refreshPropertyGrid = function () {
    var jqPropEditor = $('#' + this.propEditorId);
    var jqPropExtras = $('#' + this.propExtrasId);

    jqPropExtras.empty();

    var dt = jqPropEditor.DataTable();
    dt.rows().clear();

    if (this.selectedObjects.length == 0)
        return;

    var uniqueTypes = {};
    var type = null;
    var sectors = [];

    for (var i = 0; i < this.selectedObjects.length; i++) {
        var selectedObject = this.selectedObjects[i];

        if (isA(selectedObject, MapPoint)) // Ignore points, they have no properties
            continue;
        else if (isA(selectedObject, MapSegment)) {
            if ($.inArray(selectedObject.sector, sectors) == -1)
                sectors.push(selectedObject.sector);
        }

        var key = selectedObject.constructor.name;
        if (!uniqueTypes[key]) {
            uniqueTypes[key] = true;
            dt.row.add({ friendly: 'Type', name: 'type', value: key, type: 'type', parent: null, depth: 0 });
        }

        type = selectedObject.constructor;
    }

    if (Object.keys(uniqueTypes).length > 1) {
        dt.row.add({ name: '', friendly: '', value: 'Selected objects have multiple types', type: 'string', parent: null, depth: 0 });
        dt.rows().invalidate().draw();
        return;
    }

    this.propertyGridObject(type, dt, this.selectedObjects, null, 0);
    dt.rows().invalidate().draw();

    for (var i = 0; i < sectors.length; i++) {
        this.addPropertyGridExtraSector(sectors[i]);
    }
};