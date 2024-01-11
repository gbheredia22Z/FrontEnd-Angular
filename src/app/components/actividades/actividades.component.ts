import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { TipoActividadService } from '../../services/tipo-actividad.service';
import { TipoActividad } from '../../models/tipo-actividad';
import Swal from 'sweetalert2';
import { ImpresionService } from '../../services/impresion.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.scss'
})
export class ActividadesComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(public tipoService:TipoActividadService,
    private fb:FormBuilder, private srvImpresion: ImpresionService)
    {
      this.myForm = this.fb.group({
        id: new FormControl('',Validators.required),
        nombreActividad :['', Validators.required]
      });
    }





  getTipoService(){
    this.tipoService.getTipoActividad().
    subscribe((res)=>{
      this.tipoService.tiposactividades = res as TipoActividad[];
      console.log(res);
    })
  }
  getActividades(){
    this.tipoService.getTipoActividad().
      subscribe((data) => {
        this.data = data;
        console.log(data);
        this.dtTrigger.next(this.dtOptions);
      });
  }

  ngOnInit():void{
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
    this.getTipoService();
    this.getActividades();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  //MODALES
  openAddActividadModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.tipoService.selectedActividad =new TipoActividad();

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

  editTipoActividad(tipoActividad:TipoActividad){
    //clona la actividad para evitar cambio directs
    this.tipoService.selectedActividad ={ ...tipoActividad};

    //abre el modal de edición
    const modal = document.getElementById('editModal');
    if(modal){
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; 
    }
  }

  updateTipoActividad(form:NgForm){
    const nombreActividad = form.value.nombreActividad;

    // Verifica si la actividad ya existe en la lista de tipos de actividad, excluyendo la actividad que se está editando
    const actividadExistente = this.tipoService.tiposactividades.find(actividad => actividad.nombreActividad === nombreActividad && actividad.id !== this.tipoService.selectedActividad.id);
  
    if (actividadExistente) {
      // Muestra un mensaje de error indicando que la actividad ya existe
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'La actividad ya existe para otro registro',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Continúa con la lógica original para la actualización de la actividad
      this.tipoService.putTipoActividad(this.tipoService.selectedActividad).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getTipoService();
  
        // Cierra el modal de edición utilizando $
        $('#editModal').modal('hide');
      });
    }
  }

  closeEditActividadModal():void{
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; 

  }
}

createTipoActividad(form: NgForm): void {
  const nombreActividad = form.value.nombreActividad;

  // Verifica si la actividad ya existe en la lista de tipos de actividad
  const actividadExistente = this.tipoService.tiposactividades.find(actividad => actividad.nombreActividad === nombreActividad);

  if (actividadExistente) {
    // Muestra un mensaje de error indicando que la actividad ya existe
    Swal.fire({
      position: 'top',
      icon: 'error',
      title: 'La actividad ya existe',
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
      });
    } else {
      if (form.valid) {
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
        });
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
onImprimir() {
  if (this.data.length > 0) {
    const encabezado = ["Nombre Actividad"];
    const cuerpo = this.data.map((grado: TipoActividad) => [
      grado.nombreActividad
      
    ]);

    this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Grado", true);
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
  if (this.data.length > 0) {
    const encabezado = ["Nombre Actividad"];
    const cuerpo = this.data.map((grado: TipoActividad) => [
      grado.nombreActividad
      
    ]);

    this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Listado de Tipo Actividades", true);
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
