import { MockModelsService, MockSayingService } from './../base/test.app.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SynthesisComponent } from './synthesis.component';
import { TestAppModule, TestHelper } from '../base/test.app.module';
import { By } from '@angular/platform-browser';
import { LocalStorageParamsProviderService, ParamsProviderService } from '../service/params-provider.service';
import { SayingService } from '../service/saying.service';
import { of } from 'rxjs';
import { ModelsService } from '../service/models.service';
import { Model } from '../api/model';

describe('SynthesisComponent', () => {
  let component: SynthesisComponent;
  let fixture: ComponentFixture<SynthesisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SynthesisComponent],
      imports: [TestAppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Text placeholder', waitForAsync(() => {
    expect(fixture.debugElement.query(By.css('#textInput'))
      .nativeElement.getAttribute('data-placeholder')).toBe('Tekstas');
  }));

  it('should have readonly button', waitForAsync(() => {
    expect(fixture.debugElement.query(By.css('#synthesisButton')).nativeElement.disabled).toBe(true);
  }));

  it('should have enabled button on valid Input', waitForAsync(() => {
    expect(fixture.debugElement.query(By.css('#synthesisButton')).nativeElement.disabled).toBe(true);
    component.text = 'olia';
    component.conditionChecked = true;
    component.model = { id: 'id', name: 'name', url: '/url' };
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#synthesisButton')).nativeElement.disabled).toBe(false);
    });
  }));

  it('should have enabled nextTextButton', waitForAsync(() => {
    expect(fixture.debugElement.query(By.css('#nextTextButton')).nativeElement.disabled).toBe(false);
  }));

  it('should invoke synthesis on click', waitForAsync(() => {
    component.text = 'olia';
    component.model = { id: 'id', name: 'name', url: '/url' };
    component.conditionChecked = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      spyOn(component, 'synthesize');
      fixture.debugElement.query(By.css('#synthesisButton')).nativeElement.click();
      expect(component.synthesize).toHaveBeenCalled();
    });
  }));

  it('should invoke nextText on click', waitForAsync(() => {
    spyOn(component, 'nextText');
    fixture.debugElement.query(By.css('#nextTextButton')).nativeElement.click();
    expect(component.nextText).toHaveBeenCalled();
  }));

  it('should show error', waitForAsync(() => {
    expect(TestHelper.Visible(fixture.debugElement.query(By.css('#errorDiv')))).toBe(false);
    expect(TestHelper.Visible(fixture.debugElement.query(By.css('#player')))).toBe(true);
    component.errorText = 'error';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#errorDiv')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#player')))).toBe(false);
    });
  }));

  it('should show download button on Firefox', waitForAsync(() => {
    component.isTesting = true;
    component.isFirefox = true;
    component.onResult({audioAsString: 'olia'});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#player')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#audioDownloadButton')))).toBe(true);
    });
  }));

  it('should show download button modified on Firefox', waitForAsync(() => {
    component.isTesting = true;
    component.isFirefox = true;
    component.conditionAllowCollect = true;
    component.onResultModified({audioAsString: 'olia'});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#playerModified')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#audioDownloadButtonModified')))).toBe(true);
    });
  }));

  it('should hide download button modified on Firefox', waitForAsync(() => {
    component.isTesting = true;
    component.isFirefox = false;
    component.conditionAllowCollect = true;
    component.onResultModified({audioAsString: 'olia'});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#playerModified')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#audioDownloadButtonModified')))).toBe(false);
    });
  }));

  it('should not show download button', waitForAsync(() => {
    component.isTesting = true;
    component.isFirefox = false;
    component.onResult({audioAsString: 'olia'});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#player')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#audioDownloadButton')))).toBe(false);
    });
  }));

  it('should show modify components', waitForAsync(() => {
    component.isTesting = true;
    component.isFirefox = true;
    component.conditionAllowCollect = true;
    component.onResultModified({audioAsString: 'olia'});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#requestInput')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#textModifiedInput')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#synthesisButtonModified')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#playerModified')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#audioDownloadButtonModified')))).toBe(true);
    });
  }));

  it('should hide modify components', waitForAsync(() => {
    component.isTesting = true;
    component.isFirefox = true;
    component.conditionAllowCollect = false;
    component.onResultModified({audioAsString: 'olia'});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#requestInput')))).toBe(false);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#textModifiedInput')))).toBe(false);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#synthesisButtonModified')))).toBe(false);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#playerModified')))).toBe(false);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#audioDownloadButtonModified')))).toBe(false);
    });
  }));

  it('should show spinner', waitForAsync(() => {
    expect(TestHelper.Visible(fixture.debugElement.query(By.css('#synthesisSpinner')))).toBe(false);
    component.sending = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#synthesisSpinner')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#errorDiv')))).toBe(false);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#player')))).toBe(false);
      expect(fixture.debugElement.query(By.css('#synthesisButton')).nativeElement.disabled).toBe(true);
    });
  }));

  it('should show modify spinner', waitForAsync(() => {
    expect(TestHelper.Visible(fixture.debugElement.query(By.css('#synthesisSpinnerModified')))).toBe(false);
    component.sendingModified = true;
    component.conditionAllowCollect = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#synthesisSpinnerModified')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#errorDivModified')))).toBe(false);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#playerModified')))).toBe(false);
      expect(fixture.debugElement.query(By.css('#synthesisButtonModified')).nativeElement.disabled).toBe(true);
    });
  }));

  it('should have readonly modified button', waitForAsync(() => {
    component.conditionAllowCollect = true;
    expect(fixture.debugElement.query(By.css('#synthesisButtonModified')).nativeElement.disabled).toBe(true);
  }));

  it('should have enabled button on valid Input', waitForAsync(() => {
    expect(fixture.debugElement.query(By.css('#synthesisButtonModified')).nativeElement.disabled).toBe(true);
    component.textModified = 'olia';
    component.conditionChecked = true;
    component.conditionAllowCollect = true;
    component.requestID = 'olia';
    component.model = { id: 'id', name: 'name', url: '/url' };
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#synthesisButtonModified')).nativeElement.disabled).toBe(false);
    });
  }));

  it('should have disabled button on no text', waitForAsync(() => {
    component.conditionChecked = true;
    component.conditionAllowCollect = true;
    component.requestID = 'olia';
    component.model = { id: 'id', name: 'name', url: '/url' };
    component.textModified = '';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#synthesisButtonModified')).nativeElement.disabled).toBe(true);
    });
  }));

  it('should have disabled button on no request', waitForAsync(() => {
    component.conditionChecked = true;
    component.conditionAllowCollect = true;
    component.requestID = '';
    component.model = { id: 'id', name: 'name', url: '/url' };
    component.textModified = 'olia';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('#synthesisButtonModified')).nativeElement.disabled).toBe(true);
    });
  }));


  it('should show modified error', waitForAsync(() => {
    expect(TestHelper.Visible(fixture.debugElement.query(By.css('#errorDivModified')))).toBe(false);
    expect(TestHelper.Visible(fixture.debugElement.query(By.css('#playerModified')))).toBe(true);
    component.errorTextModified = 'error';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#errorDivModified')))).toBe(true);
      expect(TestHelper.Visible(fixture.debugElement.query(By.css('#playerModified')))).toBe(false);
    });
  }));

  it('should invoke synthesizeModified on click', waitForAsync(() => {
    component.textModified = 'olia';
    component.model = { id: 'id', name: 'name', url: '/url' };
    component.conditionChecked = true;
    component.requestID = 'rolia';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      spyOn(component, 'synthesizeModified');
      fixture.debugElement.query(By.css('#synthesisButtonModified')).nativeElement.click();
      expect(component.synthesizeModified).toHaveBeenCalled();
    });
  }));
});

