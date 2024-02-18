import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaService } from '../../services/matricula.service';
import { Matricula } from '../../models/matricula';
import Swal from 'sweetalert2';
import { ImpresionService } from '../../services/impresion.service';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrl: './matricula.component.scss'
})


export class MatriculaComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  dtTrigger: Subject<any> = new Subject<any>();
  myForm: FormGroup;
  searchQuery: any;
  searchResults: any[] = [];
  selectedEstudiante: any = null;
  formData: any = {};
  // Objeto para el estudiante seleccionado
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  grados: any[] = [];
  periodos: any[] = [];
  estudiantes: any[] = [];
  matriculaLista: any;
  constructor(public matriculaServices: MatriculaService, private fb: FormBuilder,
    private srvImpresion: ImpresionService, private router: Router, private route: ActivatedRoute,
    private location: Location) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      estado: ['', Validators.required],
      nombreEstudiante: [''],
    });
  }

  regresarPagina(): void {
    this.location.back();
  }
  
  searchEstudiante() {
    this.selectedEstudiante = this.estudiantes.find(estudiante => estudiante.cedula === this.searchQuery);
  }

  updateSelectedEstudianteName(newValue: string) {
    //actualiza el nombre del estudiante en el formulari
    this.myForm.patchValue({
      idPersona: this.selectedEstudiante?.id,
      nombreEstudiante: newValue,
    });
    if (this.selectedEstudiante) {
      this.selectedEstudiante = { ...this.selectedEstudiante, nombre: newValue };
    } else {
      this.selectedEstudiante = { nombre: newValue };
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
  getGrado() {
    this.matriculaServices.getGrados().subscribe((res) => {
      this.grados = res;
    })
  }
  getPeriodos() {
    this.matriculaServices.getPeriodo().subscribe((res) => {
      this.periodos = res;
    })
  }

  getEstudiantes() {
    console.log("Matriculas:", this.matriculaServices.matriculas);
    this.matriculaServices.getEstudiantes().subscribe((res) => {
      console.log("Estudiantes antes del filtro:", res);
      this.estudiantes = res.filter(estudiante => !this.isEstudianteAssignedToMatricula(estudiante.id));
      console.log("Estudiantes después del filtro:", this.estudiantes);
    });
  }

  isEstudianteAsignadoToMatricula(estudianteId: string): boolean {
    return this.matriculaServices.matriculas?.
      some(matricula => matricula.idPersona === estudianteId) || false;
  }

  getGrados(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      P: 'Primer Grado',
      S: 'Segundo Grado',
      T: 'Tercer Grado',
      C: 'Cuarto Grado',
      Q: 'Quinto Grado',
      X: 'Sexto Grado',
      M: 'Séptimo Grado',
    };



    return nombresGrados[abreviatura] || abreviatura;
  }
  getGradosTable(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      P: 'Primer Grado',
      S: 'Segundo Grado',
      T: 'Tercer Grado',
      C: 'Cuarto Grado',
      Q: 'Quinto Grado',
      X: 'Sexto Grado',
      M: 'Séptimo Grado',
    };
    return nombresGrados[abreviatura] || abreviatura;
  }


  getGradosEdit(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      P: 'Primer Grado',
      S: 'Segundo Grado',
      T: 'Tercer Grado',
      C: 'Cuarto Grado',
      Q: 'Quinto Grado',
      X: 'Sexto Grado',
      M: 'Séptimo Grado',
    };
    return nombresGrados[abreviatura] || abreviatura;
  }

  getMatricula() {
    this.matriculaServices.getMatricula().subscribe((res) => {
      this.matriculaServices.matriculas = res as Matricula[];
      console.log(res);
    });
  }
  getMatricula2() {
    this.matriculaServices.getMatricula().subscribe((data) => {
      this.matriculaServices.matriculas = data as Matricula[];
      this.matriculaLista = this.matriculaServices.matriculas;  // Asigna las matrículas al componente
      console.log(this.matriculaLista);
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


    // Verifica si ya hay un estudiante asignado a alguna asignatura
    if (this.selectedEstudiante && this.selectedEstudiante.id) {
      // Realiza una verificación adicional antes de permitir la matriculación
      if (this.isEstudianteAssignedToMatricula(this.selectedEstudiante.id)) {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'El estudiante ya está asignado a otra matrícula',
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
    }

    // Verifica si la asignatura ya existe


    // Utiliza directamente this.matriculaServices.selectedMatricula.id para la lógica de actualización
    if (this.matriculaServices.selectedMatricula.id) {
      // Asigna la información del estudiante seleccionado a la matrícula
      // Asigna la información del estudiante seleccionado a la matrícula
      form.value.idPersona = this.selectedEstudiante?.id;
      this.matriculaServices.putMatricula(this.matriculaServices.selectedMatricula).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.closeAddAsignaturaModal();
      });
    } else {
      // Lógica para la inserción, similar a tu código actual...

      if (form.valid) {
        // Asigna la información del estudiante seleccionado a la matrícula
        form.value.idPersona = this.selectedEstudiante?.id;

        this.matriculaServices.postMaticula(form.value).subscribe((res) => {
          form.reset();
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Nuevo registro agregado',
            showConfirmButton: false,
            timer: 1500,
          });
          //this.getMatricula();
          this.closeAddAsignaturaModal();
          this.irPagina();
        });
      } else {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Llene todos los campos',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  }




  isEstudianteAssignedToMatricula(matriculaId: string): boolean {
    return this.matriculaServices.matriculas?.some(matricula => matricula.idPersona === matriculaId) || false;
  }
  isAsignaturaAlreadyExists(nombreAsignatura: string): boolean {
    return this.matriculaServices.matriculas.some(matricula => matricula.grado && matricula.grado.nombreGrado === nombreAsignatura);
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

  openEstudianteListaModal() {
    console.log("Total de estudiantes:", this.estudiantes.length);

    const estudiantesNoAsignados = this.estudiantes.filter(estudiante => !this.isEstudianteAsignadoToMatricula(estudiante.id));
    console.log("Estudiantes no asignados:", estudiantesNoAsignados.length);

    this.searchResults = estudiantesNoAsignados;

    // ... Resto del código
    //abrir el nuevo modal
    const studenListaModal = document.getElementById('estudianteListModal');
    if (studenListaModal) {
      studenListaModal.classList.add('show');
      studenListaModal.style.display = 'block';
    }
  }


  openEstudianteListaModal2() {
    //filtra los estudiantes que no estan asignados a ninguna matrcula
    const estudiantesNoAsignados = this.estudiantes.filter(estudiante => !this.isEstudianteAsignadoToMatricula(estudiante.id));

    //asigna los estudiantes no asignaod s la lista
    this.searchResults = estudiantesNoAsignados;

    //abrir el nuevo modal
    const studenListaModal = document.getElementById('estudianteListModal2');
    if (studenListaModal) {
      studenListaModal.classList.add('show');
      studenListaModal.style.display = 'block';
    }
  }

  closeDocenteListModal(): void {

    const studenListaModal = document.getElementById('estudianteListModal');
    if (studenListaModal) {
      studenListaModal.classList.remove('show');
      studenListaModal.style.display = 'none';
    }
  }
  closeDocenteListModal2(): void {

    const studenListaModal = document.getElementById('estudianteListModal2');
    if (studenListaModal) {
      studenListaModal.classList.remove('show');
      studenListaModal.style.display = 'none';
    }
  }

  cargarStudiante(estudiante: any) {
    this.selectedEstudiante = estudiante;
    this.updateSelectedEstudianteName(estudiante.nombre);

    //cierra el modal
    this.closeDocenteListModal();
  }
  irPagina() {
    window.location.reload();
  }

  //editar matricula
  editMatricula(matricula: Matricula): void {
    // Clona la matrícula para evitar cambios directos
    this.matriculaServices.selectedMatricula = { ...matricula };

    // Agrega un console.log para imprimir el id seleccionado
    console.log('ID del registro seleccionado:', matricula.id);

    // Abre el modal de edición
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
    }
  }

  //update 
  updateMatricula(form: NgForm) {
    this.matriculaServices.putMatricula(this.matriculaServices.selectedMatricula).subscribe((res) => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });

      this.closeEditMatriculaModal();
      this.irPagina();

      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    });
  }




  closeEditMatriculaModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }
  cargarStudiante2(estudiante: any) {
    this.selectedEstudiante = estudiante;
    this.updateSelectedEstudianteName(estudiante.nombre);

    //cierra el modal
    this.closeDocenteListModal2();
  }
  onImprimir() {
    if (this.matriculaLista.length > 0) {
      const encabezado = ["Estado", "Nombre", "Apellido", "Grado", "Año Electivo"];
      const cuerpo = this.matriculaLista.map((matricula: Matricula) => [
        matricula.estado,
        matricula.persona.nombre,
        matricula.persona.apellido,
        matricula.grado.nombreGrado,
        matricula.periodo.anioLectivo,
      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Matrícula", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }
  imprimirExcel() {
    if (this.matriculaLista.length > 0) {
      const encabezado = ["Estado", "Nombre", "Apellido", "Grado", "Año Electivo"];
      const cuerpo = this.matriculaLista.map((matricula: Matricula) => [
        matricula.estado,
        matricula.persona.nombre,
        matricula.persona.apellido,
        matricula.grado.nombreGrado,
        matricula.periodo.anioLectivo,
      ]);

      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Listado de Matrícula", true);
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