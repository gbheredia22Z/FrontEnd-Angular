import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaEstudianteComponent } from './area-estudiante.component';

describe('AreaEstudianteComponent', () => {
  let component: AreaEstudianteComponent;
  let fixture: ComponentFixture<AreaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreaEstudianteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
