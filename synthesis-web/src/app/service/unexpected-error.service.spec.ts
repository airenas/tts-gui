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
});
