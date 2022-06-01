import { SystemManager } from '../SystemManager';
import { Entity } from '../Entity';

class EntityManager {
    /**
     * All entities.
     *
     * @var {Map<string, Map<string, any>>}
     */
    public static readonly entities = new Map<
        string,
        Map<string, InstanceType<any>>
    >();

    /**
     * Create a new entity.
     *
     * @return {Entity}
     */
    public static createEntity = (): Entity => new Entity();

    /**
     * Add `Component` to `entity`.
     *
     * @param {string} entity The entity.
     * @param {T} Component The component.
     * @param {ConstructorParameters<T>} args All arguments for `Component`.
     *
     * @return {void}
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

        SystemManager.handleEntityComponentsChanged(entity);
    };

    /**
     * Remove `Component` from `entity`.
     *
     * @param {string} entity The entity.
     * @param {T} Component The component.
     *
     * @return {void}
     */
    public static removeComponentFromEntity<
        T extends new (...args: any[]) => any,
    >(entity: string, Component: T): void {
        if (!EntityManager.entities.has(entity)) return;

        EntityManager.entities.get(entity)!.delete(Component.name);

        SystemManager.handleEntityComponentsChanged(entity);
    }

    /**
     * Check if `entity` has `Component`.
     *
     * @param {string} entity The entity.
     * @param {T} Component The component.
     *
     * @return {boolean}
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
     * @param {string} entity The entity.
     * @param {T} Component The component.
     *
     * @return {T|null}
     */
    public static getComponentForEntity<T>(
        entity: string,
        Component: new (...args: any[]) => T,
    ): T | null {
        if (!EntityManager.entities.has(entity)) return null;

        return EntityManager.entities.get(entity)!.get(Component.name) ?? null;
    }
}

export { EntityManager };
