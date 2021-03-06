import { Injectable } from '@angular/core';
import { ErrorCodes } from '../api/check';

@Injectable()
export class UnexpectedErrorService {
  count = 0;

  constructor() { }

  public getErrorMsg(error: string): string {
    if (error === ErrorCodes.UNAUTHORIZED) {
      return 'Neturite teisių?';
    }
    if (error === ErrorCodes.OUT_OF_QUOTA) {
      return 'Baigėsi limitas';
    }
    if (error === 'RequestID not found') {
      return 'Nerastas užklausos ID';
    }
    if (error === 'Original text does not match the modified') {
      return 'Pakoreguotas tekstas skiriasi nuo originalaus';
    }
    if ((error || '').startsWith('Bad accents:')) {
      return 'Blogas kirtis: ' + error.substr('Bad accents: '.length);
    }
    this.count++;
    console.log('err count = ', this.count);
    if (this.count <= 2) {
      return 'Oi, nesiseka skaityti, pabandykit dar kartą';
    }
    if (this.count <= 4) {
      return 'Oi, nesiseka skaityti, pabandykit kitą tekstą';
    }
    return 'Oi, nesiseka šiandien. Gal užeikit vėliau...';
  }

  public clear(): void {
    this.count = 0;
  }
}
