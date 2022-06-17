import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ErrorCodes } from '../api/check';
import { UnexpectedErrorService } from './unexpected-error.service';


describe('UnexpectedErrorService', () => {
  let service: UnexpectedErrorService;

  function run(times: number) {
    for (; times > 0; times--) {
      service.getErrorMsg('');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnexpectedErrorService]
    });
    service = TestBed.inject(UnexpectedErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('return same error on clear', () => {
    const e = service.getErrorMsg('');
    run(4);
    service.clear();
    expect(service.getErrorMsg('')).toEqual(e);
  });

  it('return diff error on aditional request', () => {
    const e = service.getErrorMsg('');
    run(2);
    expect(service.getErrorMsg('')).not.toEqual(e);
  });

  it('return diff error several aditional request', () => {
    run(2);
    const e = service.getErrorMsg('');
    run(5);
    expect(service.getErrorMsg('')).not.toEqual(e);
  });

  it('return Unauthorized', () => {
    expect(service.getErrorMsg(ErrorCodes.UNAUTHORIZED)).toEqual('Neturite teisių?');
  });

  it('return Quota', () => {
    expect(service.getErrorMsg(ErrorCodes.OUT_OF_QUOTA)).toEqual('Baigėsi limitas');
  });

  it('no request', () => {
    expect(service.getErrorMsg('RequestID not found')).toEqual('Nerastas užklausos ID');
  });

  it('bad accent', () => {
    expect(service.getErrorMsg('Bad accents: [olia, aaa]')).toEqual('Blogas kirtis: [olia, aaa]');
    expect(service.getErrorMsg('Bad accents: [o{l~}ia]')).toEqual('Blogas kirtis: [o{l~}ia]');
  });
  it('bad symbols', () => {
    expect(service.getErrorMsg('Wrong symbols: `olia`')).toEqual('Blogi simboliai: `olia`');
  });

  it('text differs', () => {
    expect(service.getErrorMsg('Original text does not match the modified')).toEqual('Pakoreguotas tekstas skiriasi nuo originalaus');
  });

  it('no text', () => {
    expect(service.getErrorMsg('No text')).toEqual('Neįvestas tekstas');
  });

  it('too long', () => {
    expect(service.getErrorMsg('Text too long: passed 652 chars, max allowed 200'))
    .toEqual('Per ilgas tekstas (652 simb.). Jums leidžiama įvesti 200 simbolių');
  });

  it('text HttpErrorResponse', () => {
    expect(service.getErrorMsg(new HttpErrorResponse({ status: 403 }))).toEqual('Oi, nesiseka skaityti, pabandykit dar kartą');
  });

  it('SSML', () => {
    expect(service.getErrorMsg('ssml: 20: unknown tag <pp>')).toEqual('SSML klaida (pozicija 20): nežinoma žyma <pp>');
  });

  it('ssmlToLt', () => {
    expect(service.ssmlToLt('unknown tag <pp>')).toEqual('nežinoma žyma <pp>');
    expect(service.ssmlToLt('unknown voice aa')).toEqual('nežinomas diktorius aa');
    expect(service.ssmlToLt('no <voice>:name')).toEqual('nenurodyta <voice>:name');
    expect(service.ssmlToLt('no <prosody>:rate')).toEqual('nenurodyta <prosody>:rate');
    expect(service.ssmlToLt('data after </speak>')).toEqual('duomenys po </speak>');
    expect(service.ssmlToLt('data in <break>')).toEqual('duomenys žymoje <break>');
  });
});
