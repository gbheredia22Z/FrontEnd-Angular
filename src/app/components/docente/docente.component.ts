import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';


@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrl: './docente.component.scss'
})
export class DocenteComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  searchQuery: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;

  getDocente() {
    this.personaService.getDocente().subscribe((res) => {
      this.personaService.docentes = res as Persona[];
      console.log(res);

    });
  }
  validateFieldLength(value: string, maxLength: number, fieldName: string): { isValid: boolean, error?: string } {
    if (value.length > maxLength) {
      return {
        isValid: false,
        error: `El campo ${fieldName} debe tener máximo ${maxLength} caracteres`
      };
    }

    return { isValid: true };
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
    this.getDocente();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSearch(): void {
    // Lógica para filtrar docentes por cédula
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      this.personaService.docentes = this.personaService.docentes.filter(docente =>
        docente.cedula.includes(this.searchQuery.trim())
      );
    } else {
      // Si la consulta está vacía, muestra todos los docentes nuevamente
      this.getDocente();
    }
  }

  openAddDocenteModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.personaService.selectedDocente = new Persona();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addDocenteModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addDocenteModal').modal('hide');
  }

  filterNumeric(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }

  validateForm(form: any): { isValid: boolean, errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    if (form.nombre.length > 100) {
      isValid = false;
      errors['nombre'] = 'El nombre debe tener máximo 100 caracteres';
    }

    if (form.apellido.length > 100) {
      isValid = false;
      errors['apellido'] = 'El apellido debe tener máximo 100 caracteres';
    }

    if (!form.correo.includes('@') || form.correo.length > 100) {
      isValid = false;
      errors['correo'] = 'Ingrese un correo electrónico válido y con máximo 100 caracteres';
    }

    if (!/^09\d{8}$/.test(form.celular)) {
      isValid = false;
      errors['celular'] = 'El número de teléfono debe comenzar con "09" y tener 10 dígitos';
    }
    

    if (form.direccion.length > 100) {
      isValid = false;
      errors['direccion'] = 'La dirección debe tener máximo 100 caracteres';
    }

    return { isValid, errors };
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
    const coeficientes: number[] = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      const producto = coeficientes[i] * Number(cedula[i]);
      suma += producto > 9 ? producto - 9 : producto;
    }

    const decenaSuperior = Math.ceil(suma / 10) * 10;
    const digitoVerificador = decenaSuperior - suma;

    if (digitoVerificador !== Number(cedula[9])) {
      return false;
    }

    return true;
  }

  createDocente(form: NgForm): void {
    this.personaService.postDocente(form.value).subscribe(
      (res) => {
        form.reset();
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Nuevo docente agregado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getDocente();
        this.closeAddDocenteModal();
      },
      (error) => {
        console.error('Error al crear docente:', error);
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Error al crear docente',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }



  // Agregar un método para cerrar el modal de añadir docente
  closeAddDocenteModal(): void {
    const modal = document.getElementById('addDocenteModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  editDocente(docente: Persona) {
    // Clona el estudiante para evitar cambios directos
    this.personaService.selectedDocente = { ...docente };

    // Abre el modal de edición
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
  }

  updateDocente(form: NgForm) {
    this.personaService.putDocente(this.personaService.selectedDocente).subscribe((res) => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getDocente();

      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }

  closeEditDocenteModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }
  
  validarFechaNacimiento(): void {
    const fechaNacimientoControl = this.myForm.get('fechaNacimiento');
    if (fechaNacimientoControl) {
      const fechaNacimiento = new Date(fechaNacimientoControl.value);
      const fechaActual = new Date();
      const fechaMinima = new Date();
      fechaMinima.setFullYear(fechaMinima.getFullYear() - 5);
  
      const errors: ValidationErrors = {};
  
      if (fechaNacimientoControl.errors && fechaNacimientoControl.errors['required']) {
        errors['required'] = true;
      }
  
      if (fechaNacimientoControl.errors && fechaNacimientoControl.errors['min']) {
        errors['min'] = fechaNacimientoControl.errors['min'];
      }
  
      if (fechaNacimientoControl.errors && fechaNacimientoControl.errors['max']) {
        errors['max'] = fechaNacimientoControl.errors['max'];
      }
  
      if (fechaNacimientoControl.errors && fechaNacimientoControl.errors['matDatepickerMin']) {
        errors['matDatepickerMin'] = fechaNacimientoControl.errors['matDatepickerMin'];
      }
  
      if (fechaNacimiento.toDateString() === fechaActual.toDateString()) {
        errors['invalidFechaActual'] = true;
      }
  
      if (fechaNacimiento < fechaMinima) {
        errors['invalidFechaMinima'] = true;
      }
  
      if (fechaNacimiento > fechaActual) {
        errors['invalidFechaFutura'] = true;
      }
  
      fechaNacimientoControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  }
}

declare var $: any;