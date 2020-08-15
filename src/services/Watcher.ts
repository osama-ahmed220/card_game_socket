import User, { UserInterface } from './User';

export interface WatcherInterface extends UserInterface {}

export type WatchersType = { [key: string]: WatcherInterface };

export default class Watcher extends User implements WatcherInterface {}
