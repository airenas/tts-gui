import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Config } from '../config';
import { HttpModelsService, ModelsService } from './models.service';
import { HttpClientModule } from '@angular/common/http';

describe('ModelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [Config,
      { provide: ModelsService, useClass: HttpModelsService }]
  }));

  it('should be created', () => {
    const service: ModelsService = TestBed.inject(ModelsService);
    expect(service).toBeTruthy();
  });
});

describe('HttpModelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [Config,
      { provide: HttpModelsService, useClass: HttpModelsService }]
  }));

  it('should load models', (done: DoneFn) => {
    const service: HttpModelsService = TestBed.inject(HttpModelsService);
    service.models().subscribe(
      result => {
        expect(result.length).toBeGreaterThan(0);
        done();
      },
    );
  });

  it('should fail on wrong url', (done: DoneFn) => {
    const service: HttpModelsService = TestBed.inject(HttpModelsService);
    service.loadModels('fake.json').subscribe(
      result => {
        expect(result).toBeUndefined();
        done();
      },
      error => {
        expect(error).not.toBeUndefined();
        done();
      }
    );
  });
});
