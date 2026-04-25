import { World } from "../core";
import {
  LaneChangeComponent,
  AttackModifierComponent,
  DefenseModifierComponent,
  SpellCastCounterComponent,
} from "../../components/base_components";

export class TurnEndSystem {
  constructor(private world: World) {}

  handle() {
    const laneChanges = this.world.query(LaneChangeComponent);
    for (const entityId of laneChanges) {
      const laneChange = this.world.getComponent(entityId, LaneChangeComponent);
      if (laneChange) {
        laneChange.changedThisTurn = false;
      }
    }

    const attackMods = this.world.query(AttackModifierComponent);
    for (const entityId of attackMods) {
      this.world.removeComponent(entityId, AttackModifierComponent);
    }

    const defenseMods = this.world.query(DefenseModifierComponent);
    for (const entityId of defenseMods) {
      this.world.removeComponent(entityId, DefenseModifierComponent);
    }

    const spellCounters = this.world.query(SpellCastCounterComponent);
    for (const entityId of spellCounters) {
      const counter = this.world.getComponent(entityId, SpellCastCounterComponent);
      if (counter) {
        counter.count = 0;
      }
    }
  }
}