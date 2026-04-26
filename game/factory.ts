import {Component, ComponentConstructor, Entity, World} from "../ecs/core";
import * as Components from "../components/base_components";
import * as fs from "fs";
import * as path from "path";

export class CardFactory {
    protected static componentRegistry = new Map<string, ComponentConstructor<any>>();
    protected cardsDir = path.join(process.cwd(), "db", "cards");

    static {
        for (const [name, exportValue] of Object.entries(Components)) {
            if (typeof exportValue === "function" && exportValue.prototype instanceof Component) {
                const snakeName = name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
                this.registerComponent(snakeName, exportValue as ComponentConstructor<any>);
            }
        }
    }

    constructor(protected world: World) {
    }

    static registerComponent(name: string, constructor: ComponentConstructor<any>) {
        this.componentRegistry.set(name, constructor);
    }

    createFromJSON(cardId: string, playerId: number, laneIndex: number): Entity {
        const jsonPath = path.join(this.cardsDir, `${cardId}.json`);
        if (!fs.existsSync(jsonPath)) throw new Error(`Card definition not found: ${cardId}`);

        const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        const entity = this.world.createEntity();

        this.world.addComponent(entity, new Components.CardComponent(
            data.id,
            data.name,
            data.cost,
            data.type,
            data.landscape,
            data.description
        ));

        if (data.attack !== undefined) {
            this.world.addComponent(entity, new Components.AttackComponent(data.attack));
            this.world.addComponent(entity, new Components.OriginalStatsComponent(data.attack, data.health));
        }
        if (data.health !== undefined) {
            this.world.addComponent(entity, new Components.HealthComponent(data.health, data.health));
        }
        this.world.addComponent(entity, new Components.PlacementComponent(playerId, laneIndex));
        this.world.addComponent(entity, new Components.OwnerComponent(playerId));

        this.inferComponents(entity, data);

        return entity;
    }

    protected inferComponents(entity: Entity, data: any) {
        this.addDynamicComponents(entity, data.components);
    }

    protected addDynamicComponents(entity: Entity, components: any[]) {
        if (!components) return;
        for (const comp of components) {
            let compName = comp;

            if (typeof comp === "object") {
                compName = comp.type;
            }

            const Ctor = CardFactory.componentRegistry.get(compName);
            if (Ctor) {
                this.world.addComponent(entity, new Ctor());
            } else {
                console.warn(`Unknown component: ${compName}`);
            }
        }
    }
}

export class HeroFactory extends CardFactory {
    private heroesDir = path.join(process.cwd(), "db", "heroes");

    createHero(heroId: string, playerId: number, initialHealth: number): Entity {
        const jsonPath = path.join(this.heroesDir, `${heroId}.json`);
        if (!fs.existsSync(jsonPath)) throw new Error(`Hero definition not found: ${heroId}`);

        const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        const entity = this.world.createEntity();

        this.world.addComponent(entity, new Components.HeroComponent(playerId));
        this.world.addComponent(entity, new Components.HealthComponent(initialHealth, initialHealth));
        this.world.addComponent(entity, new Components.PlacementComponent(playerId, -1));
        this.world.addComponent(entity, new Components.OwnerComponent(playerId));

        this.inferComponents(entity, data);

        return entity;
    }
}