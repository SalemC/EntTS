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
    const entity = EntityManager.createEntity();

    it('should create a valid entity', () => {
        expect(typeof entity.id).toBe('string');

        expect(entity.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );
    });

    it('should return early in removeComponentFromEntity if entity does not exist', () => {
        const handleEntityComponentsChangedSpy = jest.spyOn(
            SystemManager,
            'handleEntityComponentsChanged',
        );

        entity.removeComponent(TestComponent);

        expect(handleEntityComponentsChangedSpy).not.toHaveBeenCalled();

        expect(EntityManager.entities.size).toBe(0);
    });

    it('should return early in entityHasComponent if entity does not exist', () => {
        new Entity('inoperative-id').hasComponent(TestComponent);

        expect(entitiesGetSpy).not.toHaveBeenCalled();

        entitiesGetSpy.mockClear();
    });

    it('should return early in getComponentForEntity if entity does not exist', () => {
        new Entity('inoperative-id').getComponent(TestComponent);

        expect(entitiesGetSpy).not.toHaveBeenCalled();

        entitiesGetSpy.mockClear();
    });

    it('should return null in getComponentForEntity if entity does not have component', () => {
        entity.addComponent(TestComponent);

        const entitiesGetComponentGetSpy = jest.spyOn(
            EntityManager.entities.get(entity.id),
            'get',
        );

        expect(entity.getComponent(UnusedComponent)).toBeNull();

        expect(entitiesGetComponentGetSpy).toHaveBeenCalledWith(
            UnusedComponent.name,
        );
    });

    it('should return 0 entities in getAllEntitiesWithComponents if not all components exist', () => {
        const entityComponentsHasSpy = jest.spyOn(
            EntityManager.entities.get(entity.id),
            'has',
        );

        const result = EntityManager.getAllEntitiesWithComponents(
            TestComponent,
            UnusedComponent,
        );

        expect(entityComponentsHasSpy).toHaveBeenCalled();
        expect(result.length).toBe(0);
    });

    it('should return 1 entities in getAllEntitiesWithComponents if only 1 entity exists with all components', () => {
        const newEntity = EntityManager.createEntity();

        newEntity.addComponent(TestComponent2);
        newEntity.addComponent(UnusedComponent);

        entity.addComponent(TestComponent2);

        const result = EntityManager.getAllEntitiesWithComponents(
            TestComponent,
            TestComponent2,
        );

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(entity.id);
    });

    it('should return early in destroyEntity if entity does not exist', () => {
        EntityManager.destroyEntity('inoperative-id');

        expect(entitiesGetSpy).not.toHaveBeenCalled();
    });
});
