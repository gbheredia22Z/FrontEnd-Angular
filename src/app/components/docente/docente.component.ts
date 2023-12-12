import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';


@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrl: './docente.component.scss'
})
export class DocenteComponent {
  myForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  onSearch: any;
  docentes: Persona[] = [];
  searchQuery: string = '';
  isEditModalOpen = false;

  getDocente() {
    this.personaService.getDocente().subscribe((res) => {
      this.personaService.docentes = res as Persona[];
      console.log(res);

    });
  }
  constructor(public personaService: PersonaService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', Validators.required],
      celular: ['', Validators.required],

    });
  }
  ngOnInit(): void {
    this.getDocente();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  

  openAddDocenteModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.personaService.selectedDocente = new Persona();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addDocenteModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addDocenteModal').modal('hide');
  }


  createDocente(form: NgForm): void {
    if (form.value.id) {
      this.personaService.putDocente(form.value).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getDocente();
        this.closeAddDocenteModal();
      });
    } else {
      if (form.valid) {
        this.personaService.postDocente(form.value).subscribe((res) => {
          form.reset();
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Nuevo registro agregado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.getDocente();
          this.closeAddDocenteModal();
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

  // Agregar un método para cerrar el modal de añadir estudiante
  closeAddDocenteModal(): void {
    const modal = document.getElementById('addDocenteModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  editDocente(docente: Persona) {
    // Clona el estudiante para evitar cambios directos
    this.personaService.selectedDocente = { ...docente };

    // Abre el modal de edición
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
  }

  updateDocente(form: NgForm) {
    this.personaService.putDocente(this.personaService.selectedDocente).subscribe((res) => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getDocente();

      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }

  closeEditDocenteModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }
}
declare var $: any;
