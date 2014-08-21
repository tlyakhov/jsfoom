jsfoom
======

jsFoom is a pure JavaScript 2.5D sector/portal-based raycasting game engine.

# Features

* Sectors with non-orthogonal walls of variable height.
* Texture mapped floors, ceilings, and walls.
* Fully dynamic Phong lighting
* Objects represented as sprites with multiple angles.
* Bilinear filtering & mipmapping for images.
* Various effect sectors (doors, underwater sectors)
* Physics and collision detection

# Requirements

* Modern web browser with fast JIT JavaScript implementation supporting HTML5 features (canvas).
* Web server for hosting. Running locally produces "cross-origin" security errors for texture/sound/map resources.

# Current/Future Work

* Optimization
* Level editor
* Framework for game logic, AI, and player objectives.
* Inventory/items
* Weapons
* Sound
* Mini-map showing visited areas a la 'Doom'.
* Ruby/Rails/MongoDB server storing player data/progress.
* Distant future: Multiplayer
