import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vista-docente',
  templateUrl: './vista-docente.component.html',
  styleUrl: './vista-docente.component.scss'
})
export class VistaDocenteComponent implements OnInit {
  mensajeBienvenida: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.mensajeBienvenida = history.state.mensaje;
  }
}

