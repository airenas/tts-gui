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

  // it('should show info paragraph', waitForAsync(() => {
  //   component.model = { id: 'id', name: 'olia', url: '/url', info: 'olialia' };
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     const p = fixture.debugElement.query(By.css('#infoParagraph'));
  //     expect(p.nativeElement.textContent).toEqual('olialia');
  //     expect(TestHelper.Visible(p)).toBe(true);
  //   });
  // }));

  // it('should hide info paragraph', waitForAsync(() => {
  //   component.model = { id: 'id', name: 'olia', url: '/url' };
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(TestHelper.Visible(fixture.debugElement.query(By.css('#infoParagraph')))).toBe(false);
  //   });
  // }));

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
