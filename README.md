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
* Level editor

# Requirements

* Modern web browser with fast JIT JavaScript implementation supporting HTML5 features (Canvas, Web Workers, performance.now).
* Fast multi-core machine. Due to the inherent inefficiency of JS, the engine is very CPU and RAM intensive, requiring at least an i5 dual core machine and dedicated 1 GB of RAM.
* Web server for hosting. Running locally produces "cross-origin" security errors for texture/sound/map resources.

# Current/Future Work

* Level editor
* In-game UI/settings
* Better memory use/pre-loading
* Framework for game logic, AI, and player objectives.
* Inventory/items
* Weapons
* Sound
* Mini-map showing visited areas a la 'Doom'.
* Ruby/Rails/MongoDB server storing player data/progress.
* Distant future: Multiplayer
