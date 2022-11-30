import { SystemManager } from '../SystemManager';
import { EntityManager } from '../EntityManager';
import { System } from '../System';

class TestComponent {
    value = null;
}

class Test2Component {
    value = null;
}

class Test3Component {
    value = null;
}

class System1 extends System {
    components = [TestComponent];

    onUpdate() {
        //
    }
}

class System2 extends System {
    components = [Test2Component];

    onUpdate() {
        //
    }
}

describe('SystemManager', () => {
    const entity = EntityManager.createEntity();

    entity.addComponent(TestComponent);

    it('should create system and add existing entities to system', () => {
        SystemManager.add(System1);

        const systems = SystemManager.getAll();

        expect(systems.size).toBe(1);

        const [system1] = [...systems.values()];

        expect(system1).toBeInstanceOf(System1);
        expect(system1.getEntities().size).toBe(1);

        SystemManager.add(System2);

        expect(systems.size).toBe(2);

        const [, system2] = [...systems.values()];

        expect(system2).toBeInstanceOf(System2);
        expect(system2.getEntities().size).toBe(0);
    });

    it('should throw when adding the same system twice', () => {
        expect(() => {
            SystemManager.add(System1);
        }).toThrow(
            "You're attempting to add the same system twice, please remove the duplicate add call.",
        );
    });

    it('should call onUpdate method of system', () => {
        const [system1] = [...SystemManager.getAll().values()];

        const systemOnUpdateSpy = jest.spyOn(system1, 'onUpdate');

        SystemManager.update();

        expect(systemOnUpdateSpy).toHaveBeenCalled();
    });

    it('should return early in handleEntityComponentsChanged if entity does not exist', () => {
        const systemSystemsValuesSpy = jest.spyOn(
            SystemManager.getAll(),
            'values',
        );

        SystemManager.handleEntityComponentsChanged(
            'inoperative-id',
            TestComponent,
            'added',
        );

        expect(systemSystemsValuesSpy).not.toHaveBeenCalled();
    });

    it('should not call remove on system if component does not exist for entity', () => {
        const [system1] = [...SystemManager.getAll().values()];

        const systemRemoveSpy = jest.spyOn(system1, 'remove');

        SystemManager.handleEntityComponentsChanged(
            entity.id,
            Test3Component,
            'removed',
        );

        expect(systemRemoveSpy).not.toHaveBeenCalled();
    });

    it('should remove entity from system if entity no longer has all components', () => {
        const [system1] = [...SystemManager.getAll().values()];

        const systemEntitiesRemoveSpy = jest.spyOn(system1, 'remove');

        entity.removeComponent(TestComponent);

        expect(systemEntitiesRemoveSpy).toHaveBeenCalled();
        expect(systemEntitiesRemoveSpy).toHaveBeenCalledWith(entity.id);
        expect(system1.getEntities().size).toBe(0);
    });

    it('should add entity to system if entity now has all components', () => {
        const [system1] = [...SystemManager.getAll().values()];

        const systemEntitiesAddSpy = jest.spyOn(system1, 'add');

        entity.addComponent(TestComponent);

        expect(systemEntitiesAddSpy).toHaveBeenCalled();
        expect(systemEntitiesAddSpy).toHaveBeenCalledWith(entity.id);
        expect(system1.getEntities().size).toBe(1);
    });

    it('should return an added system', () => {
        const [system1] = [...SystemManager.getAll().values()];

        expect(SystemManager.get(System1)).toBe(system1);
        expect(SystemManager.get(System1)).toBeInstanceOf(System1);
    });

    it('should return all systems', () => {
        const systems = SystemManager.getAll();

        expect(systems.size).toBe(2);
        expect(SystemManager.get(System1)).not.toBeNull();
        expect(SystemManager.get(System2)).not.toBeNull();
    });
});
