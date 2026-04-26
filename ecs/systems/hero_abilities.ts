import { World, Entity } from "../core";
import {
  PlacementComponent,
  FloopComponent,
  AttackComponent,
  HeroAbilityComponent,
  OwnerComponent,
  AttackModifierComponent,
  FacedownLandscapeComponent,
} from "../../components/base_components";

export class HeroAbilitySystem {
  private handlers: Map<string, (heroId: Entity, playerId: number) => void> = new Map();

  constructor(private world: World) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.handlers.set('grant_floop_if_zero_attack', (heroId, playerId) => {
      const playerCards = this.world.query(AttackComponent, PlacementComponent);
      for (const cardId of playerCards) {
        const cardPlacement = this.world.getComponent(cardId, PlacementComponent);
        const attack = this.world.getComponent(cardId, AttackComponent);
        if (cardPlacement?.playerId === playerId && attack?.value === 0) {
          if (!this.world.hasComponent(cardId, FloopComponent)) {
            this.world.addComponent(cardId, new FloopComponent());
            console.log(`Hero ${heroId} granted Floop to card ${cardId} (0 attack)`);
          }
        }
      }
    });

    this.handlers.set('buff_facedown_landscapes', (heroId, playerId) => {
      const landscapes = this.world.query(FacedownLandscapeComponent, PlacementComponent, OwnerComponent);
      for (const landscapeId of landscapes) {
        const owner = this.world.getComponent(landscapeId, OwnerComponent);
        if (owner?.playerId === playerId) {
          const existing = this.world.getComponent(landscapeId, AttackModifierComponent);
          if (existing) {
            existing.modifier += 2;
            existing.source = "hero";
          } else {
            this.world.addComponent(landscapeId, new AttackModifierComponent(2, "hero"));
          }
        }
      }
    });
  }

  update() {
    const heros = this.world.query(HeroAbilityComponent, PlacementComponent);

    for (const heroId of heros) {
      const heroAbility = this.world.getComponent(heroId, HeroAbilityComponent);
      const placement = this.world.getComponent(heroId, PlacementComponent);
      if (!heroAbility || !placement) continue;

      const handler = this.handlers.get(heroAbility.abilityId);
      if (handler) {
        handler(heroId, placement.playerId);
      }
    }
  }
}