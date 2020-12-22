import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Config } from '../config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export abstract class SayingService {
  abstract saying(): Observable<string>;
}

@Injectable()
export class HttpSayingService implements SayingService {
  constructor(public http: HttpClient, private config: Config) {
  }

  saying(): Observable<string> {
    return this.http.get<string>(this.config.sayingURL, { responseType: 'text' as 'json'});
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    return throwError(error);
  }
}
