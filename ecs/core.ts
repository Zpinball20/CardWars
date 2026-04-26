export type Entity = string;

export abstract class Component {
  entityId: Entity = "";
}

export type ComponentConstructor<T extends Component> = new (...args: any[]) => T;

export class World {
  private entities = new Set<Entity>();
  private components = new Map<string, Map<Entity, Component>>();
  private nextId = 0;

  createEntity(): Entity {
    const id = `entity_${this.nextId++}`;
    this.entities.add(id);
    return id;
  }

  destroyEntity(entity: Entity) {
    this.entities.delete(entity);
    for (const componentMap of this.components.values()) {
      componentMap.delete(entity);
    }
  }

  addComponent<T extends Component>(entity: Entity, component: T): T {
    const componentName = component.constructor.name;
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map());
    }
    component.entityId = entity;
    this.components.get(componentName)!.set(entity, component);
    return component;
  }

  removeComponent<T extends Component>(entity: Entity, componentClass: ComponentConstructor<T>) {
    const componentName = componentClass.name;
    this.components.get(componentName)?.delete(entity);
  }

  getComponent<T extends Component>(entity: Entity, componentClass: ComponentConstructor<T>): T | undefined {
    const componentName = componentClass.name;
    return this.components.get(componentName)?.get(entity) as T;
  }

  hasComponent<T extends Component>(entity: Entity, componentClass: ComponentConstructor<T>): boolean {
    return this.components.get(componentClass.name)?.has(entity) ?? false;
  }

  query(...componentClasses: ComponentConstructor<any>[]): Entity[] {
    if (componentClasses.length === 0) return Array.from(this.entities);

    const firstComponentName = componentClasses[0].name;
    const firstMap = this.components.get(firstComponentName);
    if (!firstMap) return [];

    let result = Array.from(firstMap.keys());

    for (let i = 1; i < componentClasses.length; i++) {
      const name = componentClasses[i].name;
      const map = this.components.get(name);
      if (!map) return [];
      result = result.filter(entity => map.has(entity));
    }

    return result;
  }
}