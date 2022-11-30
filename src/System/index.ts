abstract class System {
    /**
     * The components this system is processing.
     *
     * @var {(new (...args: any[]) => any)[]}
     */
    public abstract readonly components: (new (...args: any[]) => any)[];

    /**
     * The entities this system is currently processing.
     *
     * @var {Set<string>}
     */
    protected readonly entities: Set<string> = new Set();

    /**
     * Get the entities in this system.
     *
     * @return {Set<string>}
     */
    public getEntities(): Set<string> {
        return this.entities;
    }

    /**
     * Add `entity` to this system.
     *
     * @param {string} entity The entity.
     *
     * @return {void}
     */
    public add(entity: string): void {
        this.entities.add(entity);

        this.onEntityAdded(entity);
    }

    /**
     * Remove `entity` from this system.
     *
     * @param {string} entity The entity.
     *
     * @return {void}
     */
    public remove(entity: string): void {
        this.entities.delete(entity);

        this.onEntityRemoved(entity);
    }

    /**
     * Does this system have `entity`?
     *
     * @param {string} entity The entity.
     *
     * @return {boolean}
     */
    public has(entity: string): boolean {
        return this.entities.has(entity);
    }

    /**
     * Handle an entity being added to this system.
     *
     * @param {string} entity The entity.
     *
     * @return {void}
     */
    public onEntityAdded(entity: string): void {}

    /**
     * Handle an entity being removed from this system.
     *
     * @param {string} entity The entity.
     *
     * @return {void}
     */
    public onEntityRemoved(entity: string): void {}

    /**
     * Called when this system is updated.
     *
     * @return {void}
     */
    public onUpdate(): void {}
}

export { System };
