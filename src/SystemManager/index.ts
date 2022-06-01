import { EntityManager } from '../EntityManager';
import { System } from '../System';

class SystemManager {
    /**
     * All active systems.
     *
     * @var {Map<string, System>}
     */
    public static readonly systems = new Map<string, System>();

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

        SystemManager.systems.set(SystemClass.name, system);
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
     *
     * @return {void}
     */
    public static handleEntityComponentsChanged(entity: string): void {
        if (!EntityManager.entities.has(entity)) return;

        for (const system of SystemManager.systems.values()) {
            const systemHasEntity = system.entities.has(entity);

            const hasAllComponents = system.components.every((component) =>
                EntityManager.entities.get(entity)!.has(component.name),
            );

            if (hasAllComponents && !systemHasEntity) {
                system.entities.add(entity);
            } else if (!hasAllComponents && systemHasEntity) {
                system.entities.delete(entity);
            }
        }
    }
}

export { SystemManager };
