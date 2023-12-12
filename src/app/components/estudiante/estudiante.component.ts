import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, NgModel, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';



@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss'],
  providers: [PersonaService]
})

export class EstudianteComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;

  getEstudiante() {
    this.personaService.getEstudiante().subscribe((res) => {
      this.personaService.estudiantes = res as Persona[];
      console.log(res);

    });
  }


  constructor(public personaService: PersonaService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', Validators.required],
      celular: ['', Validators.required],

    });
  }
  ngOnInit(): void {
    this.getEstudiante();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openAddEstudianteModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.personaService.selectedEstudiante = new Persona();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addEstudianteModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addEstudianteModal').modal('hide');
  }


  filterNumeric(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }

  validateForm(form: any): boolean {
    let isValid = true;

    if (form.nombre.length > 100) {
      isValid = false;
      // Mostrar mensaje de error para el campo de nombres
    }

    if (form.apellido.length > 100) {
      isValid = false;
      // Mostrar mensaje de error para el campo de apellidos
    }

    if (!form.correo.includes('@')) {
      isValid = false;
      // Mostrar mensaje de error para el campo de correo electrónico
    }

    if (form.celular.length !== 10) {
      isValid = false;
      // Mostrar mensaje de error para el campo de teléfono
    }

    if (form.direccion.length > 100) {
      isValid = false;
      // Mostrar mensaje de error para el campo de dirección
    }

    return isValid;
  }

  validarCedulaEcuatoriana(cedula: string): boolean {
    const cedulaRegExp = /^[0-9]{10}$/;

    if (!cedulaRegExp.test(cedula)) {
      return false;
    }

    const digitoRegion = Number(cedula.substring(0, 2));
    if (digitoRegion < 1 || digitoRegion > 24) {
      return false;
    }

    const digitoTercer = Number(cedula[2]);
    if (digitoTercer < 0 || digitoTercer > 5) {
      return false;
    }
    // Algoritmo de validación de dígitos verificadores
    return true;
  }

  createEstudiante(form: NgForm): void {
    this.personaService.postEstudiante(form.value).subscribe(
      (res) => {
        form.reset();
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Nuevo estudiante agregado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getEstudiante();
        this.closeAddEstudianteModal();
      },
      (error) => {
        console.error('Error al crear estudiante:', error);
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Error al crear estudiante',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }



  // Agregar un método para cerrar el modal de añadir estudiante
  closeAddEstudianteModal(): void {
    const modal = document.getElementById('addEstudianteModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  editEstudiante(estudiante: Persona) {
    // Clona el estudiante para evitar cambios directos
    this.personaService.selectedEstudiante = { ...estudiante };

    // Abre el modal de edición
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
  }

  updateEstudiante(form: NgForm) {
    this.personaService.putEstudiante(this.personaService.selectedEstudiante).subscribe((res) => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getEstudiante();

      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }

  closeEditEstudianteModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }
}

declare var $: any;



