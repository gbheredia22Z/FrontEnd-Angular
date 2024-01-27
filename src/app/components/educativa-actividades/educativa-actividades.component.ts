import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, Subscription, forkJoin, mergeMap } from 'rxjs';
import { EducativaActividadesService } from '../../services/educativa-actividades.service';
import { EducativaActividades } from '../../models/educativa-actividades';
import Swal from 'sweetalert2';
import { ImpresionService } from '../../services/impresion.service';

@Component({
  selector: 'app-educativa-actividades',
  templateUrl: './educativa-actividades.component.html',
  styleUrl: './educativa-actividades.component.scss'
})
export class EducativaActividadesComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  dtTrigger: Subject<any> = new Subject<any>();
  myForm: FormGroup;
  tipoActId: number;
  perCalId: number;
  asignaturaId: number;
  searchQuery: any;
  searchResults: any[] = [];
  selectedEstudiante: any = null;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  asignatura: any[] = [];
  actividad: any[] = [];
  periodoCalificacion: any[] = [];
  actividadesEducativas: any;

  constructor(public educativaService: EducativaActividadesService, private fb: FormBuilder,
    private srvImpresion: ImpresionService) {

    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      titulo: ['', Validators.required],
      detalleActividad: ['', Validators.required],
      fechaInicio: ['', Validators.required, this.validateFechaFin],
      fechaFin: ['', Validators.required],
      tipoActId: [null, Validators.required], // Inicializa con null o un valor por defecto
      perCalId: [null, Validators.required], // Inicializa con null o un valor por defecto
      asignaturaId: [null, Validators.required], // Inicializa con null o un valor por defecto
      estado: ['', Validators.required],
    });
  }

  minFechaActual(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Los meses comienzan desde 0
    const day = today.getDate();

    // Formatea la fecha en el formato requerido por los campos de fecha (YYYY-MM-DD)
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return formattedDate;
  }



  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
    this.getAsignaturas();
    this.getActividadesEducativas1();
    this.getActividadesEducativas();
    this.getperiodoCalificaciones();
    this.getActividades();

  }
  //obtener las asignaturas
  getAsignaturas() {
    this.educativaService.getAsignaturas().subscribe((res) => {
      this.asignatura = res;
    })
  }


  getActividades() {
    this.educativaService.getTipoActividad().subscribe((res) => {
      this.actividad = res;
    })

  }
  getperiodoCalificaciones() {
    this.educativaService.getPCalificaciones().subscribe((res) => {
      this.periodoCalificacion = res;
    })
  }

  //obtener actividades educatyivcas
  getActividadesEducativas() {
    this.educativaService.getActividadesEducativas().subscribe((res) => {
      this.educativaService.actividades = res as EducativaActividades[];
      console.log(res);
    })
  }

  getActividadesEducativas1() {
    this.educativaService.getActividadesEducativas().
      subscribe((data) => {
        this.actividadesEducativas = data;
        console.log(data);
        this.dtTrigger.next(this.dtOptions);
        this.dtTrigger.unsubscribe(); // Desactivar DataTables
      });
  }

  //para abrir el modal
  openAddEducativaModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.educativaService.selectedActividades = new EducativaActividades();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addEducativaModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addEducativaModal').modal('hide');
  }
  validateTitulo(control: FormControl): { [key: string]: boolean } | null {
    const nombreRegex = /^[a-zA-Z0-9\s]+$/;

    if (!nombreRegex.test(control.value)) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'El campo de nombre solo permite letras, espacios y números.',
      });
      return { 'nombreInvalido': true };
    }

    return null;
  }

  createActividadesEducativas(form: NgForm): void {
    const requiredFields = ['titulo', 'detalleActividad', 'fechaInicio', 'fechaFin', 'tipoActId', 'perCalId', 'asignaturaId', 'estado'];

    const isEmptyField = requiredFields.some(key => {
      const fieldValue = form.value[key];

      // Verificar si el campo es nulo o vacío
      return fieldValue === null || fieldValue === undefined || fieldValue === '';
    });

    if (isEmptyField) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Hay campos vacíos. Por favor, completa todos los campos antes de guardar.'
      });
      return;
    }
    const isValidTitulo = /^[a-zA-Z0-9\s]*$/.test(form.value.titulo);
    const isValidDetalle = /^[a-zA-Z0-9\s]*$/.test(form.value.detalleActividad);
    if (!isValidTitulo || !isValidDetalle) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Los campos de título y detalle solo deben contener letras, números y espacios.'
      });
      return;
    }
    const today = new Date();
    const fechaInicio = new Date(form.value.fechaInicio);
    const fechaFin = new Date(form.value.fechaFin);

    // Establecer horas, minutos, segundos y milisegundos a 0 para comparar solo fechas
    today.setHours(0, 0, 0, 0);
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);

    if (fechaInicio > today || fechaFin > today) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Las fechas de inicio y fin no pueden ser anteriores a la fecha actual.'
      });
      return;
    }
    if (form.value.id) {
      // Código para actualizar
      // ...
    } else {
      if (form.valid) {
        form.value.tipoActId = Number(form.value.tipoActId);
        form.value.perCalId = Number(form.value.perCalId);
        form.value.asignaturaId = Number(form.value.asignaturaId);

        console.log("tipoActId:", form.value.tipoActId);
        console.log("perCalId:", form.value.perCalId);
        console.log("asignaturaId:", form.value.asignaturaId);

        // Realizar ambas solicitudes al mismo tiempo utilizando mergeMap
        this.educativaService.postActividadesEducativas(form.value).pipe(
          mergeMap(resPostActividades => {
            console.log('Nuevo registro agregado', resPostActividades);
            // Realizar la solicitud a la otra API
            return this.educativaService.registrarNotasAsignatura(form.value.asignaturaId);
          })
        ).subscribe(
          resRegistrarNotas => {
            console.log('Resultado de registrarNotasAsignatura', resRegistrarNotas);

            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Nuevo registro agregado',
              showConfirmButton: false,
              timer: 1500,
            });

            this.closeAddEducativaModal();
            this.irListaActividades();
          },
          error => {
            console.error('Error al guardar:', error);
            Swal.fire({
              position: 'top',
              icon: 'error',
              title: 'Error al guardar el registro',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
      } else {
        console.log('problemas');
      }
    }
  }

  editActividadEducativa(actividadEducativa: ActividadEducativa) {
    // Clonar actividad educativa para evitar cambios directos
    this.educativaService.selectedActividades = { ...actividadEducativa };

    // Obtener el nombre y apellido del docente asociado a la actividad educativa


    // Abre el modal de edición utilizando jQuery
    $('#editModal').modal('show');

  }

  updateActividadEducativa(form: NgForm) {
    this.educativaService.putActividadEducativa(this.educativaService.selectedActividades).subscribe(
      (res) => {
        // Buscar el índice de la actividad educativa actualizada en la lista de actividades educativas
        const index = this.educativaService.actividadesEducativas.findIndex(
          actividad => actividad.id === this.educativaService.selectedActividades.id
        );

        if (index !== -1) {
          // Actualizar el nombre y apellido del docente en la lista de actividades educativas
          const persona = this.educativaService.selectedActividades.persona;
          this.educativaService.actividadesEducativas[index].persona.nombre = persona.nombre;
          this.educativaService.actividadesEducativas[index].persona.apellido = persona.apellido;
        }

        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });

        // Asume que tienes una función llamada goToPage para ir a la página deseada
        // Cierra el modal de edición utilizando jQuery
        $('#editModal').modal('hide');
      },
      (error) => {
        // Manejo de errores si es necesario
      }
    );
  }

  irPagina() {
    window.location.reload();
  }

  areFieldsEmpty(formData: any): boolean {
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && (formData[key] === null || formData[key] === '')) {
        return true;
      }
    }
    return false;
  }
  irListaActividades() {
    //this.router.navigate(["/estudiante"])
    window.location.reload()
  }

  //para cerrar el modal
  closeAddEducativaModal(): void {
    const modal = document.getElementById('addEducativaModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  formatoFecha(fecha: string): string {
    // Formatear la fecha como desees, aquí un ejemplo:
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return fechaFormateada;
  }

  onImprimir() {
    if (this.actividadesEducativas.length > 0) {
      const encabezado = ["Titulo", "Detalle", "Estado", "Fecha Fin", "Fecha Inicio", "Periodo",
        "Actividad", "Asignatura"];
      const cuerpo = this.actividadesEducativas.map((grado: EducativaActividades) => [
        grado.titulo,
        grado.detalleActividad,
        grado.estado === 'A' ? 'Activo' : 'Inactivo',
        this.formatoFecha(grado.fechaFin),
        this.formatoFecha(grado.fechaInicio),
        grado.periodoCalificaciones.nombrePeriodo,
        grado.tipoActividad.nombreActividad,
        grado.asignatura.nombreMateria
      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Actividades Educativas", true);
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
    if (this.actividadesEducativas.length > 0) {
      const encabezado = ["Titulo", "Detalle", "Estado", "Fecha Fin", "Fecha Inicio", "Periodo",
        "Actividad", "Asignatura"];
      const cuerpo = this.actividadesEducativas.map((grado: EducativaActividades) => [
        grado.titulo,
        grado.detalleActividad,
        grado.estado === 'A' ? 'Activo' : 'Inactivo',
        this.formatoFecha(grado.fechaFin),
        this.formatoFecha(grado.fechaInicio),
        grado.periodoCalificaciones.nombrePeriodo,
        grado.tipoActividad.nombreActividad,
        grado.asignatura.nombreMateria
      ]);

      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Actividades Educativas", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }


  // Método para validar que la fecha sea igual o posterior a hoy
  validateFechaInicio(control: FormControl): { [key: string]: boolean } | null {
    const fechaInicio = new Date(control.value);
    const hoy = new Date();

    if (fechaInicio < hoy) {
      return { 'fechaInvalida': true };
    }

    return null;
  }

  // Método para validar que la fecha sea igual o posterior a hoy
  validateFechaFin(control: FormControl): { [key: string]: boolean } | null {
    const fechaFin = new Date(control.value);
    const hoy = new Date();

    if (fechaFin < hoy) {
      return { 'fechaInvalida': true };
    }

    return null;
  }



}
declare var $: any;