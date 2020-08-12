import SocketInfoInterface from "../interfaces/SocketInfoInterface";

export default class Watchers {
    private _watchers: {[key: string]: SocketInfoInterface[]};
    // private _watchersList: SocketInfoInterface[] = [];

    addNew = (game_id: string, clientInfo: SocketInfoInterface) => {
        if(!(game_id in this._watchers)) {
            // watcher list not exists
            this._watchers[game_id] = [clientInfo];
        } else {
            this._watchers[game_id].push(clientInfo);
        }
    };

    get watchers() {
        return this._watchers;
    }

    getGameWatchers = (game_id: string) => {
        return this._watchers[game_id];
    }
}