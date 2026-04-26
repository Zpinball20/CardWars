import { World } from "../ecs/core";
import { CardFactory } from "../game/factory";
import { CombatSystem } from "../ecs/systems";
import {
  AttackComponent,
  HealthComponent,
  PlacementComponent,
  AttackEventComponent,
  BlockAdjacentComponent,
} from "../components/base_components";

describe("Cool Dog Defense", () => {
  let world: World;
  let factory: CardFactory;
  let combatSystem: CombatSystem;

  beforeEach(() => {
    world = new World();
    factory = new CardFactory(world);
    combatSystem = new CombatSystem(world);
  });

  it("blocks attack on creature in adjacent enemy lane (with creature)", () => {
    // P1 Lane 1: Enemy Cool Dog 
    factory.createFromJSON("cool_dog", 1, 1);

    // P0 Lane 1: Our creature attacks lane 2
    const attacker = world.createEntity();
    world.addComponent(attacker, new AttackComponent(3));
    world.addComponent(attacker, new HealthComponent(5));
    world.addComponent(attacker, new PlacementComponent(0, 1));

    // P1 Lane 2: Enemy creature (has AttackComponent = creature)
    const target = world.createEntity();
    world.addComponent(target, new HealthComponent(5));
    world.addComponent(target, new AttackComponent(1)); // Creature
    world.addComponent(target, new PlacementComponent(1, 2));

    world.addComponent(attacker, new AttackEventComponent(target, 3));
    combatSystem.update();

    // Blocked - creature at lane 2 adjacent to Cool Dog at lane 1
    const targetHealth = world.getComponent(target, HealthComponent);
    expect(targetHealth?.value).toBe(5);
  });

  it("allows attack on creature in non-adjacent lane", () => {
    // P1 Lane 0: Enemy Cool Dog
    factory.createFromJSON("cool_dog", 1, 0);

    // P0 Lane 1: Attacker
    const attacker = world.createEntity();
    world.addComponent(attacker, new AttackComponent(3));
    world.addComponent(attacker, new HealthComponent(5));
    world.addComponent(attacker, new PlacementComponent(0, 1));

    // P1 Lane 2: Target creature (not adjacent to lane 0)
    const target = world.createEntity();
    world.addComponent(target, new HealthComponent(5));
    world.addComponent(target, new AttackComponent(1));
    world.addComponent(target, new PlacementComponent(1, 2));

    world.addComponent(attacker, new AttackEventComponent(target, 3));
    combatSystem.update();

    // Goes through
    const targetHealth = world.getComponent(target, HealthComponent);
    expect(targetHealth?.value).toBe(2);
  });
});