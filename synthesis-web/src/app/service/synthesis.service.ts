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
  abstract synthesize(text: string, model: string, allowCollect: boolean): Observable<SynthesisResult>;
  abstract synthesizeCustom(text: string, model: string, request: string): Observable<SynthesisResult>;
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

  synthesize(text: string, model: string, allowCollect: boolean): Observable<SynthesisResult> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    };
    return this.http.post(this.config.synthesisURL + model,
      { text, allowCollectData: allowCollect, outputTextFormat: (allowCollect ? 'normalized' : 'none') }, httpOptions)
      .map(res => {
        return res as SynthesisResult;
      })
      .catch(e => HttpSynthesisService.handleError(e));
  }

  synthesizeCustom(text: string, model: string, request: string): Observable<SynthesisResult> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      }),
      params: { requestID: request }
    };
    const modelCustom = this.changeEndpoint(model)
    return this.http.post(this.config.synthesisURL + modelCustom,
      { text }, httpOptions)
      .map(res => {
        return res as SynthesisResult;
      })
      .catch(e => HttpSynthesisService.handleError(e));
  }
  
  changeEndpoint(model: string): string {
    if (model.endsWith('synthesize')) {
      return model + 'Custom'
    }
    console.error('Wrong synthesize method ' + model)
  }
}
