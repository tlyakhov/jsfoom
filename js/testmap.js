var testmap = new Map({
    spawnx: 0,
    spawny: -70,
    materials: [
        new Material({ id: 'Default', textureSrc: 'data/WDef.png' }),
        new Material({ id: 'mat1', textureSrc: 'data/WSlimy.png' }),
        new Material({ id: 'mat2', textureSrc: 'data/WMetal.png' }),
        new Material({ id: 'mat3', textureSrc: 'data/WSlimeGrate.png' }),
        new Material({ id: 'mat6', textureSrc: 'data/WDirty.png' }),
        new Material({ id: 'Doom Garage Door', textureSrc: 'data/DGarage.png' }),

        new Material({ id: 'Default Floor', textureSrc: 'data/FDef.png' }),
        new Material({ id: 'f1', textureSrc: 'data/FGrayTile.png' }),
        new Material({ id: 'f2', textureSrc: 'data/FSlime.png', isLiquid: true }),
        new Material({ id: 'f5', textureSrc: 'data/FRedLight.png' }),
        new Material({ id: 'f6', textureSrc: 'data/FHexMetal.png' }),
        new Material({ id: 'Water', textureSrc: 'data/Water.png', isLiquid: true }),
        new Material({ id: 'Sky', textureSrc: 'data/Sky.png', renderAsSky: true })
    ],
    sectors: [
        new MapSector({ id: 'sector0', bottomZ: 0, topZ: 64,
            floorMaterialId: 'Default Floor',
            ceilMaterialId: 'Sky',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            floorMaterialId: 'f2',
            ceilMaterialId: 'Default Floor',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            floorMaterialId: 'f2',
            ceilMaterialId: 'Default Floor',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            floorMaterialId: 'f2',
            ceilMaterialId: 'Default Floor',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 1,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 2,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 3,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 3,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 1,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 2,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 2,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 1,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
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
            flags: 4,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 105, ay: -30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector12',
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 }),
                new MapSegment({ ax: 105, ay: 30,
                    midMaterialId: 'Doom Garage Door',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 }),
                new MapSegment({ ax: 100, ay: 30,
                    midMaterialId: null,
                    adjacentSectorId: 'sector1',
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 }),
                new MapSegment({ax: 100, ay: -30,
                    midMaterialId: 'Doom Garage Door',
                    adjacentSectorId: null,
                    loMaterialId: 'Default', hiMaterialId: 'Doom Garage Door', flags: 0 })]
        }) ] });