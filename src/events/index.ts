import EventEmitter2 from "eventemitter2";

export enum Events {
    DISCORD_READY = "discord.ready",
    DISCORD_COMMAND_REGISTER = "discord.command.register",
    DATABASE_CONNECT = "database.connect",
    DATABASE_INITIATED = "database.initiated",
    DATABASE_QUEUE_CREATE = "database.queue.create",
    DATABASE_PLAYER_CREATE = "database.player.create",
    DATABASE_GAMES_CREATE = "database.games.create",
    QUEUE_PLAYER_ADD = "queue.player.add",
    QUEUE_PLAYER_REMOVE = "queue.player.remove",
    GAME_CREATE = "game.create",
}

const emitter = new EventEmitter2({});

export default emitter;
