# 👾 Space Invaders with React & Redux ⚛️

DOM manipulation driven space invaders. Every game component except destructible blocks is HTML elements rendered with React. Game state is managed by Redux.

## Usage

```
# On the project root directory
npm start
```

Then dev server is on localhost:3000

## Brief Architecture

### 1. State

Using Redux to manage global state. All game components (like player, enemies, projectiles, obstacles...) and game meta data (like score, stage...) is contained in the redux state store. Any operations to modify state should get through the redux dispatch function.

### 2. Logic

Using React hooks to set listeners for `requestAnimationFrame` ticks (frames) and user input events (like keyboard inputs, pointer inputs, screen resize...). Most of the game logics that modify global state occurs in those listeners.

### 3. Rendering & Animation

Render React components based on global state. Some of the per component's state modifications occurs in here. Any animation is handled inside the components.
