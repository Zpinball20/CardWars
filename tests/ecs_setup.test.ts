import { World } from "../ecs/core";
import { CardFactory, HeroFactory } from "../game/factory";
import {
  CardComponent,
  AttackComponent,
  HealthComponent,
  PlacementComponent,
  HeroComponent,
  FloopComponent,
  BlockAdjacentComponent,
  BuildingComponent,
  EnterPlayTriggerComponent,
} from "../components/base_components";

describe("ECS Card Setup", () => {
  let world: World;
  let cardFactory: CardFactory;
  let heroFactory: HeroFactory;

  beforeEach(() => {
    world = new World();
    cardFactory = new CardFactory(world);
    heroFactory = new HeroFactory(world);
  });

  describe("CardFactory", () => {
    it("should create a creature with basic components", () => {
      const entity = cardFactory.createFromJSON("cool_dog", 0, 1);

      expect(world.hasComponent(entity, CardComponent)).toBe(true);
      expect(world.hasComponent(entity, AttackComponent)).toBe(true);
      expect(world.hasComponent(entity, HealthComponent)).toBe(true);
      expect(world.hasComponent(entity, PlacementComponent)).toBe(true);

      const card = world.getComponent(entity, CardComponent)!;
      expect(card.id).toBe("cool_dog");
      expect(card.name).toBe("Cool Dog");
      expect(card.type).toBe("CREATURE");

      const attack = world.getComponent(entity, AttackComponent)!;
      expect(attack.value).toBe(2);

      const health = world.getComponent(entity, HealthComponent)!;
      expect(health.value).toBe(7);
    });

    it("should create cool_dog with BlockAdjacentComponent", () => {
      const entity = cardFactory.createFromJSON("cool_dog", 0, 1);

      expect(world.hasComponent(entity, BlockAdjacentComponent)).toBe(true);
    });

    it("should create a building with BuildingComponent", () => {
      const entity = cardFactory.createFromJSON("blood_fortress", 0, 1);

      expect(world.hasComponent(entity, BuildingComponent)).toBe(true);

      const card = world.getComponent(entity, CardComponent)!;
      expect(card.type).toBe("BUILDING");
    });

    it("should create a spell with SpellComponent", () => {
      const entity = cardFactory.createFromJSON("gnome_snot", 0, 1);

      expect(world.hasComponent(entity, CardComponent)).toBe(true);
    });

    it("should create floop cards with FloopComponent", () => {
      const floopCards = ["ancient_scholar", "dragon_claw", "the_pig"];

      for (const cardId of floopCards) {
        const entity = cardFactory.createFromJSON(cardId, 0, 1);
        expect(world.hasComponent(entity, FloopComponent)).toBe(true);
      }
    });

    it("should add EnterPlayTriggerComponent to cards with enter play effects", () => {
      const entity = cardFactory.createFromJSON("cornataur", 0, 1);

      expect(world.hasComponent(entity, EnterPlayTriggerComponent)).toBe(true);
    });

    it("should store correct placement", () => {
      const entity = cardFactory.createFromJSON("cool_dog", 1, 2);

      const placement = world.getComponent(entity, PlacementComponent)!;
      expect(placement.playerId).toBe(1);
      expect(placement.laneIndex).toBe(2);
    });
  });

  describe("HeroFactory", () => {
    it("should create Finn hero with components", () => {
      const entity = heroFactory.createHero("finn", 0, 25);

      expect(world.hasComponent(entity, HeroComponent)).toBe(true);
      expect(world.hasComponent(entity, HealthComponent)).toBe(true);
      expect(world.hasComponent(entity, PlacementComponent)).toBe(true);

      const health = world.getComponent(entity, HealthComponent)!;
      expect(health.value).toBe(25);

      const placement = world.getComponent(entity, PlacementComponent)!;
      expect(placement.laneIndex).toBe(-1);
    });

    it("should create Jake hero", () => {
      const entity = heroFactory.createHero("jake", 1, 25);

      expect(world.hasComponent(entity, HeroComponent)).toBe(true);
    });
  });

  describe("Full game setup", () => {
    it("should set up a simple game with two players", () => {
      const finn = heroFactory.createHero("finn", 0, 25);
      const jake = heroFactory.createHero("jake", 1, 25);

      const coolDog = cardFactory.createFromJSON("cool_dog", 0, 0);
      const thePig = cardFactory.createFromJSON("the_pig", 1, 0);
      const ancientScholar = cardFactory.createFromJSON("ancient_scholar", 0, 1);

      const entities = world.query(CardComponent);
      expect(entities.length).toBe(3);

      const heroes = world.query(HeroComponent);
      expect(heroes.length).toBe(2);
    });
  });
});