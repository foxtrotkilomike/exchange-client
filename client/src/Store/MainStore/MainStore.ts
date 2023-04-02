import { action, computed, makeObservable, observable } from 'mobx';

import { ILocalStore } from '../../Types/ILocalStore';
import WSConnector from '../../WSClient';

type PrivateFields = '_connection';

export default class MainStore implements ILocalStore {
  private _connection: WSConnector;

  constructor() {
    makeObservable<MainStore, PrivateFields>(this, {
      _connection: observable,
    });
    this._connection = new WSConnector();
    this._connection.connect();
  }

  destroy = () => {
    this._connection.disconnect();
  };
}
