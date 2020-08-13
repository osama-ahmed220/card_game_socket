import User, { UserInterface } from "./User";

export interface WatcherInterface extends UserInterface {}

export default class Watcher extends User implements WatcherInterface {}
