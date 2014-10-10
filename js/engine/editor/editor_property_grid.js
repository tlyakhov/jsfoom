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
        else if(row.type == 'bool') {
            set = set == 'true';
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

Editor.prototype.renderPropertyValue = function (data, type, row, meta) {
    var isArray = typeof2(row.value) === '[object Array]';
    var isEnum = typeof2(row.type) === '[object Array]';

    var result = '';
    var values = isArray ? row.value : [ row.value ];

    if(row.type == 'serializable') {
        return stringSerialize(values[0]);
    }
    else if(row.type == 'array') {
        return "<div class='btn-group btn-group-xs'>" +
            "    <button type='button' class='btn btn-default'>Add</button>" +
            "    <button type='button' class='btn btn-default'>Clear</button>" +
            "</div>";
    }
    else if (row.type == 'arrayElement') {
        return "<div class='btn-group btn-group-xs'>" +
            "    <button type='button' class='btn btn-default'>Up</button>" +
            "    <button type='button' class='btn btn-default'>Down</button>" +
            "    <button type='button' class='btn btn-default'>Delete</button>" +
            "</div>";
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
            rowData.type == 'array')
            return;

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
                else if(rowData.type == 'bool') {
                    return cellData == 'true';
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
                else if(rowData.type == 'bool')
                {
                    result.push({ 'true' : rowData.friendly });
                }

                return result;
            },
            select2: {
                formatResult: $.proxy(editor.propertySelectFormatter, editor),
                formatSelection: $.proxy(editor.propertySelectFormatter, editor),
                width: '300px'
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
                    name: prop.name + '[' + j + ']',
                    value: '',
                    type: 'arrayElement',
                    parent: thisParent,
                    depth: depth + 1,
                    objects: [ array[j] ] });
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