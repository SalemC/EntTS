import { SystemManager } from '../SystemManager';
import { TEntityList } from './types';
import { Entity } from '../Entity';

class EntityManager {
    /**
     * All entities.
     */
    public static readonly entities: TEntityList = new Map();

    /**
     * Create a new entity.
     */
    public static createEntity = (): Entity => new Entity();

    /**
     * Add `Component` to `entity`.
     *
     * @param entity The entity.
     * @param Component The component.
     * @param args All arguments for `Component`.
     */
    public static addComponentToEntity = <
        T extends new (...args: any[]) => any,
    >(
        entity: string,
        Component: T,
        ...args: ConstructorParameters<T>
    ): void => {
        if (!EntityManager.entities.has(entity)) {
            EntityManager.entities.set(entity, new Map());
        }

        if (EntityManager.entities.get(entity)!.has(Component.name)) {
            throw new Error('Entity already has this component.');
        }

        EntityManager.entities
            .get(entity)!
            .set(Component.name, new Component(...args));

        SystemManager.handleEntityComponentsChanged(entity, Component, 'added');
    };

    /**
     * Remove `Component` from `entity`.
     *
     * @param entity The entity.
     * @param Component The component.
     */
    public static removeComponentFromEntity<
        T extends new (...args: any[]) => any,
    >(entity: string, Component: T): void {
        if (!EntityManager.entities.has(entity)) return;

        SystemManager.handleEntityComponentsChanged(
            entity,
            Component,
            'removed',
        );

        // We delete the component from the entity after notifying the SystemManager
        // because systems may need to know the component's state to perform
        // cleanup operations before removing it.
        EntityManager.entities.get(entity)!.delete(Component.name);
    }

    /**
     * Check if `entity` has `Component`.
     *
     * @param entity The entity.
     * @param Component The component.
     */
    public static entityHasComponent<T>(
        entity: string,
        Component: new (...args: any[]) => T,
    ): boolean {
        if (!EntityManager.entities.has(entity)) return false;

        return EntityManager.entities.get(entity)!.has(Component.name);
    }

    /**
     * Get `Component` for `entity`.
     *
     * @param entity The entity.
     * @param Component The component.
     */
    public static getComponentForEntity<T>(
        entity: string,
        Component: new (...args: any[]) => T,
    ): T | null {
        if (!EntityManager.entities.has(entity)) return null;

        return EntityManager.entities.get(entity)!.get(Component.name) || null;
    }

    /**
     * Get all entities with all `components`.
     *
     * @param components The components.
     */
    public static getAllEntitiesWithComponents = (
        ...components: (new (...args: any[]) => any)[]
    ): Entity[] => {
        const entities: Entity[] = [];

        EntityManager.entities.forEach((entityComponents, entityId) => {
            const doesntHaveAllComponents = components.some(
                (component) => !entityComponents.has(component.name),
            );

            if (doesntHaveAllComponents) return;

            entities.push(new Entity(entityId));
        });

        return entities;
    };

    /**
     * Destroy an entity with `entityId`.
     *
     * @param entityId The entity id.
     */
    public static destroyEntity = (entityId: string): void => {
        if (!EntityManager.entities.has(entityId)) return;

        const entity = new Entity(entityId);

        EntityManager.entities.get(entityId)!.forEach((component) => {
            entity.removeComponent(component.constructor);
        });

        EntityManager.entities.delete(entityId);
    };
}

export { EntityManager };
