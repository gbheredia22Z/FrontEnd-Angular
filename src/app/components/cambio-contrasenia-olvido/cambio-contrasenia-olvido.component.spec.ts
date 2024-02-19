import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioContraseniaOlvidoComponent } from './cambio-contrasenia-olvido.component';

describe('CambioContraseniaOlvidoComponent', () => {
  let component: CambioContraseniaOlvidoComponent;
  let fixture: ComponentFixture<CambioContraseniaOlvidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambioContraseniaOlvidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambioContraseniaOlvidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
