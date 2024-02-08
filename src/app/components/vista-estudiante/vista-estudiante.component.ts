import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Asignatura } from '../../models/asignatura';

@Component({
  selector: 'app-vista-estudiante',
  templateUrl: './vista-estudiante.component.html',
  styleUrls: ['./vista-estudiante.component.scss']
})
export class VistaEstudianteComponent implements OnInit {
  mensajeBienvenida: string;
  asignaturas: Asignatura[] = [];
  idEstudiante: number;

  constructor(private personaService: PersonaService, private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.mensajeBienvenida = history.state.mensaje;
    // Obtén el ID del estudiante desde los parámetros de la ruta
    this.idEstudiante = history.state.idUser;

    console.log('Objeto de respuesta:', history.state);

    if ('usuario' in history.state) {
      console.log('Propiedad "usuario" encontrada en el objeto de respuesta');
      console.log('ID del Estudiante obtenido:', history.state.usuario.id);

      // Accede al campo 'id' del objeto 'usuario'
      this.idEstudiante = history.state.usuario.id;
    }
    // Luego, puedes llamar a tu función para obtener asignaturas
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

  logout(): void {
    this.router.navigate(['/login']);
  }
}
