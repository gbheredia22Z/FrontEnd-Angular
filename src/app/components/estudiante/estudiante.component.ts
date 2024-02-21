import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, NgModel, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';
import { DataTableDirective } from 'angular-datatables';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ImpresionService } from '../../services/impresion.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss'],
  providers: [PersonaService]
})

export class EstudianteComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  dtTrigger: Subject<any> = new Subject<any>();
  myForm: FormGroup;
  searchQuery: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;

  // Define el rango permitido para la fecha de nacimiento
  minFechaNacimiento: string;
  maxFechaNacimiento: string;

  mensajeBienvenida: string;

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  regresarPagina(): void {
    //this.location.back();
    this.router.navigate(['/admin']);
  }

  getEstudiante() {
    this.personaService.getEstudiante().subscribe((res) => {
      this.personaService.estudiantes = res as Persona[];
      console.log(res);

    });
  }

  private calculateMinFechaNacimiento(): string {
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 5);  // Restricción de edad (menores de 5 años)

    // Restringe también la fecha mínima al año 2010
    const fechaMinimaPermitida = new Date('2010-01-01');

    // Convierte las fechas a valores numéricos y aplica Math.max()
    const fechaMinimaNumerica = fechaMinima.getTime();
    const fechaMinimaPermitidaNumerica = fechaMinimaPermitida.getTime();
    const fechaMinimaFinal = new Date(Math.max(fechaMinimaNumerica, fechaMinimaPermitidaNumerica));

    return this.formatDate(fechaMinimaFinal);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getEstudiantes2() {
    this.personaService.getEstudiante().
      subscribe((data) => {
        this.data = data;
        console.log(data);
        this.dtTrigger.next(this.dtOptions);
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

  constructor(public personaService: PersonaService, private fb: FormBuilder, private router: Router, private srvImpresion: ImpresionService,
    private location: Location) {
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
    this.mensajeBienvenida = history.state.mensaje ?? "Bienvenido/a admin";
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };

    this.getEstudiantes2();
    // Calcula el rango permitido (puedes ajustar los valores según tus necesidades)
    const fechaActual = new Date();
    this.minFechaNacimiento = '2010-01-01';
    this.maxFechaNacimiento = '2017-12-31';
  }

  ngOnDestroy(): void {
    //this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  onSearch(): void {
    // Lógica para filtrar estudiantes por cédula
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      this.personaService.estudiantes = this.personaService.estudiantes.filter(estudiante =>
        estudiante.cedula.includes(this.searchQuery.trim())
      );
    } else {
      // Si la consulta está vacía, muestra todos los estudiantes nuevamente
      this.getEstudiante();
    }
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

  validateForm(form: any, isSubmitAttempted: boolean): { isValid: boolean, errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Validación de campo vacío para el nombre solo si se intenta enviar el formulario
    if (isSubmitAttempted && !form.nombre.trim()) {
      isValid = false;
      errors['nombre'] = 'El nombre es obligatorio';
    } else if (form.nombre.length > 100 || /\d/.test(form.nombre)) {
      isValid = false;
      errors['nombre'] = 'El nombre debe tener máximo 100 caracteres y no debe contener números';
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

  createEstudiante(form: NgForm): void {
    // Validación de formulario totalmente vacío
    const isFormEmpty = Object.values(form.value).every(value => !value);
    if (isFormEmpty) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'El formulario está vacío. Por favor, completa los campos antes de guardar.'
      });
      return;
    }
    // Validación de nombre (solo texto, no números)
    if (!/^[A-Za-z\s]+$/.test(form.value.nombre)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el nombre',
        text: 'El nombre solo puede contener letras y espacios.'
      });
      return;
    }

    // Validación de cédula (solo números y máximo 10 dígitos)
    const cedulaValue = form.value.cedula;
    if (!this.validarCedulaEcuatoriana(cedulaValue) || !/^\d{10}$/.test(cedulaValue)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la cédula',
        text: 'La cédula no es válida. Asegúrate de ingresar una cédula ecuatoriana válida.'
      });
      return;
    }

    // Validación de dirección (solo texto)
    if (!/^[A-Za-z0-9\s]+$/.test(form.value.direccion)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la dirección',
        text: 'La dirección solo puede contener letras, números y espacios.'
      });
      return;
    }

    // Validación de correo electrónico
    const correoValue = form.value.correo;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoValue)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el correo electrónico',
        text: 'Ingrese un correo electrónico válido.'
      });
      return;
    }

    // Validación de teléfono (solo números y máximo 10 dígitos)
    const telefonoValue = form.value.celular;
    if (!/^\d{10}$/.test(telefonoValue)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el teléfono',
        text: 'El teléfono debe contener solo números y tener 10 dígitos.'
      });
      return;
    }

    // Validación de fecha (rango permitido)
    const fechaNacimientoValue = form.value.fechaNacimiento;
    if (!fechaNacimientoValue) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: 'La fecha de nacimiento es obligatoria.'
      });
      return;
    }
    const fechaNacimiento = new Date(fechaNacimientoValue);

    // Verifica que la fecha esté dentro del rango permitido
    if (fechaNacimiento.getFullYear() < 2010 || fechaNacimiento.getFullYear() > 2017) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: 'La fecha de nacimiento debe estar entre 2010 y 2017.'
      });
      return;
    }

    // Validación de cédula duplicada
    this.personaService.getEstudianteByCi(cedulaValue).subscribe(
      (existingStudent) => {
        if (existingStudent.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error en la cédula',
            text: 'Ya existe un estudiante con esta cédula. Ingresa una cédula diferente.'
          });
        } else {
          // Si la cédula no está duplicada, continuar con la creación del estudiante
          this.personaService.postEstudiante(form.value).subscribe(
            (res) => {
              form.reset();
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Nuevo estudiante agregado',
                showConfirmButton: false,
                timer: 3000,
              });

              this.closeAddEstudianteModal();
              this.irListaEstudiantes();
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
      },
      (error) => {
        console.error('Error al verificar cédula:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al verificar cédula',
          text: 'Hubo un error al verificar la cédula. Por favor, inténtalo nuevamente.'
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
      this.irListaEstudiantes();
      this.closeEditEstudianteModal();

      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }

  irListaEstudiantes() {
    //this.router.navigate(["/estudiante"])
    window.location.reload()
  }

  closeEditEstudianteModal(): void {
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

        // Nueva validación para estudiantes menores de 5 años
        const fechaMaxima = new Date();
        fechaMaxima.setFullYear(fechaMaxima.getFullYear() - 5);

        if (fechaNacimiento > fechaMaxima) {
          errors['invalidEdadEstudiante'] = true;
        }
      }

      if (fechaNacimiento < fechaMinima) {
        errors['invalidFechaMinima'] = true;
      }

      if (fechaNacimiento > fechaActual) {
        errors['invalidFechaFutura'] = true;
      }
      // Restricciones adicionales para estudiantes
      const anioMinimoEstudiante = 2010;
      const anioMaximoEstudiante = 2018;

      const anioNacimiento = fechaNacimiento.getFullYear();

      if (anioNacimiento < anioMinimoEstudiante || anioNacimiento > anioMaximoEstudiante) {
        errors['invalidRangoEstudiante'] = true;
      }
      fechaNacimientoControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  }


  onImprimir() {
    if (this.data.length > 0) {
      const encabezado = ["Nombre", "Apellido", "Cedula", "Correo", "Celular"];
      const cuerpo = this.data.map((estudiante: Persona) => [
        estudiante.nombre,
        estudiante.apellido,
        estudiante.cedula,
        estudiante.correo,
        estudiante.celular
      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Estudiantes", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }
  imprimirExcel() {
    if (this.data.length > 0) {
      const encabezado = ["Nombre", "Apellido", "Cedula", "Correo", "Celular"];
      const cuerpo = this.data.map((estudiante: Persona) => [
        estudiante.nombre,
        estudiante.apellido,
        estudiante.cedula,
        estudiante.correo,
        estudiante.celular
      ]);

      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Listado de Estudiantes", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }
  calcularEdad(fechaNacimiento: string): number {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesActual = hoy.getMonth() + 1;
    const mesNacimiento = fechaNac.getMonth() + 1;

    if (mesNacimiento > mesActual || (mesNacimiento === mesActual && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  }


}

declare var $: any;



