import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Asignatura } from '../../models/asignatura';

@Component({
  selector: 'app-vista-docente',
  templateUrl: './vista-docente.component.html',
  styleUrls: ['./vista-docente.component.scss']
})
export class VistaDocenteComponent implements OnInit {
  mensajeBienvenida: string;
  asignaturas: Asignatura[] = [];
  idDocente: number;
  actividades: Record<string, any[]> = {};
  modalVisible: Record<string, boolean> = {}; // Cambiado a un objeto indexado por string

  constructor(private personaService: PersonaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.mensajeBienvenida = history.state.mensaje;
    this.idDocente = history.state.idUser;
    if ('usuario' in history.state) {
      this.idDocente = history.state.usuario.id;
    }
    this.obtenerAsignaturas(this.idDocente);
  }

  obtenerAsignaturas(idDocente: number) {
    this.personaService.asignaturasPorIdDocente(idDocente).subscribe(
      (asignaturas: Asignatura[]) => {
        this.asignaturas = asignaturas;
        console.log('Asignaturas obtenidas:', this.asignaturas);
      },
      (error) => {
        console.error('Error al obtener las asignaturas:', error);
      }
    );
  }

  cargarActividades(asignaturaId: string) {
    this.router.navigate(['/actividad-docente', asignaturaId], { state: { asignaturaId: asignaturaId } });
  }

  cargarNotas(asignaturaId: string) {
    this.router.navigate(['/notas-docente', asignaturaId], { state: { asignaturaId: asignaturaId } });
  }

  cerrarModal(asignaturaId: string) {
    this.modalVisible[asignaturaId] = false; // Ocultar el modal correspondiente
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  // Función para dividir un arreglo en subarreglos de tamaño dado
  chunk(arr: any[], size: number): any[][] {
    return arr.reduce((acc, _, i) => (i % size === 0 ? acc.push(arr.slice(i, i + size)) : acc, acc), []);
  }
}
