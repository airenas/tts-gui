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
      if ((error || '').startsWith('ssml:')) {
        let err = error.substring(5).trim();
        const index = err.indexOf(':');
        let posStr = '';
        if (index > 0) {
          const txt = err.substring(0, index);
          const pos = parseInt(txt, 10);
          if (!isNaN(pos)) {
            posStr = ' (pozicija ' + pos + ')';
            err = err.substring(index + 1).trim();
            err = this.ssmlToLt(err);
          }
        }
        return 'SSML klaida' + posStr + ': ' + err;
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

  ssmlToLt(err: string): string {
    let res = err.replace(/^no /, 'nenurodyta ');
    res = res.replace(/^unknown tag /, 'nežinoma žyma ');
    res = res.replace(/^wrong /, 'blogas ');
    res = res.replace(/^data after /, 'duomenys po ');
    res = res.replace(/^unknown voice /, 'nežinomas diktorius ');
    res = res.replace(/^data in /, 'duomenys žymoje ');
    return res;
  }
}


