import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';


@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
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

  createEstudiante(form: NgForm){
    if(form.value.id_automovil){
      this.personaService.putEstudiante(form.value).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getEstudiante();
      }); 
    }else{
      if(form.valid){
        this.personaService.postEstudiante(form.value).subscribe((res) => {
          form.reset();
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Nuevo registro agregado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getEstudiante();
        });
      }else{
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Llene todos todos los campos',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      
    }
  }
  updateEstudiante(persona: Persona){
    this.personaService.selectedEstudiante = persona;
    this.personaService.putEstudiante(persona);
  }


}
