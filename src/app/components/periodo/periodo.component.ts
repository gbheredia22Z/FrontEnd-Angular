import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, NgModel, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PeriodoService } from '../../services/periodo.service';
import { Periodo } from '../../models/periodo';


@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrl: './periodo.component.scss'
})
export class PeriodoComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;


  getPeriodo() {
    this.periodoService.getPeriodo().subscribe((res) => {
      this.periodoService.periodos = res as Periodo[];
      console.log(res);

    });
  }
  constructor(public periodoService: PeriodoService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      anioLectivo: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPeriodo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openAddPeriodoModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.periodoService.selectedPeriodo =new Periodo();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addPeriodoModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addPeriodoModal').modal('hide');
  }

  createPeriodo(form: NgForm): void {
    if (form.value.id) {
      this.periodoService.putPeriodo(form.value).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getPeriodo();
        this.closeAddPeriodoModal();
      });
    } else {
      if (form.valid) {
        this.periodoService.postPeriodo(form.value).subscribe((res) => {
          form.reset();
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Nuevo registro agregado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getPeriodo();
          this.closeAddPeriodoModal();
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

  closeAddPeriodoModal(): void {
    const modal = document.getElementById('addPeriodoModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  
  editPeriodo(periodo: Periodo) {
    // Clona el estudiante para evitar cambios directos
    this.periodoService.selectedPeriodo = { ...periodo };

    // Abre el modal de edición
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
  }

  updatePeriodo(form: NgForm) {
    this.periodoService.putPeriodo(this.periodoService.selectedPeriodo).subscribe((res) => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getPeriodo();

      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }

  closeEditPeriodoModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

}


declare var $: any;


