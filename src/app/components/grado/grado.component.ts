import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Grado } from '../../models/grado';
import { Subscription } from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { GradoService } from '../../services/grado.service';
import { Subject } from 'rxjs';
import jsPDF from 'jspdf';
import { ImpresionService } from '../../services/impresion.service';



@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html',
  styleUrl: './grado.component.scss'
})
export class GradoComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  dtTrigger: Subject<any> = new Subject<any>();
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

  getGrado2() {
    this.gradoService.getGrado().
      subscribe((data) => {
        this.data = data;
        console.log(data);
        this.dtTrigger.next(this.dtOptions);
      });
  }
  constructor(public gradoService: GradoService, private fb: FormBuilder, private srvImpresion: ImpresionService) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      anioLectivo: ['', Validators.required],
      estado: ['', Validators.required],
      nombreDocente: [''],
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
      // Filtra los docentes que no están asignados a ningún grado
      this.docentes = res.filter(docente => !this.isDocenteAssignedToGrado(docente.id));
    });
  }
  // getDocentes() {
  //   this.gradoService.getDocentes().subscribe((res) => {
  //     this.docentes = res;
  //   });
  // }


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
    // Actualiza el nombre del docente en el formulario
    this.myForm.patchValue({
      persId: this.selectedDocentes?.id, // Asigna el ID del docente
      // Asegúrate de que el siguiente nombre de campo coincida con el campo real en tu formulario
      // Si el nombre del campo es diferente, ajústalo en consecuencia
      nombreDocente: newValue, // Asigna el nombre del docente
    });

    // Actualiza el nombre del docente en el objeto selectedDocentes
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
        text: 'Por favor, ingrese la cédula del profesor.',
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

  editGrado(grado: Grado) {
    // Clonar grado para evitar cambios directos
    this.gradoService.selectedGrado = { ...grado };

    // Obtener el nombre del docente asociado al grado
    this.gradoService.getDocenteById(grado.persId).subscribe((docente: any) => {
      if (docente) {
        // Actualizar el nombre del docente directamente en el formulario
        this.myForm.patchValue({
          nombreDocente: `${docente.nombre} ${docente.apellido}`
        });
      }

      // Abre el modal de edición
      const modal = document.getElementById('editModal');
      if (modal) {
        modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
        modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
      }
    });
  }

  updateGrado(form: NgForm) {
    this.gradoService.putGrado(this.gradoService.selectedGrado).subscribe((res) => {
      // Buscar el índice del grado actualizado en la lista de grados
      const index = this.gradoService.grados.findIndex(grado => grado.id === this.gradoService.selectedGrado.id);

      if (index !== -1) {
        // Actualizar el nombre del docente en la lista de grados
        this.gradoService.grados[index].persona.nombre = this.gradoService.selectedGrado.persona.nombre;
      }

      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Registro actualizado',
        showConfirmButton: false,
        timer: 1500,
      });
      this.getGrado();
      this.irPagina();
      // Cierra el modal de edición utilizando $
      $('#editModal').modal('hide');
    })
  }
  irPagina() {
    window.location.reload();
  }


  closeEditPeriodoModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  createGrado(form: NgForm): void {
    // Verifica si ya hay un docente asignado a algún grado
    if (this.gradoService.selectedDocentes && this.gradoService.selectedDocentes.id) {
      // Realiza una verificación adicional antes de permitir la matriculación
      if (this.isDocenteAssignedToGrado(this.gradoService.selectedDocentes.id)) {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'El docente ya está asignado a otro grado',
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
    }
   
    if (form.value.id) {
      // Asigna la información del estudiante seleccionado a la matrícula
      form.value.persId = this.selectedDocentes?.id;
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
        this.irPagina();
      });
    } else {
      if (form.valid) {
         // Verifica si el grado ya existe
    if (this.isGradoAlreadyExists(form.value.nombreGrado)) {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'El grado ya existe',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
        // Asigna la información del estudiante seleccionado a la matrícula
        // form.value.persId = this.gradoService.selectedDocentes.id;
        // form.value.persona = {
        //   nombre: this.gradoService.selectedDocentes.nombre,
        //   apellido: this.gradoService.selectedDocentes.apellido
        // };
        // Asigna la información del estudiante seleccionado a la matrícula
        form.value.persId = this.selectedDocentes?.id;


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
          this.getPagina();
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


  isDocenteAssignedToGrado(docenteId: string): boolean {
    return this.gradoService.grados?.some(grado => grado.persId === docenteId) || false;
  }

  isGradoAlreadyExists(nombreGrado: string): boolean {
    return this.gradoService.grados.some(grado => grado.nombreGrado === nombreGrado);
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
  updateSelectedDocenteName(newValue: string) {
    if (this.gradoService.selectedDocentes) {
      this.gradoService.selectedDocentes.nombre = newValue;
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
  openDocenteListModal() {
    // Filtra los docentes que no están asignados a ningún grado
    const docentesNoAsignados = this.docentes.filter(docente => !this.isDocenteAssignedToGrado(docente.id));

    // Verifica si hay docentes disponibles
    if (docentesNoAsignados.length === 0) {
      // No hay docentes disponibles, muestra una alerta
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'No hay docentes disponibles',
        showConfirmButton: false,
        timer: 1500,
      });
      return; // Sale de la función para evitar abrir el modal sin datos
    }

    // Asigna los docentes no asignados a la lista que se mostrará en el modal
    this.searchResults = docentesNoAsignados;

    // Abre el nuevo modal de la lista de docentes
    const docenteListModal = document.getElementById('docenteListModal');
    if (docenteListModal) {
      docenteListModal.classList.add('show');
      docenteListModal.style.display = 'block';
    }
  }


  closeDocenteListModal(): void {

    const docenteListModal = document.getElementById('docenteListModal');
    if (docenteListModal) {
      docenteListModal.classList.remove('show');
      docenteListModal.style.display = 'none';
    }
  }

  getPagina() {
    window.location.reload();
  }

  onImprimir() {
    if (this.data.length > 0) {
      const encabezado = ["Grado", "Nombre", "Apellido"];
      const cuerpo = this.data.map((grado: Grado) => [
        grado.nombreGrado,
        grado.persona.nombre,
        grado.persona.apellido
      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Grado", true);
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
    if (this.data.length > 0) {
      const encabezado = ["Grado", "Nombre", "Apellido"];
      const cuerpo = this.data.map((grado: Grado) => [
        grado.nombreGrado,
        grado.persona.nombre,
        grado.persona.apellido
      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Grado", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }




  // ... Otro código ...

  cargarDocente(docente: any) {
    this.selectedDocentes = docente;
    this.updateSelectedEstudianteName(docente.nombre);

    // Cierra el modal de la lista de docentes
    this.closeDocenteListModal();
  }


  // ... Otro código ...





}



declare var $: any;
