import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, Subscription, forkJoin, mergeMap } from 'rxjs';
import { EducativaActividadesService } from '../../services/educativa-actividades.service';
import { TipoActividadService } from '../../services/tipo-actividad.service';
import { TipoActividad } from '../../models/tipo-actividad';
import { EducativaActividades } from '../../models/educativa-actividades';
import Swal from 'sweetalert2';
import { ImpresionService } from '../../services/impresion.service';
import { Location } from '@angular/common';
import { PersonaService } from '../../services/persona.service'; // Importa tu servicio PersonaService
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-actividadesdocente',
  templateUrl: './actividadesdocente.component.html',
  styleUrl: './actividadesdocente.component.scss'
})
export class ActividadesdocenteComponent implements OnInit, OnDestroy {
  onSearch: any;
  gradoId: number;
  grados: any = [];
  datos: any = [];
  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  dtTrigger: Subject<any> = new Subject<any>();
  myForm: FormGroup;
  tipoActId: number;
  perCalId: number;
  asignaturaId: string;
  searchQuery: any;
  searchResults: any[] = [];
  selectedEstudiante: any = null;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  asignatura: any[] = [];
  actividad: any[] = [];
  periodoCalificacion: any[] = [];
  actividadesEducativas: any;
  grado: any[] = [];
  selectedGradoId: number | null = null;
  gradosasig: any;
  selectedGrados: any = null;
  selectedAsignaturaId: number | null = null;
  selectedActividadId: number | null = null;
  actividades: any[] = [];


