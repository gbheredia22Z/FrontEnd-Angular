import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioContraseniaComponent } from './cambio-contrasenia.component';

describe('CambioContraseniaComponent', () => {
  let component: CambioContraseniaComponent;
  let fixture: ComponentFixture<CambioContraseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambioContraseniaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambioContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
