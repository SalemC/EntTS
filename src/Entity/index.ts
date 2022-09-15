import { v4 as uuidv4 } from 'uuid';

import { EntityManager } from '../EntityManager';

class Entity {
    /**
     * Create an entity.
     *
     * @param {string} id The entity's unique identifier.
     */
    constructor(public readonly id: string = uuidv4()) {}

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
     * Remove `Component` from this entity.
     *
     * @param {T} Component The component.
     *
     * @return {this}
     */
    public removeComponent<T extends new (...args: any[]) => any>(
        Component: T,
    ): this {
        EntityManager.removeComponentFromEntity(this.id, Component);

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
     * Check if this entity has all `components`.
     *
     * @param {(new (...args: any[]) => any)[]} components The components.
     *
     * @return {boolean}
     */
    public hasComponents(
        ...components: (new (...args: any[]) => any)[]
    ): boolean {
        return components.every((component) => this.hasComponent(component));
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

    /**
     * Destroy this entity.
     *
     * @return {void}
     */
    public destroy(): void {
        EntityManager.destroyEntity(this.id);
    }
}

export { Entity };
