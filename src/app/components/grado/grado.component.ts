import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, NgModel, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Grado } from '../../models/grado';
import { Subscription } from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { GradoService } from '../../services/grado.service';
@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html',
  styleUrl: './grado.component.scss'
})
export class GradoComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;

  getGrado() {
    this.gradoService.getGrado().subscribe((res) => {
      this.gradoService.grados = res as Grado[];
      console.log(res);

    });
  }
  constructor(public gradoService: GradoService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      anioLectivo: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getGrado();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openAddGradoModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.gradoService.selectedGrado = new Grado();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addGradoModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addGradoModal').modal('hide');
  }

  createGrado(form: NgForm): void {
    if (form.value.id) {
      this.gradoService.putGrado(form.value).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getGrado();
        this.closeAddGradoModal();
      });
    } else {
      if (form.valid) {
        this.gradoService.postGrado(form.value).subscribe((res) => {
          form.reset();
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Nuevo registro agregado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getGrado();
          this.closeAddGradoModal();
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

  closeAddGradoModal(): void {
    const modal = document.getElementById('addGradoModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

}



declare var $: any;
