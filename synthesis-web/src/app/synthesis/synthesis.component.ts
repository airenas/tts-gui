import { Config } from './../config';
import { ParamsProviderService } from './../service/params-provider.service';
import { UnexpectedErrorService } from './../service/unexpected-error.service';
import { Component, Input, OnInit } from '@angular/core';
import { SynthesisService } from '../service/synthesis.service';
import { SynthesisResult } from '../api/synthesis-result';
import { ErrorService } from '../service/error.service';
import { SayingService } from '../service/saying.service';
import { Model } from '../api/model';
import { ModelsService } from '../service/models.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.scss'],
  providers: [UnexpectedErrorService, ErrorService],
})
export class SynthesisComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('service-url') serviceUrl: string;
  sending = false;
  private textInternal: string;
  conditionChecked: boolean;
  errorText: string;
  private modelVar: Model;
  models: Model[];
  audio: HTMLAudioElement;

  constructor(
    protected synthesisService: SynthesisService, protected uErrorService: UnexpectedErrorService,
    protected errorService: ErrorService,
    protected sayingService: SayingService, protected params: ParamsProviderService,
    protected modelsService: ModelsService, protected snackBar: MatSnackBar, protected config: Config) { }

  ngOnInit() {
    // console.log("ServiceURL=" + this.serviceURL)
    if (this.serviceUrl !== '') {
      this.config.init(this.serviceUrl);
    }
    this.conditionChecked = false;
    this.errorText = '';
    if (this.params.text == null) {
      this.nextText();
    } else {
      this.text = this.params.text;
    }
    this.initModels();
  }

  synthesize() {
    console.log('synthesize');
    this.sending = true;
    this.errorText = '';

    this.synthesisService.synthesize(this.text, this.model.url)
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
    } else {
      this.uErrorService.clear();
      const audio = document.getElementById('player') as HTMLAudioElement;
      audio.src = 'data:audio/mp3;base64,' + result.audioAsString;
      audio.play();
      this.audio = audio;
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

  get text(): string {
    return this.textInternal;
  }

  set text(value: string) {
    this.textInternal = value;
    this.params.text = value;
  }

  clearPlayer(): void {
    const audio = document.getElementById('player') as HTMLAudioElement;
    audio.src = '';
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
}
