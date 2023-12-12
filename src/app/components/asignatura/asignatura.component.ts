import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, NgModel, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Asignatura } from '../../models/asignatura';
import { Subscription } from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { AsignaturaService } from '../../services/asignatura.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrl: './asignatura.component.scss'
})
export class AsignaturaComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;

  getAsignatura() {
    this.asignaturaService.getAsignatura().subscribe((res) => {
      this.asignaturaService.asignaturas = res as Asignatura[];
      console.log(res);

    });
  }
  constructor(public asignaturaService: AsignaturaService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      anioLectivo: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAsignatura();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openAddAsignaturaModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.asignaturaService.selectedAsignatura = new Asignatura();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addAsignaturaModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addAsignaturaModal').modal('hide');
  }

  createAsignatura(form: NgForm): void {
    if (form.value.id) {
      this.asignaturaService.putAsignatura(form.value).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getAsignatura();
        this.closeAddAsignaturaModal();
      });
    } else {
      if (form.valid) {
        this.asignaturaService.postAsignatura(form.value).subscribe((res) => {
          form.reset();
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Nuevo registro agregado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getAsignatura();
          this.closeAddAsignaturaModal();
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

  closeAddAsignaturaModal(): void {
    const modal = document.getElementById('addAsignaturaModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

}

declare var $: any;