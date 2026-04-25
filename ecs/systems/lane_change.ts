import { World } from "../core";
import { CardComponent, PlacementComponent, LaneChangeComponent, AttackModifierComponent } from "../../components/base_components";

export class LaneChangeSystem {
  constructor(private world: World) {}

  handle(entityId: string, fromLane: number, toLane: number) {
    const card = this.world.getComponent(entityId, CardComponent);
    if (!card) return;

    const placement = this.world.getComponent(entityId, PlacementComponent);
    if (!placement) return;

    if (!this.world.hasComponent(entityId, LaneChangeComponent)) {
      this.world.addComponent(entityId, new LaneChangeComponent());
    }

    const laneChange = this.world.getComponent(entityId, LaneChangeComponent)!;
    laneChange.changedThisTurn = true;

    switch (card.id) {
      case "punk_cat":
      case "woadic_marauder":
        console.log(`${entityId}: Creature changed lanes, apply +2 ATK`);
        if (!this.world.hasComponent(entityId, AttackModifierComponent)) {
          this.world.addComponent(entityId, new AttackModifierComponent(2, card.id));
        }
        break;
    }
  }
}