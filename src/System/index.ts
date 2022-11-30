abstract class System {
    /**
     * The components this system is processing.
     */
    public abstract readonly components: (new (...args: any[]) => any)[];

    /**
     * The entities this system is currently processing.
     */
    protected readonly entities: Set<string> = new Set();

    /**
     * Get the entities in this system.
     */
    public getEntities(): Set<string> {
        return this.entities;
    }

    /**
     * Add `entity` to this system.
     *
     * @param entity The entity.
     */
    public add(entity: string): void {
        this.entities.add(entity);

        this.onEntityAdded(entity);
    }

    /**
     * Remove `entity` from this system.
     *
     * @param entity The entity.
     */
    public remove(entity: string): void {
        this.entities.delete(entity);

        this.onEntityRemoved(entity);
    }

    /**
     * Does this system have `entity`?
     *
     * @param entity The entity.
     */
    public has(entity: string): boolean {
        return this.entities.has(entity);
    }

    /**
     * Handle an entity being added to this system.
     *
     * @param entity The entity.
     */
    public onEntityAdded(entity: string): void {}

    /**
     * Handle an entity being removed from this system.
     *
     * @param entity The entity.
     */
    public onEntityRemoved(entity: string): void {}

    /**
     * Called when this system is updated.
     */
    public onUpdate(): void {}
}

export { System };
