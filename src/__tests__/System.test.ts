import { EntityManager } from '../EntityManager';
import { System } from '../System';

class TestComponent {
    value = null;
}

class System1 extends System {
    components = [TestComponent];

    onUpdate() {
        //
    }
}

describe('System', () => {
    it('should add entities to system', () => {
        const system = new System1();

        expect(system.getEntities().size).toBe(0);

        const entity1 = EntityManager.createEntity();
        const entity2 = EntityManager.createEntity();
        const entity3 = EntityManager.createEntity();

        system.add(entity1.id);
        system.add(entity2.id);
        system.add(entity3.id);

        expect(system.getEntities().size).toBe(3);
    });

    it('should return all entities in system', () => {
        const system = new System1();

        expect(system.getEntities().size).toBe(0);

        const entity1 = EntityManager.createEntity();
        const entity2 = EntityManager.createEntity();
        const entity3 = EntityManager.createEntity();

        system.add(entity1.id);
        system.add(entity2.id);
        system.add(entity3.id);

        expect([...system.getEntities().values()]).toEqual([
            entity1.id,
            entity2.id,
            entity3.id,
        ]);
    });

    it('should remove an entity from the system', () => {
        const system = new System1();

        expect(system.getEntities().size).toBe(0);

        const entity1 = EntityManager.createEntity();
        const entity2 = EntityManager.createEntity();
        const entity3 = EntityManager.createEntity();

        system.add(entity1.id);
        system.add(entity2.id);
        system.add(entity3.id);

        system.remove(entity2.id);

        expect([...system.getEntities().values()]).toEqual([
            entity1.id,
            entity3.id,
        ]);
    });

    it('should be aware of contained entity presence', () => {
        const system = new System1();

        expect(system.getEntities().size).toBe(0);

        const entity1 = EntityManager.createEntity();
        const entity2 = EntityManager.createEntity();
        const entity3 = EntityManager.createEntity();

        system.add(entity1.id);
        system.add(entity2.id);
        system.add(entity3.id);

        system.remove(entity2.id);

        expect(system.has(entity1.id)).toBe(true);
        expect(system.has(entity2.id)).toBe(false);
        expect(system.has(entity3.id)).toBe(true);
    });
});
