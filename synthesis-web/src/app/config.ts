import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Config {
    public synthesisURL: string;
    public sayingURL: string;
    public modelsURL: string;

    constructor() {
        const prefix = '';
        this.init(prefix, '');
    }

    init(serverURL: string, modelsURL: string) {
        this.synthesisURL = serverURL + environment.synthesisURL;
        this.sayingURL = serverURL + environment.sayingURL + '/saying';
        this.modelsURL = serverURL + environment.modelsURL;
        if ((modelsURL ?? '') !== '') {
            this.modelsURL = serverURL + modelsURL;
        }
    }
}
