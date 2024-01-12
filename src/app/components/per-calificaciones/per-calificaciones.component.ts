import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable, Subject, Subscription, catchError, map, of } from 'rxjs';
import { PerCalificacionesService } from '../../services/per-calificaciones.service';
import { PerCalificaciones } from '../../models/per-calificaciones';
import { NgFor } from '@angular/common';
import Swal from 'sweetalert2';
import { ImpresionService } from '../../services/impresion.service';

@Component({
  selector: 'app-per-calificaciones',
  templateUrl: './per-calificaciones.component.html',
  styleUrl: './per-calificaciones.component.scss'
})
export class PerCalificacionesComponent {

  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  periodosCalificaciones: PerCalificaciones[] = []; // Agrega esta línea
  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(public perService:PerCalificacionesService,
    private fb:FormBuilder, private srvImpresion: ImpresionService){
      this.myForm = this.fb.group({
        id: new FormControl('',Validators.required),
        nombrePeriodo :['', Validators.required],
        estado:['', Validators.required],
      });
    }
    getPeriodoCalificaciones(){
      this.perService.getPeriodoCalificaciones()
      .subscribe((res)=>{
        this.perService.tiposPerCalificaciones = 
        res as PerCalificaciones[];
        console.log(res);
      })
    }

    getPeriodosCalificacion2(){
      this.perService.getPeriodoCalificaciones().
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
      this.getPeriodoCalificaciones();
      this.getPeriodosCalificacion2();
    }

    ngOnDestroy(): void {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    openAddActividadModal() {
      // Resetea el formulario antes de abrir el modal para un nuevo estudiante
      this.myForm.reset();
  
      // Crea una nueva instancia de Persona para evitar problemas con la edición
      this.perService.selectPerCalificaciones =new PerCalificaciones();
  
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
    editTipoActividad(perCalificaciones:PerCalificaciones){
      //clona la actividad para evitar cambio directs
      this.perService.selectPerCalificaciones ={ ...perCalificaciones};
  
      //abre el modal de edición
      const modal = document.getElementById('editModal');
      if(modal){
        modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
        modal.style.display = 'block'; 
      }
    }

    updatePeriodo(form: NgForm): void {
      const nombreActividad = form.value.nombreActividad;
      // Verifica si el periodo ya existe en la lista de periodos, excluyendo el periodo que se está editando
      const periodoExistente = this.perService.tiposPerCalificaciones.find(periodo => periodo.nombrePeriodo === nombreActividad && periodo.id !== this.perService.selectPerCalificaciones.id);
    
      if (periodoExistente) {
        // Muestra un mensaje de error indicando que el periodo ya existe
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'El periodo ya existe para otro registro',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Continúa con la lógica original para la actualización del periodo
        this.perService.putPerCalificacion(this.perService.selectPerCalificaciones).subscribe((res) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Registro actualizado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getPeriodoCalificaciones();
          this.irPagina();
    
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
  createPeriodo(form: NgForm): void {
    const nombrePeriodo = form.value.nombrePeriodo;
  
    // Verifica si el periodo ya existe en la lista de periodos
    const periodoExistente = this.perService.tiposPerCalificaciones.find(periodo => periodo.nombrePeriodo === nombrePeriodo);
  
    if (periodoExistente) {
      // Muestra un mensaje de error indicando que el periodo ya existe
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'El periodo ya existe',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Continúa con la lógica original para agregar o actualizar el periodo
      if (form.value.id) {
        this.perService.putPerCalificacion(form.value).subscribe((res) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Registro actualizado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getPeriodoCalificaciones();
          this.closeAddAvtividadModal();
          this.irPagina();
        });
      } else {
        if (form.valid) {
          this.perService.postPeriodoCalificacines(form.value).subscribe((res) => {
            form.reset();
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Nuevo registro agregado',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getPeriodoCalificaciones();
            this.closeAddAvtividadModal();
            this.irPagina();
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
  irPagina(){
    window.location.reload();
  }

  onImprimir() {
    if (this.data.length > 0) {
      const encabezado = ["Periodo Calificacion", "Estado"];
      const cuerpo = this.data.map((grado: PerCalificaciones) => [
        grado.nombrePeriodo,
        grado.estado,
        
      ]);
  
      this.srvImpresion.imprimir(encabezado, cuerpo, "Periodo de Calificaciones", true);
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
      const encabezado = ["Periodo Calificacion", "Estado"];
      const cuerpo = this.data.map((grado: PerCalificaciones) => [
        grado.nombrePeriodo,
        grado.estado,
        
      ]);
  
      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Periodo de Calificaciones", true);
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

