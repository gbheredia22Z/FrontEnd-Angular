import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasdocenteComponent } from './notasdocente.component';

describe('NotasdocenteComponent', () => {
  let component: NotasdocenteComponent;
  let fixture: ComponentFixture<NotasdocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasdocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotasdocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
