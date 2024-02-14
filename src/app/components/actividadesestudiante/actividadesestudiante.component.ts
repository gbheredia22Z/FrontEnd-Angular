import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-actividadesestudiante',
  templateUrl: './actividadesestudiante.component.html',
  styleUrl: './actividadesestudiante.component.scss'
})
export class ActividadesestudianteComponent {
  constructor(
    private location: Location) { }

  regresarPagina(): void {
    this.location.back();
  }
}
