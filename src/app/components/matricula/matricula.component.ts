import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { MatriculaService } from '../../services/matricula.service';
import { Matricula } from '../../models/matricula';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrl: './matricula.component.scss'
})


export class MatriculaComponent implements OnInit, OnDestroy {

  dtOptions:DataTables.Settings={};
  data:any=[]; //aqui se alamcena
  dtTrigger:Subject<any> = new Subject<any>();
  myForm: FormGroup;
  searchQuery: any;
  searchResults: any[] = [];
  selectedEstudiante: any = null;


  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  grados: any[] = [];
  periodos : any[] = [];
  estudiantes : any[] = [];
  matriculaLista:any;
  constructor(public matriculaServices: MatriculaService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      estado: ['', Validators.required],
    });
  }

  searchEstudiante() {
    this.selectedEstudiante = this.estudiantes.find(estudiante => estudiante.cedula === this.searchQuery);
  }
  
  updateSelectedEstudianteName(newValue: string) {
    if (this.selectedEstudiante) {
      this.selectedEstudiante = { ...this.selectedEstudiante, nombre: newValue };
    } else {
      this.selectedEstudiante = { nombre: newValue };
    }
  }
  // En tu componente

  // buscarEstudiante() {
  //   this.matriculaServices.getEstudiantes().subscribe((estudiantes) => {
  //     this.selectedEstudiante = estudiantes.find(estudiante => estudiante.cedula === this.searchQuery) || { nombre: null };
  //   });
  // }
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
    const estudianteEncontrado = this.estudiantes.find(estudiante => estudiante.cedula === this.searchQuery);

    if (!estudianteEncontrado) {
      // Muestra una alerta si no se encuentra el estudiante con la cédula proporcionada
      Swal.fire({
        icon: 'error',
        title: 'Estudiante no encontrado',
        text: 'No se encontró ningún estudiante con la cédula proporcionada.',
      });
      // Limpia el valor de selectedEstudiante si no se encontró ningún estudiante
      this.matriculaServices.selectedEstudiante = null;
    } else {
      // Asigna el estudiante encontrado a selectedEstudiante
      this.matriculaServices.selectedEstudiante = estudianteEncontrado;

      // Muestra una alerta informando que el estudiante fue encontrado
      Swal.fire({
        icon: 'success',
        title: 'Estudiante encontrado',
        text: `Estudiante ${estudianteEncontrado.nombre} ${estudianteEncontrado.apellido} encontrado.`,
      });
    }
  }
  
  previousCedulaValue: string = ''; // Agrega esta línea
  onCedulaInput() {
    // Limpia el nombre del estudiante si se borra la cédula
    if (!this.searchQuery) {
      this.matriculaServices.selectedEstudiante = null;
    }
  }
  onCedulaChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;

    // Verifica si la longitud del nuevo valor es menor que la longitud del valor anterior
    if (newValue.length < this.previousCedulaValue.length) {
      // Limpia el nombre del estudiante si se borra un dígito
      this.matriculaServices.selectedEstudiante = null;
    }

    // Actualiza el valor anterior
    this.previousCedulaValue = newValue;
  }

  //obtener los grados
  getGrado(){
    this.matriculaServices.getGrados().subscribe((res)=>{
      this.grados = res;
    })
  }
  getPeriodos(){
    this.matriculaServices.getPeriodo().subscribe((res)=>{
      this.periodos = res;
    })
  }
  getEstudiantes(){
    this.matriculaServices.getEstudiantes().subscribe((res)=>{
      this.estudiantes = res;
      console.log(res);
    })
  }

  getMatricula() {
    this.matriculaServices.getMatricula().subscribe((res) => {
      this.matriculaServices.matriculas = res as Matricula[];
      console.log(res);
    });
  }
  getMatricula2(){
    this.matriculaServices.getMatricula().
    subscribe((data) => {
      this.matriculaLista = data;
      console.log(data);
      this.dtTrigger.next(this.dtOptions);
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
    //funcion para traer matriuclas
    this.getMatricula();
    this.getMatricula2();
    this.getEstudiantes();
    this.getGrado();
    this.getPeriodos();
  }

  //para abrir el modal
  openAddAsignaturaModal() {
    // Resetea el formulario antes de abrir el modal para un nuevo estudiante
    this.myForm.reset();

    // Crea una nueva instancia de Persona para evitar problemas con la edición
    this.matriculaServices.selectedMatricula = new Matricula();

    // Abre el modal de añadir estudiante
    const modal = document.getElementById('addMatriculaModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
    $('#addMatriculaModal').modal('hide');
  }

  //para cerrar el modal
  closeAddAsignaturaModal(): void {
    const modal = document.getElementById('addMatriculaModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }


  createAsignatura(form: NgForm): void {
    if (!form.value.id) {
      if (!form.valid) {
        // Formulario vacío
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Llene todos los campos',
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
  
      // Validar si no se encuentra un estudiante con la cédula proporcionada
      if (!this.matriculaServices.selectedEstudiante) {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'No se encuentra un estudiante con ese número de cédula',
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
  
      // Asigna la información del estudiante seleccionado a la matrícula
      form.value.idPersona = this.matriculaServices.selectedEstudiante.id;
      form.value.persona = {
        nombre: this.matriculaServices.selectedEstudiante.nombre,
        apellido: this.matriculaServices.selectedEstudiante.apellido
      };
  
      this.matriculaServices.postMaticula(form.value).subscribe((res) => {
        form.reset();
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Nuevo registro agregado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.closeAddAsignaturaModal();
      });
    } else {
      this.matriculaServices.putMatricula(form.value).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.closeAddAsignaturaModal();
      });
    }
  }
  
  

  
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

 
  filterByNameOrCedula(estudiantes: any[], searchQuery: string): any[] {
    if (!searchQuery) {
        return estudiantes; // Si no hay consulta de búsqueda, devuelve la lista completa
    }

    const query = searchQuery.toLowerCase();
    return estudiantes.filter(estudiante => 
        estudiante.nombre.toLowerCase().includes(query) ||
        estudiante.cedula.toLowerCase().includes(query)
    );
}

}
declare var $: any;