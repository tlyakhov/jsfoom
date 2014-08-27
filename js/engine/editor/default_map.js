var globalDefaultMap = new Map({
    spawnX: 0,
    spawnY: 0,
    materials: [
        new Material({ id: 'Default', textureSrc: 'data/WDef.png' })
    ],
    sectors: [
        new MapSector({ id: 'Starting Sector', bottomZ: 0, topZ: 64,
            floorMaterialId: 'Default',
            ceilMaterialId: 'Default',
            entities: [
                new LightEntity({ pos: vec3create(50, 50, 32) })
            ],
            segments: [
                new MapSegment({ ax: -100, ay: -100,
                    midMaterialId: 'Default',
                    loMaterialId: 'Default', hiMaterialId: 'Default' }),
                new MapSegment({ ax: 100, ay: -100,
                    midMaterialId: 'Default',
                    loMaterialId: 'Default', hiMaterialId: 'Default' }),
                new MapSegment({ ax: 100, ay: 100,
                    midMaterialId: 'Default',
                    loMaterialId: 'Default', hiMaterialId: 'Default' }),
                new MapSegment({ ax: -100, ay: 100,
                    midMaterialId: 'Default',
                    loMaterialId: 'Default', hiMaterialId: 'Default' }) ] })

    ] }).serialize();