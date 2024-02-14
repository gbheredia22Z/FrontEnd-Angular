import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesdocenteComponent } from './actividadesdocente.component';

describe('ActividadesdocenteComponent', () => {
  let component: ActividadesdocenteComponent;
  let fixture: ComponentFixture<ActividadesdocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActividadesdocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadesdocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
