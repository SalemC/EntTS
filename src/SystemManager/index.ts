import { EntityManager } from '../EntityManager';
import { System } from '../System';

class SystemManager {
    /**
     * All active systems.
     */
    private static readonly systems = new Map<new () => System, System>();

    /**
     * Add a system.
     *
     * @param SystemClass The system class.
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
     * @param SystemClass The system class.
     */
    public static get(SystemClass: new () => System): System | undefined {
        return SystemManager.systems.get(SystemClass);
    }

    /**
     * Get all registered systems.
     */
    public static getAll(): Map<new () => System, System> {
        return SystemManager.systems;
    }

    /**
     * Handle updating all systems.
     */
    public static update(): void {
        for (const system of SystemManager.systems.values()) {
            system.onUpdate();
        }
    }

    /**
     * Handle an entity's components changing.
     *
     * @param entity The entity.
     * @param Component The component.
     * @param action The action.
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
