import { Injectable } from '@angular/core';
import { ValidateFailItem } from '../api/synthesis-result';
import { CheckEnum, ErrorCodes } from '../api/check';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {


  constructor() { }

  getErrorMsg(failItem: ValidateFailItem): string {
    const check = failItem.check;
    if (check.id === CheckEnum.MIN_WORDS || check.id === CheckEnum.NO_TEXT) {
      return 'Hmm, jei norite, ką nors išgirsti, tai įveskite tekstą.';
    }
    if (check.id === CheckEnum.MAX_WORDS) {
      return 'Straipsnių ir knygų neskaitome, čia tik demonstracija. Įveskite ne daugiau kaip '
        + check.value + ' ' + this.getWordsAsStr(check.value);
    }
    if (check.id === CheckEnum.NO_NUMBERS) {
      return 'Nemokame skaityti skaičių (\'' + failItem.failingText + '\'), parašykite raidėmis';
    }
    if (check.id === CheckEnum.NO_ABBREVIATIONS) {
      return 'Nemokame skaityti sutrumpinimų (\'' + failItem.failingText + '\'), parašykite aiškiau';
    }
    if (check.id === CheckEnum.LITHUANIAN) {
      return 'Nemokame skaityti žodžio (\'' + failItem.failingText + '\'), '
        + 'parašykite lietuviškai. Escribir lituano! Write in Lithuanian! Po litewsku!';
    }
    if (check.id === CheckEnum.PROFANITY) {
      return 'Šlykštoka! Negražu rašyti tokius žodžius (\'' + this.getHalfWord(failItem.failingText) + '\'). '
        + 'Parašykite gražų tekstą!';
    }
    return 'Oi, nesiseka skaityti, pabandykit dar kartą';
  }

  getHalfWord(failingText: string): string {
    const l = (failingText.length / 2) + 1;
    if (l > 1) {
      return failingText.substring(0, l) + '...';
    }
    return failingText;
  }

  getWordsAsStr(value: number): string {
    const i = value % 10;
    if (i === 0) {
      return 'žodžių';
    }
    if (i === 1) {
      return 'žodį';
    }
    return 'žodžius';
  }
}
