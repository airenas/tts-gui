import { Check } from './../api/synthesis-result';
import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { ValidateFailItem } from '../api/synthesis-result';
import { CheckEnum } from '../api/check';

describe('ErrorService', () => {
  let service: ErrorService;

  function testError(failItem: ValidateFailItem, expectedText: string) {
    expect(service.getErrorMsg(failItem)).toEqual(expectedText);
  }

  function newVFI(check: Check, failingText: string = null): ValidateFailItem {
    return { check, failingText };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test no word error', () => {
    testError(newVFI({ id: CheckEnum.MIN_WORDS }), 'Hmm, jei norite, ką nors išgirsti, tai įveskite tekstą.');
  });

  it('test no text', () => {
    testError(newVFI({ id: CheckEnum.NO_TEXT }), 'Hmm, jei norite, ką nors išgirsti, tai įveskite tekstą.');
  });

  it('test to long error', () => {
    testError(newVFI({ id: CheckEnum.MAX_WORDS, value: 5 }), 'Straipsnių ir knygų neskaitome, čia tik demonstracija. ' +
      'Įveskite ne daugiau kaip 5 žodžius');
    testError(newVFI({ id: CheckEnum.MAX_WORDS, value: 20 }), 'Straipsnių ir knygų neskaitome, čia tik demonstracija. ' +
      'Įveskite ne daugiau kaip 20 žodžių');
    testError(newVFI({ id: CheckEnum.MAX_WORDS, value: 21 }), 'Straipsnių ir knygų neskaitome, čia tik demonstracija. ' +
      'Įveskite ne daugiau kaip 21 žodį');
  });

  it('test no LT error', () => {
    testError(newVFI({ id: CheckEnum.LITHUANIAN }, 'olia'), 'Nemokame skaityti žodžio (\'olia\'), parašykite lietuviškai.' +
      ' Escribir lituano! Write in Lithuanian! Po litewsku!');
  });

  it('test no Abbreviations error', () => {
    testError(newVFI({ id: CheckEnum.NO_ABBREVIATIONS }, 'VDU'), 'Nemokame skaityti sutrumpinimų (\'VDU\'), parašykite aiškiau');
  });
  it('test no Numbers error', () => {
    testError(newVFI({ id: CheckEnum.NO_NUMBERS }, '10'), 'Nemokame skaityti skaičių (\'10\'), parašykite raidėmis');
  });
  it('test Profanity error', () => {
    testError(newVFI({ id: CheckEnum.PROFANITY }, 'Pyypt'), 'Šlykštoka! Negražu rašyti tokius žodžius (\'Pyy...\'). ' +
      'Parašykite gražų tekstą!');
    testError(newVFI({ id: CheckEnum.PROFANITY }, 'a'), 'Šlykštoka! Negražu rašyti tokius žodžius (\'a...\'). ' +
      'Parašykite gražų tekstą!');
    testError(newVFI({ id: CheckEnum.PROFANITY }, 'ab'), 'Šlykštoka! Negražu rašyti tokius žodžius (\'ab...\'). ' +
      'Parašykite gražų tekstą!');
    testError(newVFI({ id: CheckEnum.PROFANITY }, 'abc'), 'Šlykštoka! Negražu rašyti tokius žodžius (\'ab...\'). ' +
      'Parašykite gražų tekstą!');
    testError(newVFI({ id: CheckEnum.PROFANITY }, 'abcd'), 'Šlykštoka! Negražu rašyti tokius žodžius (\'abc...\'). ' +
      'Parašykite gražų tekstą!');
    testError(newVFI({ id: CheckEnum.PROFANITY }, 'abcde'), 'Šlykštoka! Negražu rašyti tokius žodžius (\'abc...\'). ' +
      'Parašykite gražų tekstą!');
  });
  it('test default error', () => {
    testError(newVFI({ id: 'any' }), 'Oi, nesiseka skaityti, pabandykit dar kartą');
  });
});
