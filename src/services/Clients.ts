import SocketInfoInterface from "../interfaces/SocketInfoInterface";

export default class Clients {
    private _clients: SocketInfoInterface[] = [];

    get clients() {
        return this._clients;
    }

    newCLient = (client: SocketInfoInterface) => {
        if(this._clients.length < 1) {
            this._clients = [client];
        } else {
            this._clients.push(client);
        }
    };


}