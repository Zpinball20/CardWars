import { World, Entity } from "../core";
import {
  CardComponent,
  PlacementComponent,
  FloopComponent,
  FloopHandlerComponent,
} from "../../components/base_components";

type HandlerFn = (entity: Entity, placement: PlacementComponent) => void;

export class FloopAbilitySystem {
  private handlers: Map<string, HandlerFn> = new Map();

  constructor(private world: World) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.handlers.set('return_rainbow_discard', (e, p) => console.log(`${e}: Return rainbow from discard`));
    this.handlers.set('destroy_building', (e, p) => console.log(`${e}: Destroy building in lane`));
    this.handlers.set('flip_facedown', (e, p) => console.log(`${e}: Flip facedown landscape`));
    this.handlers.set('move_creature', (e, p) => console.log(`${e}: Move creature`));
    this.handlers.set('draw_per_flooped', (e, p) => console.log(`${e}: Draw per flooped`));
    this.handlers.set('spell_from_discard', (e, p) => console.log(`${e}: Spell from discard`));
    this.handlers.set('damage_per_landscape', (e, p) => console.log(`${e}: Damage per cornfield`));
    this.handlers.set('copy_floop', (e, p) => console.log(`${e}: Copy floop`));
    this.handlers.set('move_adjacent', (e, p) => console.log(`${e}: Move adjacent`));
  }

  handleFloop(entityId: string) {
    const card = this.world.getComponent(entityId, CardComponent);
    if (!card) return;

    const floop = this.world.getComponent(entityId, FloopComponent);
    if (floop?.isFlooped) return;

    const placement = this.world.getComponent(entityId, PlacementComponent);
    if (!placement) return;

    // Find handler component
    const handler = this.world.getComponent(entityId, FloopHandlerComponent);
    if (handler && this.handlers.has(handler.handlerId)) {
      this.handlers.get(handler.handlerId)!(entityId, placement);
    }

    // Mark as flooped
    if (floop) {
      floop.isFlooped = true;
    } else {
      this.world.addComponent(entityId, new FloopComponent());
      this.world.getComponent(entityId, FloopComponent)!.isFlooped = true;
    }
  }
}