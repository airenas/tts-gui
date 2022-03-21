import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ErrorCodes } from '../api/check';
import { Config } from '../config';
import { SynthesisResult } from './../api/synthesis-result';

@Injectable()
export abstract class SynthesisService {
  abstract synthesize(params: SynthParams): Observable<SynthesisResult>;
  abstract synthesizeCustom(params: SynthParams): Observable<SynthesisResult>;
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

  static changeEndpoint(model: string): string {
    if (model.endsWith('synthesize')) {
      return model + 'Custom';
    }
    console.error('Wrong synthesize method ' + model);
    return model;
  }

  constructor(public http: HttpClient, private config: Config) {
  }

  synthesize(params: SynthParams): Observable<SynthesisResult> {
    const httpOptions = {
      headers: HttpSynthesisService.makeHeaders(params.key)
    };
    return this.http.post(this.config.synthesisURL + params.model,
      {
        text: params.text, saveRequest: params.allowCollect,
        outputTextFormat: (params.allowCollect ? params.textFormat : 'none'),
        speed: params.speed, voice: params.voice
      }, httpOptions)
      .map(res => {
        return res as SynthesisResult;
      })
      .catch(e => HttpSynthesisService.handleError(e));
  }

  synthesizeCustom(params: SynthParams): Observable<SynthesisResult> {
    const httpOptions = {
      headers: HttpSynthesisService.makeHeaders(params.key),
      params: { requestID: params.request }
    };
    const modelCustom = HttpSynthesisService.changeEndpoint(params.model);
    return this.http.post(this.config.synthesisURL + modelCustom,
      { text: params.text, speed: params.speed, voice: params.voice }, httpOptions)
      .map(res => {
        return res as SynthesisResult;
      })
      .catch(e => HttpSynthesisService.handleError(e));
  }

  static makeHeaders(key: string | null): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    if (key !== '') {
      headers = headers.append('Authorization', 'Key ' + encodeURI(key));
    }
    return headers
  }
}

export interface SynthParams {
  text?: string;
  model?: string;
  voice?: string;
  allowCollect?: boolean;
  textFormat?: string;
  request?: string;
  speed?: number;
  key?: string;
}