function testLoadModel(paramModelID: string, models: Model[], expectedID: string) {
  let component: SynthesisComponent;
  let fixture: ComponentFixture<SynthesisComponent>;
  const params = new LocalStorageParamsProviderService();
  params.modelIDLocal = paramModelID;
  TestBed.configureTestingModule({
    declarations: [SynthesisComponent],
    imports: [TestAppModule],
    providers: [{ provide: ParamsProviderService, useValue: params }]
  })
    .compileComponents();
  fixture = TestBed.createComponent(SynthesisComponent);
  component = fixture.debugElement.componentInstance;
  component.setModels(models);
  expect(component.model.id).toEqual(expectedID);
}

describe('Synthesis load', () => {
  let component: SynthesisComponent;
  let fixture: ComponentFixture<SynthesisComponent>;

  it('should read text value from provider', waitForAsync(() => {
    const params = new LocalStorageParamsProviderService();
    params.text = 'olia';

    TestBed.configureTestingModule({
      declarations: [SynthesisComponent],
      imports: [TestAppModule],
      providers: [{ provide: ParamsProviderService, useValue: params }]
    })
      .compileComponents();
    fixture = TestBed.createComponent(SynthesisComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.text).toBe('olia');
    });
  }));

  it('should read model value from provider', waitForAsync(() => {
    testLoadModel('id2', [{ id: 'm1', name: '', url: '' }, { id: 'id2', name: '', url: '' }], 'id2');
  }));

  it('should read first model value', waitForAsync(() => {
    testLoadModel('', [{ id: 'm1', name: '', url: '' }, { id: 'id2', name: '', url: '' }], 'm1');
  }));

  it('should read default model value', waitForAsync(() => {
    testLoadModel('', [{ id: 'm1', name: '', url: '' }, { id: 'id2', name: '', url: '', default: true }], 'id2');
  }));

  it('should read model values from json', waitForAsync(() => {
    const params = new LocalStorageParamsProviderService();
    const service = new MockModelsService();
    params.modelIDLocal = 'id2';
    TestBed.configureTestingModule({
      declarations: [SynthesisComponent],
      imports: [TestAppModule],
      providers: [{ provide: ParamsProviderService, useValue: params },
      { provide: ModelsService, useValue: service }]
    })
      .compileComponents();
    spyOn(service, 'models').and.returnValue(of([{ id: 'm1', name: '', url: '' }, { id: 'id2', name: '', url: '' }]));
    fixture = TestBed.createComponent(SynthesisComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.models?.length).toEqual(2);
      expect(component.model?.id).toEqual('id2');
    });
  }));

  it('should load value from sayings service', waitForAsync(() => {
    const service = new MockSayingService();

    TestBed.configureTestingModule({
      declarations: [SynthesisComponent],
      imports: [TestAppModule],
      providers: [{ provide: SayingService, useValue: service }]
    })
      .compileComponents();

    spyOn(service, 'saying').and.returnValue(of('olia'));
    fixture = TestBed.createComponent(SynthesisComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(service.saying).toHaveBeenCalled();
      expect(component.text).toBe('olia');
    });
  }));
});
