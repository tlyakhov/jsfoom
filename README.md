jsfoom
======

jsFoom is a pure JavaScript 2.5D sector/portal-based raycasting game engine.

# Why?

This project is just a personal exploration of in-browser JavaScript performance and capabilities. I'm staying away from WebGL and other hardware accelerated features (apart from Canvas, the use of which is unavoidable) to see if it would be possible to re-create a Duke Nukem 3D/Doom type of experience with a completely in-browser full game engine.

![jsFoom Level Editor](https://raw.github.com/tlyakhov/jsfoom/master/foom-edit-screen.png)

# Features

* Uses HTML5 Web Workers for multi-threaded rendering & game logic.
* Sectors with non-orthogonal walls of variable height.
* Texture mapped floors, ceilings, and walls.
* Fully dynamic lighting with dynamic shadow maps.
* Objects represented as sprites with multiple angles.
* Bilinear filtering & mipmapping for images and shadow maps.
* Various effect sectors (doors, underwater sectors)
* Physics and collision detection.
* Level editor:
  - Realtime 3D view.
  - Edit any sector/segment/entity property.
  - Slice sectors/split segments.
  - Undo/redo history.
  - Saves/loads in local storage.

# Requirements

* Modern web browser with fast JIT JavaScript implementation supporting HTML5 features (Canvas, Web Workers, performance.now).
* Fast multi-core machine. Due to the inherent inefficiency of JS, the engine is very CPU and RAM intensive, requiring at least an i5 dual core machine and dedicated 1 GB of RAM.
* Web server for hosting. Running locally produces "cross-origin" security errors for texture/sound/map resources.

# Current/Future Work

* Level editor features and bugfixes:
  - Fixing slice/cut errors.
  - Fixing entity+sector linking errors during motion.
  - Material management, editing.
* In-game UI/settings
* Better memory use/pre-loading of textures and lighting.
* Framework for game logic, AI, and player objectives.
  - Player/entity inventory
  - Weapons
  - Scriptable entity behaviors (patrol, search, speak, attack, defend)
  - Entities with effects (keys+locked doors, moving platforms, entity drops)
  - Level win/lose conditions.
* Sound
* Mini-map showing visited areas a la 'Doom'.
* Ruby/Rails/MongoDB server storing player data/progress.
* Distant future: Multiplayer
