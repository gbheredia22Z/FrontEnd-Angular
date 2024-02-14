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
        (actividades: any) => {
            console.log('Actividades de notas:', actividades); // Agregar este log para verificar los datos recibidos
            // Resto del código...
        },
        (error) => {
            console.error('Error al obtener las actividades de notas:', error);
        }
    );
}


  logout(): void {
    this.router.navigate(['/login']);
  }
}
