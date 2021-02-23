import { SynthesisResult } from './../api/synthesis-result';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Config } from '../config';
import { throwError, Observable, from } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ErrorCodes } from '../api/check';

@Injectable()
export abstract class SynthesisService {
  abstract synthesize(text: string, model: string, format: string): Observable<SynthesisResult>;
}

@Injectable()
export class HttpSynthesisService implements SynthesisService {

  static handleError(error: HttpErrorResponse): Observable<SynthesisResult> {
    console.log('Handling error');
    console.error(error);
    if (error.status === 400) {
      console.log('Return variable');
      const res = error.error as SynthesisResult;
      return from([res]);
    }
    if (error.status === 401) {
      const res = { error: ErrorCodes.UNAUTHORIZED };
      return from([res]);
    }
    if (error.status === 403) {
      const res = { error: ErrorCodes.OUT_OF_QUOTA };
      return from([res]);
    }
    return throwError(error);
  }

  constructor(public http: HttpClient, private config: Config) {
  }

  synthesize(text: string, model: string, format: string): Observable<SynthesisResult> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    };
    return this.http.post(this.config.synthesisURL + model, { text, outputFormat: format }, httpOptions)
      .map(res => {
        return res as SynthesisResult;
      })
      .catch(e => HttpSynthesisService.handleError(e));
  }
}
