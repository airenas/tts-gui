import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpSayingService, SayingService } from './service/saying.service';
import { HttpSynthesisService, SynthesisService } from './service/synthesis.service';
import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SynthesisComponent } from './synthesis/synthesis.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Config } from './config';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LocalStorageParamsProviderService, ParamsProviderService } from './service/params-provider.service';
import { HttpModelsService, ModelsService } from './service/models.service';
import { createCustomElement } from '@angular/elements';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    SynthesisComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule, MatInputModule, MatCardModule, MatSelectModule,
    MatMenuModule, MatProgressSpinnerModule, MatTooltipModule, MatCheckboxModule, MatSnackBarModule,
    MatExpansionModule,
  ],
  exports: [MatTabsModule, MatButtonModule, MatProgressSpinnerModule],
  providers: [Config,
    { provide: ParamsProviderService, useClass: LocalStorageParamsProviderService },
    { provide: SynthesisService, useClass: HttpSynthesisService },
    { provide: SayingService, useClass: HttpSayingService },
    { provide: ModelsService, useClass: HttpModelsService }
  ],
  bootstrap: [],
  entryComponents: [SynthesisComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(SynthesisComponent, { injector });
    customElements.define('synthesis-app', el);
  }
  ngDoBootstrap() { }
}
