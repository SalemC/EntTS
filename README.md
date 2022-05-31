# EntTS

An Entity Component System, written in Typescript for Javascript/Typescript applications.

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
    public components = [PositionComponent, GravityComponent];

    public onUpdate() {
        this.entities.forEach((entityId) => {
            const entity = new Entity(entityId);

            // Grab a reference to the underlying `PositionComponent` for each entity.
            const position = entity.getComponent(PositionComponent);

            // Then, let's perform some changes to that component!
            position.y -= entity.getComponent(GravityComponent).amount;
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
// We'll use a setTimeout here, but you could use any kind of loop.
setInterval(() => {
    SystemManager.update();
}, 1);

// That's it! Let's make sure things are occurring though...
setInterval(() => {
    console.log(entity.getComponent(PositionComponent));
    console.log(entity.getComponent(GravityComponent));
}, 500);
```
