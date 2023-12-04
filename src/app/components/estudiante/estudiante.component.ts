import { Component } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';


@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss'],
  providers: [PersonaService]
})

export class EstudianteComponent {
  myForm!: FormGroup;
  searchQuery: any;
  onSearch: any;

  constructor(public personaService: PersonaService, public fb: FormBuilder) {
    this.myForm = fb.group({
      id: new FormControl('', Validators.compose([Validators.required])),
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      celular: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getEstudiante();
  }

  getEstudiante() {
    this.personaService.getEstudiante().subscribe((res) => {
      this.personaService.estudiantes = res as Persona[];
      console.log(res);
    });
  }

  createEstudiante(form: NgForm) {
    // Validar que todos los campos son requeridos
    if (!form.value.nombre ||
      !form.value.apellido ||
      !form.value.cedula ||
      !form.value.fechaNacimiento ||
      !form.value.direccion ||
      !form.value.correo ||
      !form.value.celular) {
    this.handleError('Llene todos los campos');
    return;
  }
  
    // Validar que la cedula y celular sean 10 dígitos
    const cedula = form.value.cedula;
    if (cedula.length !== 10 ) {
      this.handleError('La cédula debe tener 10 dígitos.');
      return;
    }
    const celular = form.value.celular;
    if (celular.length !== 10) {
      this.handleError('El celular deben tener 10 dígitos.');
      return;
    }
  
    // Validar que el correo contenga @
    const correo = form.value.correo;
    if (!correo.includes('@')) {
      this.handleError('El correo debe contener @.');
      return;
    }
  
    // Si todas las validaciones son exitosas, procede con la creación del estudiante
    this.personaService.postEstudiante(form.value).subscribe(
      (res) => {
        this.handleSuccess('Nuevo registro agregado');
        form.reset();
        this.getEstudiante();
      },
      (error) => {
        console.error('Error al agregar nuevo estudiante:', error);
        this.handleError('Error al agregar nuevo estudiante');
      }
    );
  }
  

  private handleSuccess(message: string) {
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  private handleError(errorMessage: string) {
    Swal.fire({
      position: 'top',
      icon: 'error',
      title: errorMessage,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  updateEstudiante(persona: Persona) {
    this.personaService.selectedEstudiante = persona;
    this.personaService.putEstudiante(persona);
  }

  
}
