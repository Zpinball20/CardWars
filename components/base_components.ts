import { Component } from "../ecs/core";

export class CardComponent extends Component {
  constructor(
    public id: string,
    public name: string,
    public cost: number,
    public type: string,
    public landscape: string,
    public description?: string
  ) {
    super();
  }
}

export class AttackComponent extends Component {
  constructor(public value: number) {
    super();
  }
}

export class HealthComponent extends Component {
  constructor(public value: number, public maxValue?: number) {
    super();
  }
}

export class PlacementComponent extends Component {
  constructor(public playerId: number, public laneIndex: number) {
    super();
  }
}

export class HeroComponent extends Component {
  constructor(public playerId: number) {
    super();
  }
}

export class FloopComponent extends Component {
  public isFlooped: boolean = false;
}

export class BlockAdjacentComponent extends Component {}

export class BuildingComponent extends Component {}

export class SpellComponent extends Component {}

export class FacedownLandscapeComponent extends Component {}

export class EnterPlayTriggerComponent extends Component {}

export class LeavePlayTriggerComponent extends Component {}

export class TurnStartTriggerComponent extends Component {}

export class LaneChangeComponent extends Component {
  public changedThisTurn: boolean = false;
}

export class AttackModifierComponent extends Component {
  constructor(public modifier: number, public source?: string) {
    super();
  }
}

export class DefenseModifierComponent extends Component {
  constructor(public modifier: number, public source?: string) {
    super();
  }
}

export class SpellCastCounterComponent extends Component {
  public count: number = 0;
}

export class ActionPointComponent extends Component {
  constructor(public points: number) {
    super();
  }
}

export class OwnerComponent extends Component {
  constructor(public playerId: number) {
    super();
  }
}

export class OriginalStatsComponent extends Component {
  constructor(
    public attack: number,
    public health: number
  ) {
    super();
  }
}

export class FinnGrantFloopComponent extends Component {}

export class JakeFacedownBuffComponent extends Component {}

export class LaneBuffComponent extends Component {
  constructor(
    public attackBonus: number = 0,
    public defenseBonus: number = 0
  ) {
    super();
  }
}

export class DiscardPileComponent extends Component {
  constructor(public cards: string[] = []) {
    super();
  }
}

export class HandComponent extends Component {
  constructor(public cards: string[] = []) {
    super();
  }
}

export class AttackEventComponent extends Component {
  public cancelled: boolean = false;
  constructor(public targetEntity: string, public damage: number) {
    super();
  }
}

export class SpelledComponent extends Component {}

export class FloopHandlerComponent extends Component {
  constructor(public handlerId: string) {
    super();
  }
}

export class EnterPlayHandlerComponent extends Component {
  constructor(public handlerId: string) {
    super();
  }
}

export class LeavePlayHandlerComponent extends Component {
  constructor(public handlerId: string) {
    super();
  }
}

export class HeroAbilityComponent extends Component {
  constructor(public abilityId: string, public params?: Record<string, any>) {
    super();
  }
}