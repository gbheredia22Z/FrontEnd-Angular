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

  getEstudiante(){
    this.personaService.getEstudiante().subscribe((res) =>{
      this.personaService.estudiantes = res as Persona[];
      console.log(res);
    });
  }

  createEstudiante(form: NgForm) {
    if (form.valid) {
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
    } else {
      this.handleError('Llene todos los campos');
    }
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
  
  updateEstudiante(persona: Persona){
    this.personaService.selectedEstudiante = persona;
    this.personaService.putEstudiante(persona);
  }
}
