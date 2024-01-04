import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Grado } from '../../models/grado';
import { Subscription } from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { GradoService } from '../../services/grado.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html',
  styleUrl: './grado.component.scss'
})
export class GradoComponent implements OnInit, OnDestroy {
  dtOptions:DataTables.Settings={};
  data:any=[]; //aqui se alamcena
  dtTrigger:Subject<any> = new Subject<any>();
  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  docentes: any[] = [];
  searchResults: any[] = [];
  selectedDocentes: any = null;


  getGrado() {
    this.gradoService.getGrado().subscribe((res) => {
      this.gradoService.grados = res as Grado[];
      console.log(res);
      //this.dtTrigger.next(this.dtOptions);

    });
  }

  getGrado2(){
    this.gradoService.getGrado().
    subscribe((data) => {
      this.data = data;
      console.log(data);
      this.dtTrigger.next(this.dtOptions);
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
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
    this.getGrado();
    this.getDocentes();
    this.getGrado2();
  }

  getDocentes() {
    this.gradoService.getDocentes().subscribe((res) => {
      this.docentes = res;
    });
  }

  ngOnDestroy(): void {
    //this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.dtTrigger.unsubscribe();
    
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
  searchDocente() {
    this.selectedDocentes = this.docentes.find(docente => docente.cedula === this.searchQuery);
  }
  updateSelectedEstudianteName(newValue: string) {
    if (this.selectedDocentes) {
      this.selectedDocentes = { ...this.selectedDocentes, nombre: newValue };
    } else {
      this.selectedDocentes = { nombre: newValue };
    }
  }
  buscarEstudiante() {
    if (!this.searchQuery) {
      // Muestra una alerta si el campo de búsqueda está vacío
      Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: 'Por favor, ingrese la cédula del estudiante.',
      });
      return;
    }

    // Utiliza la lista de estudiantes que ya has obtenido
    const estudianteEncontrado = this.docentes.find(docente => docente.cedula === this.searchQuery);

    if (!estudianteEncontrado) {
      // Muestra una alerta si no se encuentra el estudiante con la cédula proporcionada
      Swal.fire({
        icon: 'error',
        title: 'Docente no encontrado',
        text: 'No se encontró ningún estudiante con la cédula proporcionada.',
      });
      // Limpia el valor de selectedEstudiante si no se encontró ningún estudiante
      this.gradoService.selectedDocentes = null;
    } else {
      // Asigna el estudiante encontrado a selectedEstudiante
      this.gradoService.selectedDocentes = estudianteEncontrado;

      // Muestra una alerta informando que el estudiante fue encontrado
      Swal.fire({
        icon: 'success',
        title: 'Docente encontrado',
        text: `Docente ${estudianteEncontrado.nombre} ${estudianteEncontrado.apellido} encontrado.`,
      });
    }
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
        // Asigna la información del estudiante seleccionado a la matrícula
      form.value.persId = this.gradoService.selectedDocentes.id;
      form.value.persona = {
        nombre: this.gradoService.selectedDocentes.nombre,
        apellido: this.gradoService.selectedDocentes.apellido
      };
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


 
  
  onCedulaInput() {
    // Limpia el nombre del estudiante si se borra la cédula
    if (!this.searchQuery) {
      this.gradoService.selectedDocentes = null;
    }
  }
  filterByNameOrCedula(docentes: any[], searchQuery: string): any[] {
    if (!searchQuery) {
        return docentes; // Si no hay consulta de búsqueda, devuelve la lista completa
    }

    const query = searchQuery.toLowerCase();
    return docentes.filter(docentes => 
      docentes.nombre.toLowerCase().includes(query) ||
      docentes.cedula.toLowerCase().includes(query)
    );
}

}



declare var $: any;
