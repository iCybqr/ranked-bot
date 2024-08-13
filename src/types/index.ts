export type Queue = {
    id: string;
    guild_id: string;
    channel_id: string;
    channel_name: string;
    players: Player[];
    created_at: Date;
};

export type Player = {
    id: string;
    guild_id: string;
    user_id: string;
    mc_uuid: string;
    elo: number;
    created_at: Date;
};

export type ScrimsUserData = {
    _id: string;
    blockhitSounds: boolean;
    cages: string[];
    lastLogin: number;
    lastLogout: number;
    messagePrivacy: "public" | "private" | "friends";
    playtime: number;
    prefix: string;
    privateGames: "public" | "private" | "friends";
    pronouns: string;
    ranked: Record<
        string,
        {
            elo: number;
            games: number;
            wins: number;
        }
    >;
    skillRoll: string;
    spectators: "shown" | "hidden";
    stats: {
        bridge: {
            casual: Record<string, ScrimsGameData>;
            duel: Record<string, ScrimsGameData>;
            ranked: Record<string, ScrimsGameData>;
            private: Record<string, ScrimsGameData>;
        };
        overall: {
            winstreak: number;
            dailyWinstreak: number;
            lifetimeWinstreak: number;
        };
    };
    username: string;
    discordId: string;
};

export type ScrimsGameData = {
    wins: number;
    losses: number;
    games: number;
    kills: number;
    deaths: number;
    playerCausedDeaths: number;
    goals: number;
    blocksPlaced: number;
    blocksBroken: number;
    damageDealt: number;
    gapplesEaten: number;
    arrowsShot: number;
    arrowsHit: number;
    hitsGiven: number;
    hitsTaken: number;
    hitsBlocked: number;
    yLevelSum: number;
    secondsSpentPlaying: number;
    draws: number;
};

export type Game = {
    id: string;
    game_id: string;
    guild_id: string;
    player1_id: string;
    player2_id: string;
    player1_score: number;
    player2_score: number;
    created_at: Date;
};
