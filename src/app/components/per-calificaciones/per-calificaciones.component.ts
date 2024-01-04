import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PerCalificacionesService } from '../../services/per-calificaciones.service';
import { PerCalificaciones } from '../../models/per-calificaciones';
import { NgFor } from '@angular/common';
import Swal from 'sweetalert2';

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

  constructor(public perService:PerCalificacionesService,
    private fb:FormBuilder){
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

    ngOnInit():void{
      this.getPeriodoCalificaciones();
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

    updateTipoActividad(form:NgForm){
      this.perService.putPerCalificacion(
        this.perService.selectPerCalificaciones
      ).subscribe((res)=>{
        Swal.fire({
          position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
        });
        this.getPeriodoCalificaciones();

        //cieera
        $('#editModal').modal('hide');

      });
    }
    closeEditActividadModal():void{
      const modal = document.getElementById('editModal');
      if (modal) {
        modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
        modal.style.display = 'none'; 
  
    }
  }
  createPeriodo(form: NgForm): void {
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

declare var $: any;

