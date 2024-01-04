import { TestBed } from '@angular/core/testing';

import { PerCalificacionesService } from './per-calificaciones.service';

describe('PerCalificacionesService', () => {
  let service: PerCalificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerCalificacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
