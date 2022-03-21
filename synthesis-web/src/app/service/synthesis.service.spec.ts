import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorCodes } from '../api/check';
import { Config } from '../config';
import { HttpSynthesisService, SynthesisService } from './synthesis.service';


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
      error: { message: 'No text' }
    });
    HttpSynthesisService.handleError(err).subscribe(
      result => {
        expect(result.message).toEqual('No text');
        done();
      },
      () => {
        fail('Unexpected error');
        done();
      }
    );
  });

  it('handle 401', (done) => {
    const err = new HttpErrorResponse({ status: 401 });
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
    const err = new HttpErrorResponse({ status: 403 });
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
    const err = new HttpErrorResponse({ status: 500 });
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

describe('Change endpoint', () => {
  it('changes', () => {
    expect(HttpSynthesisService.changeEndpoint('olia/synthesize')).toEqual('olia/synthesizeCustom');
    expect(HttpSynthesisService.changeEndpoint('/synthesize')).toEqual('/synthesizeCustom');
  });
  it('leaves', () => {
    expect(HttpSynthesisService.changeEndpoint('/olia')).toEqual('/olia');
    expect(HttpSynthesisService.changeEndpoint('')).toEqual('');
  });
});

describe('make headers', () => {
  it('should make no key header', () => {
    const got = HttpSynthesisService.makeHeaders('');
    expect(got.get('Accept')).toEqual('application/json');
    expect(got.get('Authorization')).toBeNull();
  });
  it('should add key header', () => {
    const got = HttpSynthesisService.makeHeaders('olia');
    expect(got.get('Accept')).toEqual('application/json');
    expect(got.get('Authorization')).toEqual('Key olia');
  });
  it('should encode in ascii', () => {
    const got = HttpSynthesisService.makeHeaders('oliašš');
    expect(got.get('Authorization')).toEqual('Key olia%C5%A1%C5%A1');
  });
});
