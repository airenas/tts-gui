import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorCodes } from '../api/check';

@Injectable()
export class UnexpectedErrorService {
  count = 0;

  constructor() { }

  public getErrorMsg(error: string | HttpErrorResponse): string {
    if (!(error instanceof HttpErrorResponse)) {
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
      if (error === 'No text') {
        return 'Neįvestas tekstas';
      }
      if ((error || '').startsWith('Text too long: passed')) {
        const words = error.split(' ');
        if (words.length === 9) {
          const sLen = words[4];
          const sMax = words[8];
          return `Per ilgas tekstas (${sLen} simb.). Jums leidžiama įvesti ${sMax} simbolių`;
        }
      }
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
