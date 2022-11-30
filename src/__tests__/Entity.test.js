import { EntityManager } from '../EntityManager';
import { Entity } from '../Entity';

class TestComponent {
    value = null;
}

class TestComponent2 {
    value2 = null;
}

class TestComponent3 {
    value3 = null;

    constructor(x, y) {
        //
    }
}

describe('Entity', () => {
    it('should be valid', () => {
        const entity = new Entity();

        expect(typeof entity.id).toBe('string');

        expect(entity.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );

        entity.destroy();
    });

    it('should add components', () => {
        const entity = new Entity();

        const entityManagerAddComponentToEntitySpy = jest.spyOn(
            EntityManager,
            'addComponentToEntity',
        );

        entity.addComponent(TestComponent);

        expect(entityManagerAddComponentToEntitySpy).toHaveBeenCalled();
        expect(entityManagerAddComponentToEntitySpy).toHaveBeenCalledWith(
            entity.id,
            TestComponent,
        );

        entity.addComponent(TestComponent2);

        expect(entity.hasComponent(TestComponent)).toBe(true);
        expect(entity.hasComponent(TestComponent2)).toBe(true);
        expect(entity.hasComponent(TestComponent3)).toBe(false);

        entity.addComponent(TestComponent3, 'test', 1);

        expect(entityManagerAddComponentToEntitySpy).toHaveBeenCalledTimes(3);
        expect(entityManagerAddComponentToEntitySpy).toHaveBeenCalledWith(
            entity.id,
            TestComponent3,
            'test',
            1,
        );

        entity.destroy();
    });

    it('should return existing component', () => {
        const entity = new Entity();

        const entityManagerGetComponentForEntitySpy = jest.spyOn(
            EntityManager,
            'getComponentForEntity',
        );

        entity.addComponent(TestComponent);
        entity.addComponent(TestComponent2);

        const component1 = entity.getComponent(TestComponent);

        expect(component1).toBeInstanceOf(TestComponent);

        expect(entityManagerGetComponentForEntitySpy).toHaveBeenCalled();
        expect(entityManagerGetComponentForEntitySpy).toHaveBeenCalledWith(
            entity.id,
            TestComponent,
        );

        entity.destroy();
    });

    it('should throw if duplicate component is added', () => {
        let entity = null;

        expect(() => {
            entity = new Entity();

            entity.addComponent(TestComponent);
            entity.addComponent(TestComponent);
        }).toThrow('Entity already has this component.');

        entity.destroy();
    });

    it('should remove a component', () => {
        const entity = new Entity();

        const entityManagerRemoveComponentFromEntitySpy = jest.spyOn(
            EntityManager,
            'removeComponentFromEntity',
        );

        entity.addComponent(TestComponent);
        entity.addComponent(TestComponent2);

        entity.removeComponent(TestComponent);

        expect(entityManagerRemoveComponentFromEntitySpy).toHaveBeenCalled();
        expect(entityManagerRemoveComponentFromEntitySpy).toHaveBeenCalledWith(
            entity.id,
            TestComponent,
        );

        expect(entity.hasComponent(TestComponent)).toBe(false);
        expect(entity.hasComponent(TestComponent2)).toBe(true);
        expect(entity.hasComponents(TestComponent, TestComponent2)).toBe(false);

        entity.destroy();
    });

    it('should be destroyed', () => {
        const entity = new Entity();

        const entityManagerDestroyEntitySpy = jest.spyOn(
            EntityManager,
            'destroyEntity',
        );

        entity.destroy();

        expect(entityManagerDestroyEntitySpy).toHaveBeenCalled();
        expect(entityManagerDestroyEntitySpy).toHaveBeenCalledWith(entity.id);
    });
});
