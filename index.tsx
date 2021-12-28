import { v4 as uuidv4 } from "uuid";

class SpeedComponent {
    constructor(public value: number) {}
}

class SpriteComponent {
    //
}

class Entity {
    /**
     * This entity's unique identifier.
     */
    public readonly id: number = uuidv4();

    /**
     * Add `Component` to this entity.
     *
     * @param {T} Component The component.
     * @param {ConstructorParameters<T>} args The arguments for `Component`.
     *
     * @return {this}
     */
    public addComponent<T extends new (...args: any[]) => any>(
        Component: T,
        ...args: ConstructorParameters<T>
    ): this {
        EntityManager.addComponentToEntity(this.id, Component, ...args);

        return this;
    }

    /**
     * Check if this entity has `Component`.
     *
     * @param {T} Component The component.
     *
     * @return {boolean}
     */
    public hasComponent<T>(Component: new (...args: any[]) => T): boolean {
        return EntityManager.entityHasComponent(this.id, Component);
    }

    /**
     * Get `Component` for this entity.
     *
     * @param {T} Component The component.
     *
     * @return {T|null}
     */
    public getComponent<T>(Component: new (...args: any[]) => T): T | null {
        return EntityManager.getComponentForEntity(this.id, Component);
    }
}

type TEntities = number[];

class EntityManager {
    /**
     * All entities.
     *
     * @var {Map<number, Map<string, any>>}
     */
    public static readonly entities = new Map<number, Map<string, InstanceType<any>>>();

    /**
     * Create a new entity.
     *
     * @return {Entity}
     */
    public static createEntity = (): Entity => new Entity();

    /**
     * Add `Component` to `entity`.
     *
     * @param {number} entity The entity.
     * @param {T} Component The component.
     * @param {ConstructorParameters<T>} args All arguments for `Component`.
     *
     * @return {void}
     */
    public static addComponentToEntity = <T extends new (...args: any[]) => any>(
        entity: number,
        Component: T,
        ...args: ConstructorParameters<T>
    ): void => {
        if (!EntityManager.entities.has(entity)) {
            EntityManager.entities.set(entity, new Map());
        }

        if (EntityManager.entities.get(entity)!.has(Component.name)) {
            throw new Error("Entity already has this component.");
        }

        EntityManager.entities.get(entity)!.set(Component.name, new Component(...args));

        SystemManager.handleEntityComponentsChanged(entity);
    };

    /**
     * Remove `Component` from `entity`.
     *
     * @param {number} entity The entity.
     * @param {T} Component The component.
     *
     * @return {void}
     */
    public static removeComponentFromEntity<T extends new (...args: any[]) => any>(
        entity: number,
        Component: T
    ): void {
        if (!EntityManager.entities.has(entity)) return;

        EntityManager.entities.get(entity)!.delete(Component.name);

        SystemManager.handleEntityComponentsChanged(entity);
    }

    /**
     * Check if `entity` has `Component`.
     *
     * @param {number} entity The entity.
     * @param {T} Component The component.
     *
     * @return {boolean}
     */
    public static entityHasComponent<T>(
        entity: number,
        Component: new (...args: any[]) => T
    ): boolean {
        if (!EntityManager.entities.has(entity)) return false;

        return EntityManager.entities.get(entity)!.has(Component.name);
    }

    /**
     * Get `Component` for `entity`.
     *
     * @param {number} entity The entity.
     * @param {T} Component The component.
     *
     * @return {T|null}
     */
    public static getComponentForEntity<T>(
        entity: number,
        Component: new (...args: any[]) => T
    ): T | null {
        if (!EntityManager.entities.has(entity)) return null;

        return EntityManager.entities.get(entity)!.get(Component.name) || null;
    }
}

abstract class System {
    /**
     * The entities this system is currently processing.
     *
     * @var {Set<number>}
     */
    public readonly entities: Set<number> = new Set();

    /**
     * The components this system is processing.
     *
     * @var {(new (...args: any[]) => any)[]}
     */
    public abstract components: (new (...args: any[]) => any)[];

    /**
     * Called when this system is updated.
     *
     * @return {void}
     */
    public abstract onUpdate(): void;
}

class SystemManager {
    /**
     * All active systems.
     *
     * @var {Set<System>}
     */
    public static readonly systems = new Set<System>();

    /**
     * Add a system.
     *
     * @param {new () => System} SystemClass The system class.
     *
     * @return {void}
     */
    public static add(SystemClass: new () => System): void {
        const system = new SystemClass();

        // Place all current entities with all matching components into the system.
        for (const [entity, entityComponents] of EntityManager.entities.entries()) {
            if (system.components.every((component) => entityComponents.has(component.name))) {
                system.entities.add(entity);
            }
        }

        SystemManager.systems.add(system);
    }

    /**
     * Handle updating all systems.
     *
     * @return {void}
     */
    public static update(): void {
        for (const system of SystemManager.systems) {
            system.onUpdate();
        }
    }

    /**
     * Handle an entity's components changing.
     *
     * @param {number} entity The entity.
     *
     * @return {void}
     */
    public static handleEntityComponentsChanged(entity: number): void {
        if (!EntityManager.entities.has(entity)) return;

        for (const system of SystemManager.systems) {
            if (system.entities.has(entity)) continue;

            if (
                system.components.every((component) =>
                    EntityManager.entities.get(entity)!.has(component.name)
                )
            ) {
                system.entities.add(entity);
            }
        }
    }
}

class RenderSystem extends System {
    public components = [SpriteComponent];

    public onUpdate(): void {
        //
    }
}

const entity = EntityManager.createEntity();

const entity2 = EntityManager.createEntity().addComponent(SpeedComponent, 1);

SystemManager.add(RenderSystem);

let i = 0;

entity.addComponent(SpriteComponent);

setInterval(() => {
    if (i === 10) {
        entity2.addComponent(SpriteComponent);
    } else if (i > 10) {
        entity2.addComponent(SpriteComponent);
    }

    SystemManager.update();

    i += 1;
}, 100);
