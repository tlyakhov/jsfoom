Editor.prototype.renderPropertyName = function (row, type, set, meta) {
    if (type == 'sort') {
        if (row.name == 'id')
            return '!!!' + row.friendly;
        else if (row.type == 'type')
            return '!!' + row.friendly;
        else if (row.type == 'material_id')
            return '!' + row.friendly;
        else
            return row.friendly;
    }

    return row.friendly;
};

Editor.prototype.dataPropertyValue = function (row, type, set, meta) {
    if (type == 'set') {
        if (row.type == 'float')
            set = parseFloat(set);

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
        return 'ERROR - ' + value;
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

Editor.prototype.propertyRowCallback = function (row, data) {
    var editor = this;
    var map = this.map;
    var dt = $('#' + this.propEditorId).DataTable();

    $(row).find('td').each(function (index, element) {
        element = $(element);
        var cell = dt.cell(element);
        var cellData = cell.data();
        var rowData = dt.row(cell.index().row).data();

        element.editable(function (value, settings) {
            dt.cell(this).data(value).draw();
        }, {
            data: function (value, settings) {
                var cell = dt.cell(this);
                var cellData = cell.data();
                var rowData = dt.row(cell.index().row).data();

                var isArray = typeof2(cellData) === '[object Array]';
                if (isArray)
                    cellData = cellData[0];

                if (rowData.type == 'material_id') {
                    var result = {};
                    for (var i = 0; i < map.materials.length; i++) {
                        result[map.materials[i].id] = editor.renderMaterial(map.materials[i].id);
                    }
                    return result;
                }

                return cellData;
            },
            type: rowData.type == 'material_id' ? 'select' : 'text',
            event: 'dblclick',
            onblur: 'submit'
        });
    });
};

Editor.prototype.refreshPropertyGrid = function () {
    var jqPropEditor = $('#' + this.propEditorId);
    var dt = jqPropEditor.DataTable();

    dt.rows().clear();

    if (this.selectedObjects.length == 0)
        return;

    var uniqueTypes = {};

    for (var i = 0; i < this.selectedObjects.length; i++) {
        uniqueTypes[this.selectedObjects[i].constructor.name] = true;
    }

    if (Object.keys(uniqueTypes).length > 1) {
        dt.row.add({ name: '', friendly: '', value: 'Selected objects have multiple types', type: 'string' });
        dt.rows().invalidate().draw();
        return;
    }

    dt.row.add({ friendly: 'Type', name: 'type', value: this.selectedObjects[0].constructor.name, type: 'type' });

    var properties = this.selectedObjects[0].constructor.editableProperties;
    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        var all = [];
        for (var j = 0; j < this.selectedObjects.length; j++) {
            all.push(this.selectedObjects[j][prop.name]);
        }
        dt.row.add({ name: prop.name, friendly: prop.friendly, value: all, type: prop.type });
    }

    dt.rows().invalidate().draw();
};