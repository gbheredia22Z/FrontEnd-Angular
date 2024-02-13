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

  constructor(private personaService: PersonaService, private router: Router, private route: ActivatedRoute, ) { }

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

  async cargarActividades(asignaturaId: string) {
    const idAsignatura: number = parseInt(asignaturaId, 10);
    try {
      const actividades: any[] = await this.personaService.obtenerActividadesPorAsignatura(idAsignatura).toPromise();
      console.log('Actividades obtenidas:', actividades);
      this.actividades[asignaturaId] = actividades; // Asignar actividades al objeto con asignaturaId como clave
      this.modalVisible[asignaturaId] = true; // Mostrar el modal correspondiente
    } catch (error) {
      console.error('Error al obtener las actividades:', error);
    }
  }

  cerrarModal(asignaturaId: string) {
    this.modalVisible[asignaturaId] = false; // Ocultar el modal correspondiente
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
