import { GameState } from "../game/state";
import { Player } from "../game/player";
import { applyAction, addPlayer } from "../game/engine";
import { ActionType } from "../game/actions";
import { getCard } from "../db/cards";
import { Hero } from "../game/hero";
import { LandscapeType, Landscape } from "../game/landscapes";

describe("Game Lifecycle E2E", () => {
    let state: GameState;

    beforeEach(() => {
        state = new GameState();
        
        const p1 = new Player();
        const h1 = new Hero("finn_id", "Finn", [LandscapeType.BLUE_PLAINS, LandscapeType.BLUE_PLAINS, LandscapeType.BLUE_PLAINS, LandscapeType.BLUE_PLAINS]);
        p1.setHero(h1);
        p1.hand.push(getCard("cool_dog")!); // 2 ATK
        p1.hand.push(getCard("ancient_scholar")!); // 1 ATK
        p1.hand.push(getCard("cool_dog")!); // 2 ATK
        p1.hand.push(getCard("ancient_scholar")!); // 1 ATK
        
        const p2 = new Player();
        const h2 = new Hero("jake_id", "Jake", [LandscapeType.CORNFIELDS, LandscapeType.CORNFIELDS, LandscapeType.CORNFIELDS, LandscapeType.CORNFIELDS]);
        p2.setHero(h2);
        p2.hand.push(getCard("the_pig")!); // 1 ATK
        p2.hand.push(getCard("the_pig")!); // 1 ATK
        p2.hand.push(getCard("the_pig")!); // 1 ATK
        p2.hand.push(getCard("the_pig")!); // 1 ATK

        addPlayer(state, p1);
        addPlayer(state, p2);
    });

    test("should take a turn", () => {
        //turn 1 (P1)
        applyAction(state, {
            type: ActionType.END_TURN,
            player: 0
        })

        expect(state.currentPlayer).toBe(1)
    });

    //Be able to play a card
    test("should remove a card from hand", () => {
        //turn 1 (P1)
        applyAction(state, {
            type: ActionType.PLAY_CARD,
            player: 0,
            card: state.players[0].hand[0]
        })

        expect(state.players[0].hand.length).toBe(3)
        expect(state.players[0].landscapes[0].card[0].id).toBe("cool_dog")

    });

    /*test("should run a full game simulation from start to 0 HP victory", () => {
        // --- TURN 1 (P1) ---
        applyAction(state, {
            type: ActionType.PLAY_CARD,
            player: 0,
            card: getCard("cool_dog")!
        });

        applyAction(state, {
            type: ActionType.END_TURN,
            player: 0
        });

        // P2 takes 2 damage (HP: 23)
        expect(state.players[1].health).toBe(23);

        // --- TURN 2 (P2) ---
        applyAction(state, {
            type: ActionType.PLAY_CARD,
            player: 1,
            card: getCard("the_pig")!
        });

        applyAction(state, {
            type: ActionType.END_TURN,
            player: 1
        });

        // P1 takes 1 damage (HP: 24)
        expect(state.players[0].health).toBe(24);

        // --- TURN 3 (P1) ---
        // P1 plays second creature to increase damage output
        applyAction(state, {
            type: ActionType.PLAY_CARD,
            player: 0,
            card: getCard("ancient_scholar")!
        });

        applyAction(state, {
            type: ActionType.END_TURN,
            player: 0
        });

        // P2 takes 2 (Cool Dog) + 1 (Ancient Scholar) = 3 damage (HP: 20)
        expect(state.players[1].health).toBe(20);

        // --- TURN 4 (P2) ---
        applyAction(state, {
            type: ActionType.END_TURN,
            player: 1
        });
        // P1 takes 1 damage (HP: 23)
        expect(state.players[0].health).toBe(23);

        // --- TURNS 5-16 (Simulating the grind) ---
        // P2 takes 3 damage every P1 turn.
        // T5 (P1): 20 - 3 = 17
        // T7 (P1): 17 - 3 = 14
        // T9 (P1): 14 - 3 = 11
        // T11 (P1): 11 - 3 = 8
        // T13 (P1): 8 - 3 = 5
        // T15 (P1): 5 - 3 = 2
        // T17 (P1): 2 - 3 = -1 -> 0
        
        for (let i = 0; i < 6; i++) {
            // P1 Turn
            applyAction(state, { type: ActionType.END_TURN, player: 0 });
            // P2 Turn
            applyAction(state, { type: ActionType.END_TURN, player: 1 });
        }

        // Final P1 Turn to clinch victory
        applyAction(state, { type: ActionType.END_TURN, player: 0 });

        expect(state.players[1].health).toBeLessThanOrEqual(0);
        expect(state.winner).toBe(0); // Player 1 (Cool Guy) wins!
    });*/
});
