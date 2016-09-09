'use strict';

window.testMonsterSprites = [
    new Sprite({ textureSrc: '/data/test_sprite/Test0012.png', state: 'idle', angle: 0 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0013.png', state: 'idle', angle: 1 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0014.png', state: 'idle', angle: 2 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0015.png', state: 'idle', angle: 3 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0000.png', state: 'idle', angle: 4 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0001.png', state: 'idle', angle: 5 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0002.png', state: 'idle', angle: 6 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0003.png', state: 'idle', angle: 7 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0004.png', state: 'idle', angle: 8 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0005.png', state: 'idle', angle: 9 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0006.png', state: 'idle', angle: 10 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0007.png', state: 'idle', angle: 11 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0008.png', state: 'idle', angle: 12 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0009.png', state: 'idle', angle: 13 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0010.png', state: 'idle', angle: 14 }),
    new Sprite({ textureSrc: '/data/test_sprite/Test0011.png', state: 'idle', angle: 15 })
];

window.testMap = new Map({
    spawnX: 0,
    spawnY: -70,
    materials: [
        new Material({ id: 'Default', textureSrc: 'data/WDef.png' }),
        new Material({ id: 'mat1', textureSrc: 'data/WSlimy.png' }),
        new Material({ id: 'mat2', textureSrc: 'data/WMetal.png' }),
        new Material({ id: 'mat3', textureSrc: 'data/WSlimeGrate.png' }),
        new Material({ id: 'mat6', textureSrc: 'data/WDirty.png' }),
        new Material({ id: 'Doom Garage Door', textureSrc: 'data/DGarage.png' }),

        new Material({ id: 'Default Floor', textureSrc: 'data/FDef.png' }),
        new Material({ id: 'f1', textureSrc: 'data/FGrayTile.png' }),
        new Material({ id: 'Painful Slime', textureSrc: 'data/FSlime.png', isLiquid: true, hurt: 5 }),
        new Material({ id: 'f5', textureSrc: 'data/FRedLight.png' }),
        new Material({ id: 'f6', textureSrc: 'data/FHexMetal.png' }),
        new Material({ id: 'Water', textureSrc: 'data/Water.png', isLiquid: true }),
        new Material({ id: 'Sky', textureSrc: 'data/game/sky.png', renderAsSky: true })
    ],
    sectors: [
        new MapSector({ id: 'sector0', bottomZ: 0, topZ: 64,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Sky',
            segments: [
                new MapSegment({ ax: -100, ay: -100,
                    midMaterialId: 'Sky',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 100, ay: -100,
                    midMaterialId: 'mat2',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 100, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector1',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 30, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector4',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -30, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector2',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -100, ay: -30,
                    midMaterialId: 'mat2',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector1', bottomZ: 0, topZ: 64,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Sky',
            segments: [
                new MapSegment({ ax: 100, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector25',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 100, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector3',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 30, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector4',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 30, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector0',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector2', bottomZ: -10, topZ: 64,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Sky',
            segments: [
                new MapSegment({ ax: -100, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector5',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -100, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector3',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -30, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector4',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -30, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector0',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector3', bottomZ: 0, topZ: 64,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Sky',
            entities: [
                new GameEntityFlub({ pos: vec3create(-17, 68, 0) }),
                new GameEntityPluk({ pos: vec3create(45, 68, 0) }),
                new GameEntityPluk({ pos: vec3create(85, 68, 0) }),
                new LightEntity({ pos: vec3create(0, 68, 32), behaviors: [ new LightBehavior({attenuation: 0 })]})
            ],
            segments: [
                new MapSegment({ ax: -100, ay: 100,
                    midMaterialId: 'Sky',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 100, ay: 100,
                    midMaterialId: 'mat2',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 100, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector1',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 30, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector4',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -30, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector2',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -100, ay: 30,
                    midMaterialId: 'mat2',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector4', bottomZ: -3, topZ: 50,
            floorMaterialId: 'f1',
            ceilMaterialId: 'f5',
            segments: [
                new MapSegment({ ax: -30, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector0',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 30, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector1',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 30, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector3',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -30, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector2',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector5', bottomZ: -20, topZ: 64,
            floorMaterialId: 'f1',
            ceilMaterialId: 'Sky',
            segments: [
                new MapSegment({ ax: -100, ay: -30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -120, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector6',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -120, ay: 30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -100, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector2',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector6', bottomZ: -30, topZ: 64,
            floorMaterialId: 'f1',
            ceilMaterialId: 'Sky',
            segments: [
                new MapSegment({ ax: -120, ay: -30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -140, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector7',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -140, ay: 30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -120, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector5',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector7', bottomZ: -40, topZ: 64,
            floorMaterialId: 'f1',
            ceilMaterialId: 'Sky',
            segments: [
                new MapSegment({ ax: -140, ay: -30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -160, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector8',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -160, ay: 30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -140, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector6',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector8', bottomZ: -50, topZ: 64,
            floorMaterialId: 'f1',
            ceilMaterialId: 'Sky',
            segments: [
                new MapSegment({ ax: -160, ay: -30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -180, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector9',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -180, ay: 30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -160, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector7',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector9', bottomZ: -60, topZ: -6,
            floorMaterialId: 'Painful Slime',
            ceilMaterialId: 'Default Floor',
            entities: [
                new LightEntity({ pos: vec3create(-240, 0, -30), behaviors: [ new LightBehavior({ diffuse: vec3create(0.1, 1.0, 0.1) }) ] })
            ],
            segments: [
                new MapSegment({ ax: -180, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector10',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: -30,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: -10,
                    midMaterialId: 'mat3',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: 10,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector11',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -180, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector8',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector10', bottomZ: -60, topZ: -6,
            floorMaterialId: 'Painful Slime',
            ceilMaterialId: 'Default Floor',
            entities: [
                new LightEntity({ pos: vec3create(-240, -100, -30), behaviors: [ new LightBehavior({ diffuse: vec3create(0.1, 1.0, 0.1) }) ] })
            ],
            segments: [
                new MapSegment({ ax: -180, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector9',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: -30,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: -140,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -180, ay: -140,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector11', bottomZ: -60, topZ: -6,
            floorMaterialId: 'Painful Slime',
            ceilMaterialId: 'Default Floor',
            entities: [
                new LightEntity({ pos: vec3create(-240, 100, -30), behaviors: [ new LightBehavior({ diffuse: vec3create(0.1, 1.0, 0.1) }) ] })
            ],
            segments: [
                new MapSegment({ ax: -180, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector9',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: 30,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -300, ay: 140,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: -180, ay: 140,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector12', bottomZ: 0, topZ: 60,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'f6',
            segments: [
                new MapSegment({ ax: 105, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector25',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 105, ay: 30,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 115, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector13',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 150, ay: 30,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 150, ay: -30,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector13', bottomZ: 0, topZ: 60,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'f6',
            segments: [
                new MapSegment({ ax: 115, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector12',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 150, ay: 30,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 150, ay: 70,
                    midMaterialId: null,
                    adjacentSectorId: 'sector14',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 150, ay: 100,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 115, ay: 100,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector14', bottomZ: 0, topZ: 60,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'f1',
            segments: [
                new MapSegment({ ax: 150, ay: 100,
                    midMaterialId: null,
                    adjacentSectorId: 'sector13',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 150, ay: 70,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 70,
                    midMaterialId: null,
                    adjacentSectorId: 'sector15',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 100,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector15', bottomZ: -20, topZ: 100,
            floorMaterialId: 'Water',
            ceilMaterialId: 'Sky',
            floorTargetSectorId: 'sector17',
            entities: [
                new LightEntity({ pos: vec3create(350, 80, 90), behaviors: [ new LightBehavior({ diffuse: vec3create(0.4, 0.6, 1.0), strength: 25 }) ] })
            ],
            segments: [
                new MapSegment({ ax: 300, ay: 20,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 70,
                    midMaterialId: null,
                    adjacentSectorId: 'sector14',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 100,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 380, ay: 150,
                    midMaterialId: null,
                    adjacentSectorId: 'sector16',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 20,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector16', bottomZ: 10, topZ: 60,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'f1',
            segments: [
                new MapSegment({ ax: 380, ay: 150,
                    midMaterialId: null,
                    adjacentSectorId: 'sector15',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 400,
                    midMaterialId: null,
                    adjacentSectorId: 'sector20',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 380, ay: 400,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSectorWater({ id: 'sector17', bottomZ: -170, topZ: -20,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Water',
            ceilTargetSectorId: 'sector15',
            tags: [ 'underwater' ],
            segments: [
                new MapSegment({ ax: 300, ay: 150,
                    midMaterialId: null,
                    adjacentSectorId: 'sector18',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 20,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 20,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSectorWater({ id: 'sector18', bottomZ: -230, topZ: -20,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Default Floor',
            tags: [ 'underwater' ],
            entities: [ new LightEntity({ pos: vec3create(340, 260, -125),
                behaviors: [ new LightBehavior({ diffuse: vec3create(0.8, 0.8, 1.0), attenuation: false })]
            })],
            segments: [
                new MapSegment({ ax: 300, ay: 150,
                    midMaterialId: null,
                    adjacentSectorId: 'sector17',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midMaterialId: null,
                    adjacentSectorId: 'sector19',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 200,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 480, ay: 400,
                    midMaterialId: null,
                    adjacentSectorId: 'sector21',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 400,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 200,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSectorWater({ id: 'sector19', bottomZ: -50, topZ: -20,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Default Floor',
            tags: [ 'underwater' ],
            segments: [
                new MapSegment({ ax: 600, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midMaterialId: null,
                    adjacentSectorId: 'sector18',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 400, ay: 200,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 600, ay: 200,
                    midMaterialId: null,
                    adjacentSectorId: 'sector22',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector20', bottomZ: -20, topZ: 60,
            floorMaterialId: 'Water',
            ceilMaterialId: 'f1',
            floorTargetSectorId: 'sector21',
            segments: [
                new MapSegment({ ax: 400, ay: 400,
                    midMaterialId: null,
                    adjacentSectorId: 'sector16',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 380, ay: 400,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 400,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 450,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 480, ay: 450,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 480, ay: 400,
                    midMaterialId: 'mat1',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSectorWater({ id: 'sector21', bottomZ: -200, topZ: -20,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Water',
            ceilTargetSectorId: 'sector20',
            tags: [ 'underwater' ],
            segments: [
                new MapSegment({ ax: 300, ay: 400,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 300, ay: 450,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 480, ay: 450,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 480, ay: 400,
                    midMaterialId: null,
                    adjacentSectorId: 'sector18',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSectorWater({ id: 'sector22', bottomZ: -70, topZ: -20,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Water',
            ceilTargetSectorId: 'sector23',
            tags: [ 'underwater' ],
            entities: [ new LightEntity({ pos: vec3create(610, 175, -50),
                behaviors: [ new LightBehavior({ diffuse: vec3create(0.8, 0.8, 1.0), attenuation: false })]
            })],
            segments: [
                new MapSegment({ ax: 620, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 600, ay: 150,
                    midMaterialId: null,
                    adjacentSectorId: 'sector19',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 600, ay: 200,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 620, ay: 200,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector23', bottomZ: -20, topZ: 50,
            floorMaterialId: 'Water',
            ceilMaterialId: 'Default Floor',
            floorTargetSectorId: 'sector22',
            segments: [
                new MapSegment({ ax: 620, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 600, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 600, ay: 200,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 620, ay: 200,
                    midMaterialId: null,
                    adjacentSectorId: 'sector24',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSector({ id: 'sector24', bottomZ: -10, topZ: 70,
            floorMaterialId: 'mat1',
            ceilMaterialId: 'Default',
            entities: [ new LightEntity({ pos: vec3create(700, 175, 50),
                behaviors: [ new LightBehavior({ })]
            })],
            segments: [
                new MapSegment({ ax: 620, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 740, ay: 150,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 740, ay: 200,
                    midMaterialId: 'mat6',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }),
                new MapSegment({ ax: 620, ay: 200,
                    midMaterialId: null,
                    adjacentSectorId: 'sector23',
                    loMaterialId: 'Default', hiMaterialId: 'Default', flags: 0 }) ] }),
        new MapSectorVerticalDoor({ id: 'sector25', bottomZ: 0, topZ: 64,
            floorMaterialId: 'Default',
            ceilMaterialId: 'mat6',
            segments: [
                new MapSegment({ ax: 105, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector12',
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 }),
                new MapSegment({ ax: 105, ay: 30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 }),
                new MapSegment({ ax: 100, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector1',
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 }),
                new MapSegment({ax: 100, ay: -30,
                    midMaterialId: 'Default',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 })]
        }) ] }).serialize();

function loadTestMap() {
    globalGame.map = globalEditor.map = Map.deserialize(testMap);
    if (globalGame.renderer)
        globalGame.renderer.map = globalGame.map;
    globalGame.map.entitiesPaused = true;
    globalGame.resetRenderWorkers();
}