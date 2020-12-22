import { SynthesisService } from './../service/synthesis.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Config } from './../config';
import { NgModule, Injectable } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { SayingService } from '../service/saying.service';
import { SynthesisResult } from '../api/synthesis-result';
import { LocalStorageParamsProviderService, ParamsProviderService } from '../service/params-provider.service';
import { ModelsService } from '../service/models.service';
import { Model } from '../api/model';

@Injectable()
export class MockSynthesisService implements SynthesisService {
  synthesize(text: string): Observable<SynthesisResult> {
    return EMPTY;
  }
}

@Injectable()
export class MockSayingService implements SayingService {
  saying(): Observable<string> {
    return EMPTY;
  }
}

@Injectable()
export class MockModelsService implements ModelsService {
  models(): Observable<Model[]> {
    return EMPTY;
  }
}

@Injectable()
export class MockActivatedRoute {
  snapshot = { paramMap: new Map() };
}

export class TestHelper {
  static Visible(element: any): boolean {
    if (element !== null && element.name === '#document' && element.parent === null) {
      return true;
    }
    if (element === null || element.nativeElement === null) {
      return false;
    }
    return !element.nativeElement.hasAttribute('hidden') && (element.parent == null || TestHelper.Visible(element.parent));
  }
}

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule, MatButtonModule, MatInputModule, FormsModule,
    MatSnackBarModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatMenuModule, MatTooltipModule,
    MatCardModule, ReactiveFormsModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' },
  { provide: ActivatedRoute, useClass: MockActivatedRoute },
  { provide: Config, useClass: Config },
  { provide: ParamsProviderService, useClass: LocalStorageParamsProviderService} ,
  { provide: SynthesisService, useClass: MockSynthesisService },
  { provide: SayingService, useClass: MockSayingService },
  { provide: ModelsService, useClass: MockModelsService }
  ],
  bootstrap: [],
  exports: [
    MatTabsModule, MatButtonModule, MatInputModule, FormsModule,
    MatSnackBarModule, MatCardModule, MatProgressBarModule, MatProgressSpinnerModule, MatMenuModule,
    MatTooltipModule
  ],
})

export class TestAppModule {
}
