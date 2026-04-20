export enum CardType{
    CREATURE = "CREATURE",
    SPELL = "SPELL",
    BUILDING = "BUILDING"
}

export class Card{
    id: string;
    name: string;
    cost: number;
    type: CardType;
    attack?: number;
    health?: number;

    constructor(params: {id: string; name: string; cost: number; type: CardType; attack?: number; health?: number}){
        this.id = params.id;
        this.name = params.name;
        this.cost = params.cost;
        this.type = params.type;
        this.attack = params.attack;
        this.health = params.health;
    }
}