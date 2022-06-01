import { EntityManager } from '../EntityManager';
import { SystemManager } from '../SystemManager';
import { Entity } from '../Entity';

class TestComponent {
    value = null;
}

class UnusedComponent {
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

        entitiesGetSpy.mockClear();
    });
});
