import { Injectable } from '@angular/core';

@Injectable()
export abstract class ParamsProviderService {
  text: string;
  abstract setModelID(id: string): void;
  abstract getModelID(): string;
  abstract isFirefox(): boolean;
}

@Injectable()
export class LocalStorageParamsProviderService implements ParamsProviderService {
  text: string;
  modelIDLocal: string;
  isFirefoxInt?: boolean = undefined;

  constructor() { }

  isFirefox(): boolean {
    console.log('IsFirefox = ', this.isFirefoxInt);
    if (this.isFirefoxInt === undefined) {
      this.isFirefoxInt = navigator.userAgent.indexOf('Firefox') !== -1;
    }
    console.log('IsFirefox = ', this.isFirefoxInt);
    return this.isFirefoxInt;
  }

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
