import { Server } from 'socket.io';
import BaseIO from './BaseIO';

export default class StartIO extends BaseIO {

    constructor(io: Server) {
        super(io);
        this.onConnection();
    }

    onConnection = () => {
        this._io.on("connection", (socket) => {
            this._socket = socket;
        });
    };

    
}