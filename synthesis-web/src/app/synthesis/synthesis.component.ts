import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { Model } from '../api/model';
import { SynthesisResult } from '../api/synthesis-result';
import { ErrorService } from '../service/error.service';
import { ModelsService } from '../service/models.service';
import { SayingService } from '../service/saying.service';
import { SynthesisService } from '../service/synthesis.service';
import { Config } from './../config';
import { ParamsProviderService } from './../service/params-provider.service';
import { UnexpectedErrorService } from './../service/unexpected-error.service';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.scss'],
  providers: [UnexpectedErrorService, ErrorService],
})
export class SynthesisComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('service-url') serviceUrl: string;
  // tslint:disable-next-line: no-input-rename
  @Input('partnership-url') partnershipURL: string;
  // tslint:disable-next-line: no-input-rename
  @Input('models-url') modelsUrl: string;
  sending = false;
  sendingModified = false;
  private textInternal: string;
  private textModifiedInternal: string;
  conditionChecked: boolean;
  conditionAllowCollectInternal: boolean;

  errorText: string;
  errorTextModified: string;
  modifiedPanelDisplay: string;
  private modelVar: Model;
  models: Model[];
  audio: HTMLAudioElement;
  audioModified: HTMLAudioElement;
  isFirefox: boolean;
  isTesting: boolean;
  requestID: string;
  textFormat: string;
  speed: number;

  debugMode: boolean;
  debugClick: number;

  constructor(
    protected synthesisService: SynthesisService, protected uErrorService: UnexpectedErrorService,
    protected errorService: ErrorService,
    protected sayingService: SayingService, protected params: ParamsProviderService,
    protected modelsService: ModelsService, protected snackBar: MatSnackBar, protected config: Config) {
    this.isFirefox = params.isFirefox();
    this.isTesting = false;
    this.conditionAllowCollect = false;
    this.textFormat = 'normalized';
    this.debugClick = 0;
    this.debugMode = false;
    this.speed = 100;
  }

  ngOnInit() {
    console.log('Version=' + environment.version);
    // console.log("ServiceURL=" + this.serviceURL)
    if (this.serviceUrl !== '') {
      this.config.init(this.serviceUrl, this.modelsUrl);
    }
    this.conditionChecked = false;
    this.errorText = '';
    if (this.params.text == null) {
      this.nextText();
    } else {
      this.text = this.params.text;
    }
    this.initModels();
    console.log('Partnerystės URL: ' + this.partnershipURL);
  }

  synthesize() {
    this.sending = true;
    this.errorText = '';

    this.synthesisService.synthesize({
      text: this.text, model: this.model.url, allowCollect: this.conditionAllowCollect,
      textFormat: this.textFormat, speed: this.calcSpeedValue(this.speed), voice: this.model.voice
    })
      .subscribe(
        result => {
          this.sending = false;
          this.onResult(result);
        },
        error => {
          this.sending = false;
          this.errorText = this.uErrorService.getErrorMsg(error);
          console.error(error);
        }
      );
  }

  synthesizeModified() {
    this.sendingModified = true;
    this.errorTextModified = '';

    this.synthesisService.synthesizeCustom({
      text: this.textModified, model: this.model.url, request: this.requestID, speed: this.calcSpeedValue(this.speed),
      voice: this.model.voice

    })
      .subscribe(
        result => {
          this.sendingModified = false;
          this.onResultModified(result);
        },
        error => {
          this.sendingModified = false;
          this.errorTextModified = this.uErrorService.getErrorMsg(error);
          console.error(error);
        }
      );
  }

  nextText() {
    this.sayingService.saying().subscribe(
      result => {
        console.log('got saying: ' + result);
        this.text = result;
        this.clearPlayer();
      },
      error => {
        console.error(error);
      }
    );
  }

  onResult(result: SynthesisResult): void {
    if (result.validationFailItems && result.validationFailItems.length > 0) {
      this.errorText = this.errorService.getErrorMsg(result.validationFailItems[0]);
    } else if (result.error && result.error !== '') {
      this.errorText = this.uErrorService.getErrorMsg(result.error);
    } else if (result.message && result.message !== '') {
      this.errorText = this.uErrorService.getErrorMsg(result.message);
    } else {
      this.uErrorService.clear();
      const audio = document.getElementById('player') as HTMLAudioElement;
      audio.src = 'data:audio/mp3;base64,' + result.audioAsString;
      if (!this.isTesting) {
        audio.play();
      }
      this.audio = audio;
      this.textModified = result.text;
      this.requestID = result.requestID;
    }
  }

  onResultModified(result: SynthesisResult): void {
    console.log('on result');
    if (result.validationFailItems && result.validationFailItems.length > 0) {
      this.errorTextModified = this.errorService.getErrorMsg(result.validationFailItems[0]);
    } else if (result.error && result.error !== '') {
      this.errorTextModified = this.uErrorService.getErrorMsg(result.error);
    } else if (result.message && result.message !== '') {
      this.errorTextModified = this.uErrorService.getErrorMsg(result.message);
    } else {
      this.uErrorService.clear();
      const audio = document.getElementById('playerModified') as HTMLAudioElement;
      audio.src = 'data:audio/mp3;base64,' + result.audioAsString;
      if (!this.isTesting) {
        audio.play();
      }
      this.audioModified = audio;
    }
  }

  initModels() {
    this.modelsService.models().subscribe(
      result => { this.setModels(result); },
      () => { this.showError('Nepavyko gauti modelių sąrašo.', ''); }
    );
  }

  setModels(models: Model[]) {
    this.models = models;
    if (models.length > 0) {
      const oldID = this.params.getModelID();
      let select = models.filter(x => x.id === oldID);
      if (select.length > 0) {
        this.model = select[0];
        return;
      }
      select = models.filter(x => x.default);
      if (select.length > 0) {
        this.model = select[0];
        return;
      }
      if (models.length > 0) {
        this.model = models[0];
      }
    }
  }

  get canSynthesize(): boolean {
    return !this.sending && this.text && this.text.trim() !== '' && this.model && this.conditionChecked;
  }

  get canSynthesizeModified(): boolean {
    return !this.sendingModified && this.textModified && this.textModified.trim() !== '' && this.model
      && this.conditionChecked && this.conditionAllowCollect && (this.requestID || '') !== '';
  }

  get conditionAllowCollect(): boolean {
    return this.conditionAllowCollectInternal;
  }

  set conditionAllowCollect(value: boolean) {
    this.conditionAllowCollectInternal = value;
    this.modifiedPanelDisplay = value ? 'block' : 'none';
  }

  get text(): string {
    return this.textInternal;
  }

  set text(value: string) {
    this.textInternal = value;
    this.params.text = value;
  }

  get textModified(): string {
    return this.textModifiedInternal;
  }

  set textModified(value: string) {
    this.textModifiedInternal = value;
  }

  clearPlayer(): void {
    const audio = document.getElementById('player') as HTMLAudioElement;
    if (audio) {
      audio.src = '';
    }
  }

  clickModel(model: Model) {
    this.model = model;
  }

  get model(): Model {
    return this.modelVar;
  }

  set model(model: Model) {
    this.params.setModelID(model?.id);
    this.modelVar = model;
  }

  showError(msg: string, error: any) {
    console.error('Error', error);
    this.snackBar.open(this.asString(msg, error), null, { duration: 3000 });
  }

  asString(msg: string, error: any): string {
    return msg + ' ' + String(error);
  }

  debugModeClick(): void {
    this.debugClick++;
    if (!this.debugMode && this.debugClick > 5) {
      this.debugMode = true;
      this.snackBar.open('Debug režimas įjungtas', 'Info', { duration: 3000 });
    }
  }

  calcSpeedValue(v: number): number {
    let r = v;
    if (v < 100) {
      r = 2 - v / 100;
    } else {
      r = 1 - (v - 100) / 200;
    }
    console.log(v, r);
    return r;
  }

  formatSpeed(v: number): string {
    let r = v;
    if (v < 100) {
      r = 50 + (v / 2);
    }
    console.log(v, r);
    return r + '%';
  }

  conditionClick() {
    this.conditionChecked = !this.conditionChecked;
  }
}
