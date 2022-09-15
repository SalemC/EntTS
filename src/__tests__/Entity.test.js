import { EntityManager } from '../EntityManager';
import { Entity } from '../Entity';

class TestComponent {
    value = null;
}

class TestComponent2 {
    value2 = null;
}

describe('Entity', () => {
    const entity = new Entity();

    it('should be valid', () => {
        expect(typeof entity.id).toBe('string');

        expect(entity.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );
    });

    it('should add a component', () => {
        entity.addComponent(TestComponent);

        expect(entity.hasComponent(TestComponent)).toBe(true);
    });

    it('should return existing component', () => {
        const component = entity.getComponent(TestComponent);

        expect(component).toBeInstanceOf(TestComponent);
    });

    it('should throw if duplicate component is added', () => {
        expect(() => {
            entity.addComponent(TestComponent);
        }).toThrow();
    });

    it('should add a second component', () => {
        entity.addComponent(TestComponent2);

        expect(entity.hasComponent(TestComponent2)).toBe(true);
    });

    it('should have both components', () => {
        expect(entity.hasComponents(TestComponent, TestComponent)).toBe(true);
    });

    it('should remove a component', () => {
        entity.removeComponent(TestComponent);

        expect(entity.hasComponent(TestComponent)).toBe(false);
        expect(entity.hasComponents(TestComponent, TestComponent)).toBe(false);
    });

    it('should be destroyed', () => {
        const entityManagerDestroyEntitySpy = jest.spyOn(
            EntityManager,
            'destroyEntity',
        );

        expect(EntityManager.entities.size).toBe(1);

        entity.destroy();

        expect(entityManagerDestroyEntitySpy).toHaveBeenCalled();
        expect(EntityManager.entities.size).toBe(0);
    });
});
