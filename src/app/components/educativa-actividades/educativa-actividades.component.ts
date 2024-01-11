import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, Subscription, forkJoin } from 'rxjs';
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
  dtOptions:DataTables.Settings={};
  data:any=[]; //aqui se alamcena
  dtTrigger:Subject<any> = new Subject<any>();
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
  actividad: any[] =[];
  periodoCalificacion:any[] =[];
  actividadesEducativas:any;

  constructor(public educativaService:EducativaActividadesService, private fb:FormBuilder, 
    private srvImpresion: ImpresionService){

    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      titulo: ['', Validators.required],
      detalleActividad: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      tipoActId: [null, Validators.required], // Inicializa con null o un valor por defecto
      perCalId: [null, Validators.required], // Inicializa con null o un valor por defecto
      asignaturaId: [null, Validators.required], // Inicializa con null o un valor por defecto
      estado: ['', Validators.required],
    });
  }



  ngOnInit():void{
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
  getAsignaturas(){
    this.educativaService.getAsignaturas().subscribe((res)=>{
      this.asignatura = res;
    })
  }

  getActividades(){
    this.educativaService.getTipoActividad().subscribe((res)=>{
      this.actividad = res;
    })
    
  }
  getperiodoCalificaciones(){
    this.educativaService.getPCalificaciones().subscribe((res)=>{
      this.periodoCalificacion = res;
    })
  }

  //obtener actividades educatyivcas
  getActividadesEducativas(){
    this.educativaService.getActividadesEducativas().subscribe((res)=>{
      this.educativaService.actividades = res as EducativaActividades[];
      console.log(res);
    })
  }

  getActividadesEducativas1(){
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

    createActividadesEducativas(form: NgForm): void {
      if (form.value.id) {
        // Código para actualizar
        // ...
      } else {
        if (form.valid) {
          form.value.tipoActId = Number(form.value.tipoActId);
          form.value.perCalId = Number(form.value.perCalId);
          form.value.asignaturaId = Number(form.value.asignaturaId);
    
          // Realizar el postActividadesEducativas
          const postActividadesEducativas$ = this.educativaService.postActividadesEducativas(form.value);
    
          // Realizar la solicitud a la otra API
          const registrarNotasAsignatura$ = this.educativaService.registrarNotasAsignatura(form.value.asignaturaId);
    
          // Combinar ambas solicitudes
          forkJoin([postActividadesEducativas$, registrarNotasAsignatura$]).subscribe(
            ([resPostActividades, resRegistrarNotas]) => {
              console.log('Nuevo registro agregado', resPostActividades);
              console.log('Resultado de registrarNotasAsignatura', resRegistrarNotas);
    
              form.reset();
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
            (error) => {
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


areFieldsEmpty(formData: any): boolean {
  for (const key in formData) {
    if (formData.hasOwnProperty(key) && (formData[key] === null || formData[key] === '')) {
      return true;
    }
  }
  return false;
}
irListaActividades(){
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
      const encabezado = ["Titulo", "Detalle", "Estado","Fecha Fin", "Fecha Inicio", "Periodo",
    "Actividad","Asignatura"];
      const cuerpo = this.actividadesEducativas.map((grado: EducativaActividades) => [
        grado.titulo,
        grado.detalleActividad,
        grado.estado  === 'A' ? 'Activo' : 'Inactivo',
        this.formatoFecha(grado.fechaFin),
        this.formatoFecha(grado.fechaInicio),
        grado.periodoCalificaciones.nombrePeriodo ,
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
  imprimirExcel(){
    if (this.actividadesEducativas.length > 0) {
      const encabezado = ["Titulo", "Detalle", "Estado","Fecha Fin", "Fecha Inicio", "Periodo",
    "Actividad","Asignatura"];
      const cuerpo = this.actividadesEducativas.map((grado: EducativaActividades) => [
        grado.titulo,
        grado.detalleActividad,
        grado.estado  === 'A' ? 'Activo' : 'Inactivo',
        this.formatoFecha(grado.fechaFin),
        this.formatoFecha(grado.fechaInicio),
        grado.periodoCalificaciones.nombrePeriodo ,
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




}
declare var $: any;