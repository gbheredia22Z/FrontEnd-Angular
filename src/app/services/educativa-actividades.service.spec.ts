import { TestBed } from '@angular/core/testing';

import { EducativaActividadesService } from './educativa-actividades.service';

describe('EducativaActividadesService', () => {
  let service: EducativaActividadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducativaActividadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
