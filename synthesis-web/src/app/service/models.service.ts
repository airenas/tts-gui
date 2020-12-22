import { Config } from './../config';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Model } from '../api/model';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export abstract class ModelsService {
  abstract models(): Observable<Model[]>;
}

@Injectable()
export class HttpModelsService implements ModelsService {
  config: Config;
  constructor(public http: HttpClient, config: Config) {
    this.config = config;
  }

  models(): Observable<Model[]> {
    return this.loadModels(this.config.modelsURL);
  }

  loadModels(url: string): Observable<Model[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    };
    return this.http.get(url, httpOptions)
      .map(res => {
        return res as Model[];
      })
      .catch(e => throwError(e));
  }
}
