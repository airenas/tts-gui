import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageParamsProviderService, ParamsProviderService } from './params-provider.service';

describe('ParamsProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ParamsProviderService, useClass: LocalStorageParamsProviderService }]
    });
  });

  it('should be created', inject([ParamsProviderService], (service: ParamsProviderService) => {
    expect(service).toBeTruthy();
  }));

  it('should remember text', inject([ParamsProviderService], (service: ParamsProviderService) => {
    service.text = 'olia';
    expect(service.text).toBe('olia');
  }));

  it('should not remember text in storage', inject([ParamsProviderService], (service: ParamsProviderService) => {
    service.text = 'olia';
    expect(new LocalStorageParamsProviderService().text).toBeFalsy();
  }));

  it('should remember modelID', inject([ParamsProviderService], (service: ParamsProviderService) => {
    service.setModelID('oliaID');
    expect(service.getModelID()).toBe('oliaID');
  }));

  it('should remember modelID from local storage', inject([ParamsProviderService], (service: ParamsProviderService) => {
    service.setModelID('oliaID-2');
    expect(new LocalStorageParamsProviderService().getModelID()).toBe('oliaID-2');
  }));
});
