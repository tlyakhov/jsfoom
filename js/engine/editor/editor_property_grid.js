Editor.prototype.renderPropertyName = function (row, type, set, meta) {
    if (type == 'sort') {
        if (row.name == 'id')
            return '!!' + row.friendly;
        else if (row.type == 'type')
            return '!!!' + row.friendly;
        else if (row.type == 'material_id')
            return '!' + row.friendly;
        else
            return row.friendly;
    }

    return row.friendly;
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
        sp.act(row.name, set);
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

    return result;
};

var EDITOR_PROPERTY_TYPE_MAP = {
    bool: 'text',
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

        if (rowData.name.length == 0 || rowData.name == 'type' || cell.index().column == 0)
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
            dt.row.add({ friendly: 'Type', name: 'type', value: key, type: 'type' });
        }

        type = selectedObject.constructor;
    }

    if (Object.keys(uniqueTypes).length > 1) {
        dt.row.add({ name: '', friendly: '', value: 'Selected objects have multiple types', type: 'string' });
        dt.rows().invalidate().draw();
        return;
    }

    var properties = type.editableProperties;

    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        var all = [];
        for (var j = 0; j < this.selectedObjects.length; j++) {
            if (isA(this.selectedObjects[j], MapPoint)) // Ignore points, they have no properties
                continue;

            all.push(this.selectedObjects[j][prop.name]);
        }
        dt.row.add({ name: prop.name, friendly: prop.friendly, value: all, type: prop.type });
    }

    dt.rows().invalidate().draw();

    for (var i = 0; i < sectors.length; i++) {
        this.addPropertyGridExtraSector(sectors[i]);
    }
};