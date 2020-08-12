import { Socket } from 'socket.io';
import SocketInfoInterface from '../interfaces/SocketInfoInterface';

export default class BaseSocket {
    protected _socket: Socket;
    protected _socketInfo: SocketInfoInterface;
}