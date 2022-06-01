import { Entity } from '../Entity';

class TestComponent {
    value = null;
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

    it('should remove a component', () => {
        entity.removeComponent(TestComponent);

        expect(entity.hasComponent(TestComponent)).toBe(false);
    });
});
