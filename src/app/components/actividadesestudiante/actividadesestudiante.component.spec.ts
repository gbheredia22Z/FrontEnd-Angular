import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesestudianteComponent } from './actividadesestudiante.component';

describe('ActividadesestudianteComponent', () => {
  let component: ActividadesestudianteComponent;
  let fixture: ComponentFixture<ActividadesestudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActividadesestudianteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadesestudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
