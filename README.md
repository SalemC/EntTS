# EntTS

An Entity Component System, written in TypeScript for JavaScript/TypeScript applications.

## Installation

You can install this package with either NPM or Yarn:

-   NPM: `npm install --save entts`
-   Yarn: `yarn add entts`

## Basic Example

```ts
import { EntityManager, SystemManager, System, Entity } from 'entts';

// Firstly, create yourself some `POD` components!
class PositionComponent {
    public x: number = 0;
    public y: number = 0;
}

class GravityComponent {
    public amount: number = 0.1;
}

// Then, you'll want at least one system to handle your components!
class MovementSystem extends System {
    // Any entities with *exactly* these components will be available in the `onUpdate` method.
    public components = [PositionComponent, GravityComponent];

    // This method is called every time the SystemManager updates.
    public onUpdate() {
        this.entities.forEach((entityId) => {
            const entity = new Entity(entityId);

            // Grab a reference to the components for the current entity.
            const position = entity.getComponent(PositionComponent);
            const gravity = entity.getComponent(GravityComponent);

            // These components should never be null, but better safe than sorry!
            if (!position || !gravity) return;

            // Then, let's perform some changes to that component!
            position.y -= gravity.amount;
        });
    }
}

// Make sure you add your system to the `SystemManager`, otherwise it won't be aware of it!
SystemManager.add(MovementSystem);

// Now that the setup is all done, let's create an entity.
const entity = EntityManager.createEntity();

// Be sure to add any relevant components to entities you create too!
// This can be done at any time, but so we don't forget we'll do it now.
entity.addComponent(PositionComponent);
entity.addComponent(GravityComponent);

// SystemManager needs to be updated periodically in order for it to perform changes.
// We'll use a setInterval here, but you could use any kind of loop.
setInterval(() => {
    SystemManager.update();
}, 1);

// That's it! Let's make sure things are occurring though...
setInterval(() => {
    console.log(entity.getComponent(PositionComponent));
    console.log(entity.getComponent(GravityComponent));
}, 500);
```
