import { Server } from 'socket.io';
import BaseSocket from './BaseSocket';

export default abstract class BaseIO extends BaseSocket {
    protected _io: Server

    constructor(io: Server) {
        super();
        this._io = io;
    }
}