import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../../services/persona.service'; // Asegúrate de importar correctamente el servicio PersonaService
import { Asignatura } from '../../models/asignatura';

@Component({
  selector: 'app-vista-estudiante',
  templateUrl: './vista-estudiante.component.html',
  styleUrls: ['./vista-estudiante.component.scss']
})
export class VistaEstudianteComponent implements OnInit {
  mensajeBienvenida: string;
  asignaturas: Asignatura[] = []; // Declara la propiedad asignaturas como un arreglo de Asignatura

  constructor(private route: ActivatedRoute, private router: Router, private personaService: PersonaService) { }

  ngOnInit(): void {
    this.mensajeBienvenida = history.state.mensaje; // Asigna el mensaje de bienvenida desde el estado de la historia
    this.obtenerAsignaturas(); // Llama al método obtenerAsignaturas al inicializar el componente
  }

  obtenerAsignaturas() {
    const idUsuario: number = 1; // Reemplaza 123 con el ID del usuario actual obtenido de tu aplicación
    this.personaService.asignaturasPorIdPersona(idUsuario).subscribe(
      (asignaturas: Asignatura[]) => {
        this.asignaturas = asignaturas; // Asigna las asignaturas recuperadas del servicio a la propiedad asignaturas
      },
      (error) => {
        console.error('Error al obtener las asignaturas:', error);
      }
    );
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
