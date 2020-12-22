import {Injectable, Inject} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class Config {
    public synthesisURL: string;
    public sayingURL: string;

    constructor() {
        const prefix = '';
        this.synthesisURL = prefix + environment.synthesisURL;
        this.sayingURL = prefix + environment.sayingURL + '/saying';
    }
}
