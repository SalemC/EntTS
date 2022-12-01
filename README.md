# EntTS &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SalemC/EntTS/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/entts)](https://www.npmjs.com/package/entts)

EntTS is a reactive [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system), written entirely in TypeScript for TypeScript/JavaScript applications.

## Installation

You can install this package via NPM or Yarn:

-   NPM: `npm install --save entts`
-   Yarn: `yarn add entts`

## Basic Example

```ts
import { EntityManager, SystemManager, System, Entity } from 'entts';

// Firstly, create yourself some `POD` components.
class PositionComponent {
    public x: number = 0;
    public y: number = 0;
}

class GravityComponent {
    public amount: number = 0.1;
}

// Then, you'll want at least one system to handle your components.
class MovementSystem extends System {
    // All entities with these components will be available in the `onUpdate` method.
    public components = [PositionComponent, GravityComponent];

    // This method is invoked every time the SystemManager updates.
    public onUpdate() {
        for (const entityId of this.entities) {
            // Entities are stored in systems as strings, and are pretty useless to you in that form.
            // To create a usable entity, instantiate the Entity class with your entity's id.
            const entity = new Entity(entityId);

            // Get a reference to the components for the entity you've just referenced.
            const position = entity.getComponent(PositionComponent);
            const gravity = entity.getComponent(GravityComponent);

            // These components should never be null, but better safe than sorry!
            if (!position || !gravity) continue;

            // Then, let's perform some changes to the position component.
            // Since components are directly referenced, you can make changes to them mutably.
            position.y -= gravity.amount;
        }
    }
}

// Make sure you add your system to the `SystemManager`, otherwise it won't be aware of it!
SystemManager.add(MovementSystem);

// Now that the setup is all done, let's create a new entity.
// Entities aren't stored in the EntityManager until they have components attached to them.
const entity = EntityManager.createEntity();

// Be sure to add any relevant components to entities you create too!
// This can be done at any time, but so we don't forget we'll do it now.
entity.addComponent(PositionComponent);
entity.addComponent(GravityComponent);

// The SystemManager needs to be updated periodically in order for it to relay those updates to your systems.
// We'll use a setInterval here, but you're free to use any method to periodically cause the SystemManager to update.
setInterval(() => {
    SystemManager.update();
}, 1);

// That's it! Let's make sure the position for your new entity is being updated due to gravity though...
setInterval(() => {
    console.log(entity.getComponent(PositionComponent));
}, 500);
```

## Classes

### System

The System class is the base class for all systems you require. System classes keep track of all entities that match their `components` list (accessible via the `entities` property inside the class). All System classes have their `onUpdate` method invoked every time the SystemManager `update` method is invoked.

#### Available Methods:

-   `onUpdate`
-   `onEntityAdded`
-   `onEntityRemoved`
-   `getEntities`
