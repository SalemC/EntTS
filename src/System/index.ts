abstract class System {
    /**
     * The entities this system is currently processing.
     *
     * @var {Set<string>}
     */
    public readonly entities: Set<string> = new Set();

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

export { System };