  constructor(public educativaService: EducativaActividadesService, private fb: FormBuilder,
    private srvImpresion: ImpresionService, private personaService: PersonaService, private route: ActivatedRoute,
    private location: Location, public tipoService: TipoActividadService,) {

    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      titulo: ['', Validators.required],
      detalleActividad: ['', Validators.required],
      tipoActId: [null, Validators.required], // Inicializa con null o un valor por defecto
      perCalId: [null, Validators.required], // Inicializa con null o un valor por defecto
      asignaturaId: [null, Validators.required], // Inicializa con null o un valor por defecto
      estado: ['', Validators.required],
      nombreGrado: [''],
      nombreActividad: ['', Validators.required]
    });
  }

  regresarPagina(): void {
    this.location.back();
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
    this.route.params.subscribe((params: Params) => {
      console.log('Parámetro asignaturaId:', params['asignaturaId']);
      this.asignaturaId = params['asignaturaId'];
      // Llama a los métodos necesarios después de obtener el ID de la asignatura
      this.getGrados();
      this.dtOptions = {
        language: {
          url: "/assets/Spanish.json"
        }
      };
      this.getAsignaturas();
      this.getperiodoCalificaciones();
      this.getActividades();
      this.getActividadesEducativas1();
      this.getTipoService();
      this.getActividadesT();
    });
  }

  getGrados() {
    this.educativaService.getGrados().subscribe((res) => {
      this.grados = res;
      console.log("Grados", res);
    });
  }

  onGradoSelected() {
    if (this.selectedGradoId !== null) {
      this.getAsignaturas(); // Actualiza las asignaturas al seleccionar un grado
    }
  }

  onAsignaturaSelected() {
    if (this.selectedAsignaturaId !== null) {
      this.educativaService.selectedActividades.asignaturaId = this.selectedAsignaturaId;
      console.log('Asignatura seleccionada:', this.selectedAsignaturaId);
    } else {
      console.error('Error: No se ha seleccionado una asignatura.');
    }
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
  obtenerActividadesPorAsignatura(asignaturaId: string): void {
    this.educativaService.getActividadesPorAsignatura(asignaturaId).subscribe(
      actividades => {
        // Aquí puedes manejar las actividades obtenidas, por ejemplo, asignarlas a una propiedad en tu componente.
        console.log(actividades);
      },
      error => {
        console.error('Error al obtener actividades por asignatura:', error);
      }
    );
  }
  getActividadesEducativas1() {
    // Verifica si asignaturaId es válido antes de hacer la solicitud
    if (this.asignaturaId) {
      this.educativaService.getActividadesPorAsignatura(this.asignaturaId)
        .subscribe((data) => {
          this.actividadesEducativas = data;
          console.log(data);
          this.dtTrigger.next(this.dtOptions);
          this.dtTrigger.unsubscribe(); // Desactivar DataTables
        });
    } else {
      console.error('Error: asignaturaId no es válido.');
    }
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

  handleSeleccionMateria(materia: any) {
    this.educativaService.selectedActividades.asignaturaId = materia.id;
  }

  createActividadesEducativas(form: NgForm): void {
    const requiredFields = ['titulo', 'detalleActividad', 'fechaInicio', 'tipoActId', 'perCalId', 'estado'];
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

    // Establecer horas, minutos, segundos y milisegundos a 0 para comparar solo fechas
    today.setHours(0, 0, 0, 0);
    fechaInicio.setHours(0, 0, 0, 0);

    if (form.valid) {
      form.value.tipoActId = Number(form.value.tipoActId);
      form.value.perCalId = Number(form.value.perCalId);

      // Convertir asignaturaId a un número antes de pasarlo al servicio
      const asignaturaIdNum = parseInt(this.asignaturaId, 10); // o Number(this.asignaturaId);

      // Verifica si asignaturaId es nulo
      if (!isNaN(asignaturaIdNum)) {
        form.value.asignaturaId = asignaturaIdNum;

        console.log("tipoActId:", form.value.tipoActId);
        console.log("perCalId:", form.value.perCalId);
        console.log("asignaturaId:", form.value.asignaturaId);

        // Realizar ambas solicitudes al mismo tiempo utilizando mergeMap
        this.educativaService.postActividadesEducativas(form.value).pipe(
          mergeMap(resPostActividades => {
            console.log('Nuevo registro agregado', resPostActividades);
            // Ya no necesitas tomar el ID de la asignatura del formulario, sino que ya lo tienes
            // en educativaService.selectedActividades.asignaturaId
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
        console.error('Error: asignaturaId no es válido.');
      }
    }
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

  closeEditEducativaModal(): void {
    const modal = document.getElementById('editModal');
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
  getPeriodo(abreviatura: string): string {
    const nombrePeriodo: { [key: string]: string } = {
      P: 'Primer Trimestre',
      S: 'Segundo Trimestre',
      T: 'Tercer Trimestre',
    };
    return nombrePeriodo[abreviatura] || abreviatura;
  }

  getPeriodoEdit(abreviatura: string): string {
    const nombrePeriodo: { [key: string]: string } = {
      P: 'Primer Trimestre',
      S: 'Segundo Trimestre',
      T: 'Tercer Trimestre',
    };
    return nombrePeriodo[abreviatura] || abreviatura;
  }

  getNombreGrado(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      P: 'Primer Grado',
      S: 'Segundo Grado',
      T: 'Tercer Grado',
      C: 'Cuarto Grado',
      Q: 'Quinto Grado',
      X: 'Sexto Grado',
      M: 'Séptimo Grado',
    };
    return nombresGrados[abreviatura] || abreviatura;
  }

  getNombreGradosAñadir(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      P: 'Primer Grado',
      S: 'Segundo Grado',
      T: 'Tercer Grado',
      C: 'Cuarto Grado',
      Q: 'Quinto Grado',
      X: 'Sexto Grado',
      M: 'Séptimo Grado',
    };
    return nombresGrados[abreviatura] || abreviatura;
  }

  getNombreGrados(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      P: 'Primer Grado',
      S: 'Segundo Grado',
      T: 'Tercer Grado',
      C: 'Cuarto Grado',
      Q: 'Quinto Grado',
      X: 'Sexto Grado',
      M: 'Séptimo Grado',
    };
    return nombresGrados[abreviatura] || abreviatura;
  }

  editEducativas(educativasAc: EducativaActividades) {
    // Clona el estudiante para evitar cambios directos
    this.educativaService.selectedActividades = { ...educativasAc };
    // Abre el modal de edición
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
  }

  updateEstudiante(form: NgForm) {
    this.educativaService.putEducativaActividades(this.educativaService.selectedActividades).subscribe((res) => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.irListaActividades();
      this.closeAddEducativaModal();
      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }

  //TipoActividad

  getTipoService() {
    this.tipoService.getTipoActividad().
      subscribe((res) => {
        this.tipoService.tiposactividades = res as TipoActividad[];
        console.log(res);
      })
  }

  getActividadesT() {
    this.tipoService.getTipoActividad().
      subscribe((data) => {
        this.data = data;
        console.log(data);
      
      });
  }

  //MODALES
  openAddActividadModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.tipoService.selectedActividad = new TipoActividad();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addActividadModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addActividadModal').modal('hide');
  }

  closeAddAvtividadModal(): void {
    const modal = document.getElementById('addActividadModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  createTipoActividad(form: NgForm): void {
    const nombreActividad = form.value.nombreActividad;
    // Verifica si la actividad ya existe en la lista de tipos de actividad
    const actividadExistente = this.tipoService.tiposactividades.find(
      actividad => actividad.nombreActividad === nombreActividad
    );

    // Expresión regular para validar letras (puede incluir espacios, pero no caracteres especiales)
    const regexSoloLetras = /^[a-zA-Z\s]+$/;

    if (!regexSoloLetras.test(nombreActividad)) {
      // Muestra un mensaje de error indicando que el nombre de la actividad no es válido
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'Ingrese solo letras en el nombre de la actividad',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Continúa con la lógica original para agregar la actividad
      if (form.value.id) {
        this.tipoService.putTipoActividad(form.value).subscribe((res) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Registro actualizado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getTipoService();
          this.closeAddAvtividadModal();
          this.irPagina();
        });
      } else {
        if (form.valid) {
          if (actividadExistente) {
            // Muestra un mensaje de error indicando que la actividad ya existe
            this.mostrarErrorActividadExistente();
          } else {
            this.tipoService.postTipoActividad(form.value).subscribe((res) => {
              form.reset();
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Nuevo registro agregado',
                showConfirmButton: false,
                timer: 1500,
              });
              this.getTipoService();
              this.closeAddAvtividadModal();
              this.irPagina();
            });
          }
        } else {
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
  }

  // Agrega un nuevo método para mostrar el mensaje de error de actividad existente
  mostrarErrorActividadExistente() {
    Swal.fire({
      position: 'top',
      icon: 'error',
      title: 'La actividad ya existe',
      showConfirmButton: false,
      timer: 1500,
    });
  }

}



declare var $: any;
