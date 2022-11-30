import { EntityManager } from '../EntityManager';
import { System } from '../System';

class SystemManager {
    /**
     * All active systems.
     *
     * @var {Map<System>}
     */
    private static readonly systems = new Map<new () => System, System>();

    /**
     * Add a system.
     *
     * @param {new () => System} SystemClass The system class.
     *
     * @return {void}
     */
    public static add(SystemClass: new () => System): void {
        if (SystemManager.systems.has(SystemClass)) {
            throw new Error(
                "You're attempting to add the same system twice, please remove the duplicate add call.",
            );
        }

        const system = new SystemClass();

        // Place all current entities with all matching components into the system.
        for (const [
            entity,
            entityComponents,
        ] of EntityManager.entities.entries()) {
            const hasEveryComponent = system.components.every((component) =>
                entityComponents.has(component.name),
            );

            if (hasEveryComponent) system.add(entity);
        }

        SystemManager.systems.set(SystemClass, system);
    }

    /**
     * Get an added system.
     *
     * @param {new () => System} SystemClass The system class.
     *
     * @return {System|undefined}
     */
    public static get(SystemClass: new () => System): System | undefined {
        return SystemManager.systems.get(SystemClass);
    }

    /**
     * Handle updating all systems.
     *
     * @return {void}
     */
    public static update(): void {
        for (const system of SystemManager.systems.values()) {
            system.onUpdate();
        }
    }

    /**
     * Handle an entity's components changing.
     *
     * @param {string} entity The entity.
     * @param {T} Component The component.
     * @param {'added' | 'removed'} action The action.
     *
     * @return {void}
     */
    public static handleEntityComponentsChanged<
        T extends new (...args: any[]) => any,
    >(entity: string, Component: T, action: 'added' | 'removed'): void {
        if (!EntityManager.entities.has(entity)) return;

        const entityComponents = EntityManager.entities.get(entity)!;

        for (const system of SystemManager.systems.values()) {
            // If a component has just been removed, we can just check if
            // the system also has that component, and if so, we know the entity
            // can't have all components in the system.
            const hasAllComponents =
                action === 'removed'
                    ? !system.components.includes(Component)
                    : system.components.every((component) =>
                          entityComponents.has(component.name),
                      );

            if (system.has(entity)) {
                if (action === 'removed' && !hasAllComponents) {
                    system.remove(entity);
                }
            } else {
                if (action === 'added' && hasAllComponents) {
                    system.add(entity);
                }
            }
        }
    }
}

export { SystemManager };
