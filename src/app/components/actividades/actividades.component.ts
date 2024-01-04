import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TipoActividadService } from '../../services/tipo-actividad.service';
import { TipoActividad } from '../../models/tipo-actividad';
import Swal from 'sweetalert2';

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

  constructor(public tipoService:TipoActividadService,
    private fb:FormBuilder)
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

  ngOnInit():void{
    this.getTipoService();
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
    this.tipoService.putTipoActividad(
      this.tipoService.selectedActividad
    ).subscribe((res)=>{
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getTipoService();

      //cierra el modela de edicion
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
declare var $: any;
