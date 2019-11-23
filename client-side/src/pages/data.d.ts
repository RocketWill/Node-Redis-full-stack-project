export interface PokemonInfo {
    id: number;
    profile: {
        weight: number;
        height: number;
        abilities: {
            name?: string;
            utl?: string;
        }[];
    };
    held_items: {
        name?: string;
        url?: string;
    }[];
    stats: {
        name?: string;
        value?: number;
    }[];
    sprite: string;
    name: string;
    types: {
        name?: string;
        url?: string;
    }[];
}
