import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';
import { Location } from '@angular/common';
import { ImpresionService } from '../../services/impresion.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.scss'
})

export class AdministradorComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  myForm: FormGroup;
  searchQuery: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  dtTrigger: Subject<any> = new Subject<any>();

  // Define el rango permitido para la fecha de nacimiento
  minFechaNacimiento: string;
  maxFechaNacimiento: string;

  regresarPagina(): void {
    this.location.back();
  }
  
  getAdmin() {
  }

  getAdmin2() {
    this.personaService.getAdmin().
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

  constructor(public personaService: PersonaService, private fb: FormBuilder, private srvImpresion: ImpresionService,
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
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
    this.getAdmin2();
    this.minFechaNacimiento = '1950-01-01';
    this.maxFechaNacimiento = '2006-12-31';
  }
  

  onSearch(): void {
    // Lógica para filtrar docentes por cédula
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      this.personaService.administrador = this.personaService.administrador.filter(admin =>
        admin.cedula.includes(this.searchQuery.trim())
      );
    } else {
      // Si la consulta está vacía, muestra todos los docentes nuevamente
      this.getAdmin();
    }
  }

  openAddAdminModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.personaService.selectedAdmin = new Persona();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addAdminModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addAdminModal').modal('hide');
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

  createAdmin(form: NgForm): void {
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
    if (!/^\d{10}$/.test(cedulaValue)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la cédula',
        text: 'La cédula debe contener solo números y tener 10 dígitos.'
      });
      return;
    }
    if (!this.validarCedulaEcuatoriana(cedulaValue)) {
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

    // Validación de fecha de nacimiento (rango permitido)
    const fechaNacimientoValue = form.value.fechaNacimiento;
    // Verifica si la fecha de nacimiento está vacía
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
    const minFechaNacimiento = new Date(this.minFechaNacimiento);
    const maxFechaNacimiento = new Date(this.maxFechaNacimiento);
    if (fechaNacimiento < minFechaNacimiento || fechaNacimiento > maxFechaNacimiento) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: `La fecha de nacimiento debe estar entre ${this.minFechaNacimiento} y ${this.maxFechaNacimiento}.`
      });
      return;
    }

    // Validación de número de teléfono duplicado
    this.personaService.getAdminByCelular(telefonoValue).subscribe(
      (existingAdminByCelular) => {
        if (existingAdminByCelular.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el número de teléfono',
            text: 'Ya existe un docente con este número de teléfono. Ingresa un número diferente.'
          });
        } else {
          // Validación de cédula duplicada
          this.personaService.getAdminByCi(cedulaValue).subscribe(
            (existingTeacher) => {
              if (existingTeacher.length > 0) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error en la cédula',
                  text: 'Ya existe un docente con esta cédula. Ingresa una cédula diferente.'
                });
              } else {
                // Validación de correo electrónico duplicado
                this.personaService.getAdminByCorreo(correoValue).subscribe(
                  (existingAdminByCorreo) => {
                    if (existingAdminByCorreo.length > 0) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error en el correo electrónico',
                        text: 'Ya existe un docente con este correo electrónico. Ingresa un correo diferente.'
                      });
                    } else {
                      // Si la cédula, el correo y el teléfono no están duplicados, continuar con la creación del docente
                      this.personaService.postAdmin(form.value).subscribe(
                        (res) => {
                          form.reset();
                          Swal.fire({
                            position: 'top',
                            icon: 'success',
                            title: 'Nuevo administrador agregado',
                            showConfirmButton: false,
                            timer: 1500,
                          });
                          this.closeAddAdminModal();
                          this.irListaAdmin();
                        },
                        (error) => {
                          console.error('Error al crear administrador:', error);
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
                  },
                  (error) => {
                    console.error('Error al verificar correo electrónico:', error);
                    Swal.fire({
                      icon: 'error',
                      title: 'Error al verificar correo electrónico',
                      text: 'Hubo un error al verificar el correo electrónico. Por favor, inténtalo nuevamente.'
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
      },
      (error) => {
        console.error('Error al verificar número de teléfono:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al verificar número de teléfono',
          text: 'Hubo un error al verificar el número de teléfono. Por favor, inténtalo nuevamente.'
        });
      }
    );
  }

  // Agregar un método para cerrar el modal de añadir docente
  closeAddAdminModal(): void {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  editAdmin(admin: Persona) {
    // Clona el estudiante para evitar cambios directos
    this.personaService.selectedAdmin = { ...admin };

    // Abre el modal de edición
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
  }

  updateAdmin(form: NgForm) {
    this.personaService.putAdmin(this.personaService.selectedAdmin).subscribe((res) => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getAdmin();
      this.irListaAdmin();
      this.closeEditAdminModal();

      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }

  closeEditAdminModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  irListaAdmin() {
    //this.router.navigate(["/estudiante"])
    window.location.reload()
  }
  ngOnDestroy(): void {
    //this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.dtTrigger.unsubscribe();
  }
  updateTableDynamically() {
    // Perform dynamic table updates here
    this.dtTrigger.next(this.data);
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

  onImprimir() {
    if (this.data.length > 0) {
      const encabezado = ["Nombre", "Apellido", "Cedula", "Correo", "Celular"];
      const cuerpo = this.data.map((docente: Persona) => [
        docente.nombre,
        docente.apellido,
        docente.cedula,
        docente.correo,
        docente.celular
      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Administradores", true);
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
      const cuerpo = this.data.map((docente: Persona) => [
        docente.nombre,
        docente.apellido,
        docente.cedula,
        docente.correo,
        docente.celular
      ]);

      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Listado de Administradores", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }


}

declare var $: any;