import { EntityManager } from '../EntityManager';
import { System } from '../System';

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
        for (const [
            entity,
            entityComponents,
        ] of EntityManager.entities.entries()) {
            if (
                system.components.every((component) =>
                    entityComponents.has(component.name),
                )
            ) {
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
     * @param {string} entity The entity.
     *
     * @return {void}
     */
    public static handleEntityComponentsChanged(entity: string): void {
        if (!EntityManager.entities.has(entity)) return;

        for (const system of SystemManager.systems) {
            if (system.entities.has(entity)) continue;

            if (
                system.components.every((component) =>
                    EntityManager.entities.get(entity)!.has(component.name),
                )
            ) {
                system.entities.add(entity);
            }
        }
    }
}

export { SystemManager };
