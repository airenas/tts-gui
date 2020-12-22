import { Injectable } from '@angular/core';

@Injectable()
export abstract class ParamsProviderService {
  text: string;
  abstract setModelID(id: string): void;
  abstract getModelID(): string;
}

@Injectable()
export class LocalStorageParamsProviderService implements ParamsProviderService {
  text: string;
  modelIDLocal: string;

  constructor() { }

  setModelID(id: string): void {
    this.modelIDLocal = id;
    localStorage.setItem('modelID', id);
  }

  getModelID(): string {
    if (this.modelIDLocal == null) {
      this.modelIDLocal = localStorage.getItem('modelID');
    }
    return this.modelIDLocal;
  }
}
