import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaEstudianteAsigComponent } from './area-estudiante-asig.component';

describe('AreaEstudianteAsigComponent', () => {
  let component: AreaEstudianteAsigComponent;
  let fixture: ComponentFixture<AreaEstudianteAsigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreaEstudianteAsigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaEstudianteAsigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
