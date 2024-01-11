import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducativaActividadesComponent } from './educativa-actividades.component';

describe('EducativaActividadesComponent', () => {
  let component: EducativaActividadesComponent;
  let fixture: ComponentFixture<EducativaActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EducativaActividadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EducativaActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
