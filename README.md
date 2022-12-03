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

### Entity

TODO

#### Available Methods:

TODO

### EntityManager

The EntityManager (static) class is the main class that handles distribution and sorting of entities with their components. This class is used almost entirely internally, therefore the public API is sparse.

#### Available Methods:

-   `createEntity` - provides a way of creating a new entity without instantiating the Entity class yourself
    - Arguments: None
    - Returns: `Entity`

### SystemManager

The SystemManager (static) class is the main class you'll need to use to register systems for EntTS to use. This class provides you with a way of registering, and accessing registered system's outside their own context at a later point in your application.

#### Available Methods:

-   `add` - provides a way to add a system to the manager
    - Arguments:
        - `new () => System` SystemClass - an uninstantiated version of the system class to add
    - Returns: `void`
-   `get` - provides a way to retrieve a system from the manager
    - Arguments:
        - `new () => System` SystemClass - an uninstantiated version of the system class *you've already added* to retrieve
    - Returns: `System | undefined`
-   `getAll` - provides a way to retrieve all added systems from the manager
    - Arguments: None
    - Returns: `Map<new () => System, System>`
-   `update` - call this every time you want updates to all systems to occur
    - Arguments: None
    - Returns: `void`

### System

The System class is the base class for all systems you require. System classes keep track of all entities that match their `components` list (accessible via the `entities` property inside the class). All System classes have their `onUpdate` method invoked every time the SystemManager `update` method is invoked.

#### Available Methods:

-   `onUpdate` - invoked every time the SystemManager updates
    - Arguments: None
    - Returns: `void`
-   `onEntityAdded` - invoked every time an entity is added to the system
    - Arguments: 
        - `string` entity - the entity id
    - Returns: `void`
-   `onEntityRemoved` - invoked every time an entity is removed from the system
    - Arguments:
        - `string` entity - the entity id
    - Returns: `void`
-   `getEntities` - provides a way to publicly access all the entities in the system
    - Arguments: None
    - Returns: `Set<string>`
-   `has` - check if the system has an entity
    - Arguments:
        - `string` entity - the entity id
    - Returns: `boolean`
