var GAME_CONSTANTS = {
    // Rendering constants
    renderWorkers: 8,
    intersectEpsilon: 1e-15,
    lightGrid: 8,
    velocityEpsilon: 1e-15,
    lightAttenuationEpsilon: 0.001,
    maxViewDistance: 1000000.0,
    fieldOfView: 75,
    // World constants
    gravity: 0.1,
    gravitySwim: 0.001,
    swimDamping: 2.0,
    collisionCheck: 2.0,
    liquidChurnSpeed: 2.0,
    liquidChurnSize: 0.03,
    doorSpeed: 3.0,
    // Player constants
    playerBoundingRadius: 10.0,
    playerHeight: 32.0,
    playerCrouchHeight: 16.0,
    playerSpeed: 2.2,
    playerTurnSpeed: 4.0,
    playerJumpStrength: 1.5,
    playerSwimStrength: 0.6,
    playerHurtTime: 30,
    playerMountHeight: 30.0,
    playerMaxHealth: 100,
    // Game constants
    maxGameTextTime: 30 * 1000,
    maxGameText: 25,
    gameTextFadeTime: 1000,
    talkDistance: 100,
    wanderSectorProbablity: 0.25,
    inventoryGatherDistance: 30,
    inventoryGatherTextStyle: '#0C4'
};
