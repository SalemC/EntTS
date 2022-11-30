import { EntityManager } from '../EntityManager';
import { SystemManager } from '../SystemManager';
import { Entity } from '../Entity';

class TestComponent {
    value = null;
}

class UnusedComponent {
    value = null;
}

class TestComponent2 {
    value = null;
}

const entitiesGetSpy = jest.spyOn(EntityManager.entities, 'get');

beforeEach(() => {
    entitiesGetSpy.mockClear();
});

describe('EntityManager', () => {
    it('should create a valid entity', () => {
        expect(EntityManager.entities.size).toBe(0);

        const entity = EntityManager.createEntity();

        // Shouldn't record the entity until it has at least 1 component.
        expect(EntityManager.entities.size).toBe(0);

        expect(typeof entity.id).toBe('string');

        entity.addComponent(TestComponent);

        expect(EntityManager.entities.size).toBe(1);
        expect(entity.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );

        entity.destroy();
    });

    it('should return early in removeComponentFromEntity if entity does not exist', () => {
        const entity = EntityManager.createEntity();

        const handleEntityComponentsChangedSpy = jest.spyOn(
            SystemManager,
            'handleEntityComponentsChanged',
        );

        entity.removeComponent(TestComponent);

        expect(handleEntityComponentsChangedSpy).not.toHaveBeenCalled();

        expect(EntityManager.entities.size).toBe(0);

        entity.destroy();
    });

    it('should return early in entityHasComponent if entity does not exist', () => {
        const entity = new Entity('inoperative-id');

        entity.hasComponent(TestComponent);

        expect(entitiesGetSpy).not.toHaveBeenCalled();

        entitiesGetSpy.mockClear();

        entity.destroy();
    });

    it('should return early in getComponentForEntity if entity does not exist', () => {
        const entity = new Entity('inoperative-id');

        entity.getComponent(TestComponent);

        expect(entitiesGetSpy).not.toHaveBeenCalled();

        entitiesGetSpy.mockClear();

        entity.destroy();
    });

    it('should return null in getComponentForEntity if entity does not have component', () => {
        const entity = EntityManager.createEntity();

        entity.addComponent(TestComponent);

        const entitiesGetComponentGetSpy = jest.spyOn(
            EntityManager.entities.get(entity.id)!,
            'get',
        );

        expect(entity.getComponent(UnusedComponent)).toBe(null);

        expect(entitiesGetComponentGetSpy).toHaveBeenCalledWith(
            UnusedComponent.name,
        );

        entity.destroy();
    });

    it('should return 0 entities in getAllEntitiesWithComponents if not all components exist', () => {
        const entity = EntityManager.createEntity();

        entity.addComponent(TestComponent);

        const entityComponentsHasSpy = jest.spyOn(
            EntityManager.entities.get(entity.id)!,
            'has',
        );

        const result = EntityManager.getAllEntitiesWithComponents(
            TestComponent,
            UnusedComponent,
        );

        expect(entityComponentsHasSpy).toHaveBeenCalled();
        expect(result.length).toBe(0);

        entity.destroy();
    });

    it('should return 1 entities in getAllEntitiesWithComponents if only 1 entity exists with all components', () => {
        const entity = EntityManager.createEntity();
        const newEntity = EntityManager.createEntity();

        entity.addComponent(TestComponent);
        entity.addComponent(TestComponent2);

        newEntity.addComponent(TestComponent2);
        newEntity.addComponent(UnusedComponent);

        const result = EntityManager.getAllEntitiesWithComponents(
            TestComponent,
            TestComponent2,
        );

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(entity.id);

        entity.destroy();
        newEntity.destroy();
    });

    it('should return early in destroyEntity if entity does not exist', () => {
        EntityManager.destroyEntity('inoperative-id');

        expect(entitiesGetSpy).not.toHaveBeenCalled();
    });
});
