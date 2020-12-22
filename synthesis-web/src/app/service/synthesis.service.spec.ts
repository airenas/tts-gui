import { ValidateFailItem } from './../api/synthesis-result';
import { TestBed } from '@angular/core/testing';

import { SynthesisService, HttpSynthesisService } from './synthesis.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Config } from '../config';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorCodes } from '../api/check';

describe('SynthesisService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [Config,
      { provide: SynthesisService, useClass: HttpSynthesisService }]
  }));

  it('should be created', () => {
    const service: SynthesisService = TestBed.inject(SynthesisService);
    expect(service).toBeTruthy();
  });
});

describe('Handle error', () => {
  it('handle 400', (done) => {
    const err = new HttpErrorResponse({
      status: 400,
      error: { validationFailItems: [{ check: { id: 'olia' } }] }
    });
    HttpSynthesisService.handleError(err).subscribe(
      result => {
        expect(result.validationFailItems[0].check.id).toEqual('olia');
        done();
      },
      () => {
        fail('Unexpected error');
        done();
      }
    );
  });

  it('handle 401', (done) => {
    const err = new HttpErrorResponse({   status: 401  });
    HttpSynthesisService.handleError(err).subscribe(
      result => {
        expect(result.error).toEqual(ErrorCodes.UNAUTHORIZED);
        done();
      },
      () => {
        fail('Unexpected error');
        done();
      }
    );
  });

  it('handle 403', (done) => {
    const err = new HttpErrorResponse({   status: 403  });
    HttpSynthesisService.handleError(err).subscribe(
      result => {
        expect(result.error).toEqual(ErrorCodes.OUT_OF_QUOTA);
        done();
      },
      () => {
        fail('Unexpected error');
        done();
      }
    );
  });

  it('handle error', (done) => {
    const err = new HttpErrorResponse({   status: 500  });
    HttpSynthesisService.handleError(err).subscribe(
      () => {
        fail('Unexpected result returned');
        done();
      },
      () => {
        done();
      }
    );
  });
});
