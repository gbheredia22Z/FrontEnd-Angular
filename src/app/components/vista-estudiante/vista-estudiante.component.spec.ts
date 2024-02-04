import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaEstudianteComponent } from './vista-estudiante.component';

describe('VistaEstudianteComponent', () => {
  let component: VistaEstudianteComponent;
  let fixture: ComponentFixture<VistaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VistaEstudianteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
