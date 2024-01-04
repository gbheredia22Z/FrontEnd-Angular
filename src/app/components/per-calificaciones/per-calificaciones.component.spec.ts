import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerCalificacionesComponent } from './per-calificaciones.component';

describe('PerCalificacionesComponent', () => {
  let component: PerCalificacionesComponent;
  let fixture: ComponentFixture<PerCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerCalificacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
