import { v4 as uuidv4 } from 'uuid';

import { EntityManager } from '../EntityManager';

class Entity {
    /**
     * @param {string} id This entity's unique identifier.
     */
    public constructor(public readonly id: string = uuidv4()) {}

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

export { Entity };
