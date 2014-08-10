var map = new Map({
    spawnx: 0,
    spawny: -70,
    sectors: [
        new MapSector({ id: 'sector0', bottomZ: 0, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -100, ay: -100,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 100, ay: -100,
                    midTexSrc: 'data/WMetal.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 100, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector1',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 30, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector4',
										loTexSrc: 'data/WDirty.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -30, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector2',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -100, ay: -30,
                    midTexSrc: 'data/WMetal.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector1', bottomZ: 0, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 100, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector25',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 100, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector3',
										loTexSrc: 'data/WSlimeGrate.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 30, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector4',
										loTexSrc: 'data/WDirty.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 30, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector0',
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector2', bottomZ: -10, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -100, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector5',
										loTexSrc: 'data/DGarage.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -100, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector3',
										loTexSrc: 'data/WSlimeGrate.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -30, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector4',
										loTexSrc: 'data/WDirty.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -30, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector0',
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector3', bottomZ: 0, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -100, ay: 100,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 100, ay: 100,
                    midTexSrc: 'data/WMetal.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 100, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector1',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 30, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector4',
										loTexSrc: 'data/WDirty.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -30, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector2',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -100, ay: 30,
                    midTexSrc: 'data/WMetal.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector4', bottomZ: -3, topZ: 50,
            floorTexSrc: 'data/DGarage.png',
            ceilTexSrc: 'data/WSlimy.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -30, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector0',
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 30, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector1',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 30, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector3',
										loTexSrc: 'data/WSlimeGrate.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -30, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector2',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector5', bottomZ: -20, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/WSlimy.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -100, ay: -30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -120, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector6',
										loTexSrc: 'data/Sky.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -120, ay: 30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -100, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector2',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector6', bottomZ: -30, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/WSlimy.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -120, ay: -30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -140, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector7',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -140, ay: 30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -120, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector5',
										loTexSrc: 'data/DGarage.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector7', bottomZ: -40, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/WSlimy.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -140, ay: -30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -160, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector8',
										loTexSrc: 'data/Sky.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -160, ay: 30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -140, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector6',
										loTexSrc: 'data/Sky.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector8', bottomZ: -50, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/WSlimy.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -160, ay: -30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -180, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector9',
										loTexSrc: 9, hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -180, ay: 30,
                    midTexSrc: 'data/WDef.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -160, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector7',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector9', bottomZ: -60, topZ: -6,
            floorTexSrc: 'data/FDef.png',
            ceilTexSrc: 'data/WMetal.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -180, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector10',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: -30,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: -10,
                    midTexSrc: 'data/WSlimeGrate.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: 10,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector11',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -180, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector8',
										loTexSrc: 'data/Sky.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector10', bottomZ: -60, topZ: -6,
            floorTexSrc: 'data/FDef.png',
            ceilTexSrc: 'data/WMetal.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -180, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector9',
										loTexSrc: 9, hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: -30,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: -140,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -180, ay: -140,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector11', bottomZ: -60, topZ: -6,
            floorTexSrc: 'data/FDef.png',
            ceilTexSrc: 'data/WMetal.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: -180, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector9',
										loTexSrc: 9, hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: 30,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -300, ay: 140,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: -180, ay: 140,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector12', bottomZ: 0, topZ: 60,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 105, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector25',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 105, ay: 30,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 115, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector13',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 150, ay: 30,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 150, ay: -30,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector13', bottomZ: 0, topZ: 60,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 115, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector12',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 150, ay: 30,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 150, ay: 70,
                    midTexSrc: null,
                    adjacentSectorId: 'sector14',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 150, ay: 100,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 115, ay: 100,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector14', bottomZ: 0, topZ: 60,
            floorTexSrc: 'data/WSlimy.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 150, ay: 100,
                    midTexSrc: null,
                    adjacentSectorId: 'sector13',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 150, ay: 70,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 70,
                    midTexSrc: null,
                    adjacentSectorId: 'sector15',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 100,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector15', bottomZ: -20, topZ: 100,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/WMetal.png',
            flags: 1,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 300, ay: 20,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 70,
                    midTexSrc: null,
                    adjacentSectorId: 'sector14',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 100,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 380, ay: 150,
                    midTexSrc: null,
                    adjacentSectorId: 'sector16',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 20,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector16', bottomZ: 10, topZ: 60,
            floorTexSrc: 'data/WSlimy.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 380, ay: 150,
                    midTexSrc: null,
                    adjacentSectorId: 'sector15',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 400,
                    midTexSrc: null,
                    adjacentSectorId: 'sector20',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 380, ay: 400,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector17', bottomZ: -170, topZ: -20,
            floorTexSrc: 'data/WMetal.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 2,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 300, ay: 150,
                    midTexSrc: null,
                    adjacentSectorId: 'sector18',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 20,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 20,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector18', bottomZ: -230, topZ: -20,
            floorTexSrc: 'data/FDef.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 3,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 300, ay: 150,
                    midTexSrc: null,
                    adjacentSectorId: 'sector17',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midTexSrc: null,
                    adjacentSectorId: 'sector19',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 200,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 480, ay: 400,
                    midTexSrc: null,
                    adjacentSectorId: 'sector21',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 400,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 200,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector19', bottomZ: -50, topZ: -20,
            floorTexSrc: 'data/FDef.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 3,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 600, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 150,
                    midTexSrc: null,
                    adjacentSectorId: 'sector18',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 400, ay: 200,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 600, ay: 200,
                    midTexSrc: null,
                    adjacentSectorId: 'sector22',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector20', bottomZ: -20, topZ: 60,
            floorTexSrc: 'data/WSlimy.png',
            ceilTexSrc: 'data/WMetal.png',
            flags: 1,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 400, ay: 400,
                    midTexSrc: null,
                    adjacentSectorId: 'sector16',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 380, ay: 400,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 400,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 450,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 480, ay: 450,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 480, ay: 400,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector21', bottomZ: -200, topZ: -20,
            floorTexSrc: 'data/WMetal.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 2,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 300, ay: 400,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 300, ay: 450,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 480, ay: 450,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 480, ay: 400,
                    midTexSrc: null,
                    adjacentSectorId: 'sector18',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector22', bottomZ: -70, topZ: -20,
            floorTexSrc: 'data/WMetal.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 2,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 620, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 600, ay: 150,
                    midTexSrc: null,
                    adjacentSectorId: 'sector19',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 600, ay: 200,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 620, ay: 200,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector23', bottomZ: -20, topZ: 50,
            floorTexSrc: 'data/FDef.png',
            ceilTexSrc: 'data/WMetal.png',
            flags: 1,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 620, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 600, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 600, ay: 200,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 620, ay: 200,
                    midTexSrc: null,
                    adjacentSectorId: 'sector24',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector24', bottomZ: -10, topZ: 70,
            floorTexSrc: 'data/FDef.png',
            ceilTexSrc: 'data/WSlimy.png',
            flags: 0,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 620, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 740, ay: 150,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 740, ay: 200,
                    midTexSrc: 'data/Sky.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WDef.png', flags: 0 }),
                new MapSegment({ ax: 620, ay: 200,
                    midTexSrc: null,
                    adjacentSectorId: 'sector23',
										loTexSrc: 'data/WMetal.png', hiTexSrc: 'data/WDef.png', flags: 0 }) ] }),
        new MapSector({ id: 'sector25', bottomZ: 0, topZ: 64,
            floorTexSrc: 'data/Sky.png',
            ceilTexSrc: 'data/FDef.png',
            flags: 4,
            floorOx: 0, floorOy: 0, floorMx: 1, floorMy: 1, floorRot: 0,
            ceilOx: 0, ceilOy: 0, ceilMx: 1, ceilMy: 1, ceilRot: 0,
            segments: [
                new MapSegment({ ax: 105, ay: -30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector12',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WMetal.png', flags: 0 }),
                new MapSegment({ ax: 105, ay: 30,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WMetal.png', flags: 0 }),
                new MapSegment({ ax: 100, ay: 30,
                    midTexSrc: null,
                    adjacentSectorId: 'sector1',
										loTexSrc: 'data/WSlimy.png', hiTexSrc: 'data/WMetal.png', flags: 0 }),
                new MapSegment({ax: 100, ay: -30,
                    midTexSrc: 'data/WSlimy.png',
                    adjacentSectorId: null,
										loTexSrc: 'data/WDef.png', hiTexSrc: 'data/WMetal.png', flags: 0 })]
        }) ] });