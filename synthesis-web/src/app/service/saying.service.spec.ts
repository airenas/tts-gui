import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Config } from '../config';

import { HttpSayingService, SayingService } from './saying.service';

describe('SayingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [Config,
      { provide: SayingService, useClass: HttpSayingService }]
  }));

  it('should be created', () => {
    const service: SayingService = TestBed.inject(SayingService);
    expect(service).toBeTruthy();
  });
});
