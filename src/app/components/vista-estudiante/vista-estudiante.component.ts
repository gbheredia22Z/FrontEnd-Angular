import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Asignatura } from '../../models/asignatura';
import { NotasService } from '../../services/notas.service'; // Importa el servicio de notas

@Component({
  selector: 'app-vista-estudiante',
  templateUrl: './vista-estudiante.component.html',
  styleUrls: ['./vista-estudiante.component.scss']
})
export class VistaEstudianteComponent implements OnInit {
  @Input() actividades: any[] = [];
  mensajeBienvenida: string;
  asignaturas: Asignatura[] = [];
  idEstudiante: number;
  actividadesPorAsignatura: { [asignaturaId: string]: any[] } = {};
  asignatura: Asignatura;

  constructor(
    private personaService: PersonaService,
    private notasService: NotasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.mensajeBienvenida = history.state.mensaje;
    this.idEstudiante = history.state.idUser;

    if ('usuario' in history.state) {
      this.idEstudiante = history.state.usuario.id;
    }
    this.obtenerAsignaturas(this.idEstudiante);

  }

  obtenerAsignaturas(idEstudiante: number) {
    this.personaService.asignaturasPorIdEstudiante(idEstudiante).subscribe(
      (asignaturas: Asignatura[]) => {
        this.asignaturas = asignaturas;
      },
      (error) => {
        console.error('Error al obtener las asignaturas:', error);
      }
    );
  }

  seleccionarMateria(idMateria: number): void {
    this.obtenerActividadesDeNotas(this.idEstudiante, idMateria);
  }

  obtenerActividadesDeNotas(idEstudiante: number, idMateria: number): void {
    this.notasService.obtenerNotasEstudiante(idEstudiante, idMateria).subscribe(
      (actividades: any[]) => {
        console.log('Actividades de notas:', actividades);
        this.actividadesPorAsignatura[idMateria] = actividades; // Guardar las actividades por id de asignatura
      },
      (error) => {
        console.error('Error al obtener las actividades de notas:', error);
      }
    );
  }

   nombrePeriodo(abreviatura: string): string {
    const nombrePeriodo: { [key: string]: string } = {
      P: 'Primer Trimestre',
      S: 'Segundo Trimestre',
      T: 'Tercer Trimestre',
    };
    return nombrePeriodo[abreviatura] || abreviatura;
  }
  obtenerNotasEstudiante(idEstudiante: number, idAsignatura: number) {
    this.notasService.obtenerNotasEstudiante(idEstudiante, idAsignatura).subscribe(
      (data: any[]) => {
        console.log('Actividades de notas:', data);
        this.actividadesPorAsignatura[idAsignatura] = data;
      },
      (error) => {
        console.error('Error al obtener las actividades de notas:', error);
      }
    );
  }


  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
