import { SystemManager } from '../SystemManager';
import { EntityManager } from '../EntityManager';
import { System } from '../System';

class TestComponent {
    value = null;
}

class Test2Component {
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

        expect(SystemManager.systems.size).toBe(1);

        const [system1] = [...SystemManager.systems.values()];

        expect(system1).toBeInstanceOf(System1);
        expect(system1.entities.size).toBe(1);

        SystemManager.add(System2);

        expect(SystemManager.systems.size).toBe(2);

        const [, system2] = [...SystemManager.systems.values()];

        expect(system2).toBeInstanceOf(System2);
        expect(system2.entities.size).toBe(0);
    });

    it('should call onUpdate method of system', () => {
        const [system1] = [...SystemManager.systems.values()];

        const systemOnUpdateSpy = jest.spyOn(system1, 'onUpdate');

        SystemManager.update();

        expect(systemOnUpdateSpy).toHaveBeenCalled();
    });

    it('should return early in handleEntityComponentsChanged if entity does not exist', () => {
        const systemSystemsValuesSpy = jest.spyOn(
            SystemManager.systems,
            'values',
        );

        SystemManager.handleEntityComponentsChanged('inoperative-id');

        expect(systemSystemsValuesSpy).not.toHaveBeenCalled();
    });

    it('should remove entity from system if entity no longer has all components', () => {
        const [system1] = [...SystemManager.systems.values()];

        const systemEntitiesDeleteSpy = jest.spyOn(system1.entities, 'delete');

        entity.removeComponent(TestComponent);

        expect(systemEntitiesDeleteSpy).toHaveBeenCalled();
        expect(system1.entities.size).toBe(0);
    });

    it('should add entity to system if entity has components', () => {
        const [system1] = [...SystemManager.systems.values()];

        const systemEntitiesAddSpy = jest.spyOn(system1.entities, 'add');

        entity.addComponent(TestComponent);

        expect(systemEntitiesAddSpy).toHaveBeenCalled();
    });
});
