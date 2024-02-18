import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, NgModel, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Asignatura } from '../../models/asignatura';
import { Subscription } from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { AsignaturaService } from '../../services/asignatura.service';
import { Asigngrados } from './asigngrados';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { ImpresionService } from '../../services/impresion.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrl: './asignatura.component.scss'
})
export class AsignaturaComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  data: any = []; //aqui se alamcena
  datos:any=[];
  dtTrigger: Subject<any> = new Subject<any>();
  myForm: FormGroup;
  searchQuery: any;
  onSearch: any;
  private subscriptions: Subscription[] = [];
  isEditModalOpen = false;
  asignatura: any;
  gradosasig: any;
  grados: any[] = [];
  searchResults: any[] = [];
  selectedGrados: any = null;
  grado:any;


  regresarPagina(): void {
    this.location.back();
  }
  
  getAsignatura2() {
    this.asignaturaService.getasignaturaWithGrado().subscribe((datos) => {
      this.asignatura = datos;
      console.log(datos)
    })
  }
  getAsignatura3() {
    this.asignaturaService.getasignaturaWithGrado().subscribe((datos) => {
      this.gradosasig = datos;
      console.log(datos)
    })
  }
  getAsignatura4() {
    this.asignaturaService.getasignaturaWithGrado().
      subscribe((data) => {
        this.data = data;
        console.log(data);
        this.dtTrigger.next(this.dtOptions);
      });
  }
  getAsignatura() {
    this.asignaturaService.getAsignatura().subscribe((res) => {
      this.asignaturaService.asignaturas = res as Asignatura[];
      console.log('Datos de asignatura cargados:', res);
    });
  }
  getAsignaturas() {
    this.asignaturaService.getAsignatura().subscribe((data) => {
      this.data = data;
      this.datos = data; // Aquí asignamos los datos a la variable 'datos'
      console.log('Datos de asignatura cargados:', data);
      this.dtTrigger.next(this.dtOptions);
    })
  }
  

  constructor(public asignaturaService: AsignaturaService, private fb: FormBuilder, private srvImpresion: ImpresionService, private location: Location) {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      anioLectivo: ['', Validators.required],
      estado: ['', Validators.required],
      nombreGrado: [''],
    });
  }


  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
    this.getAsignaturas();
 
    this.getGrado();
  }



  getGrados2() {
    console.log("Asignaturas:", this.asignaturaService.asignaturas);
  
    this.asignaturaService.getGrados().subscribe((res) => {
      console.log("Grados antes del filtro:", res);
  
      this.grados = res.filter(grado => !this.isGradoAssignedToAsignatura(grado.id));
  
      console.log("Grados después del filtro:", this.grados);
    });
  }

  getGrados3() {
    console.log("Asignaturas:", this.asignaturaService.asignaturas);
  
    this.asignaturaService.getGrados().subscribe((res) => {
      console.log("Grados antes del filtro:", res);
  
      this.grado = res.filter(grado => !this.isGradoAssignedToAsignatura(grado.id));
  
      console.log("Grados después del filtro:", this.grado);
    });
  }
  
  getGrado() {
    this.asignaturaService.getGrados().
      subscribe((datos) => {
        this.datos = datos;
        console.log("grados totales",datos);
        
      });
  }
  
  isGradoAssignedToAsignatura(gradoId: string): boolean {
    return this.asignaturaService.asignaturas?.some(asignatura => asignatura.idGrado === gradoId);
  }
  
  isGradoAsignadoToAsignatura(idGrado: string): boolean {
    return this.asignaturaService.asignaturas?.
      some(asignatura => asignatura.idGrado === idGrado) || false;
  }
  getNombreGrado(abreviatura: string): string {
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

  getNombreGrado2(idGrado: number): string {
    const grado = this.grados.find(grado => grado.id === idGrado);
    return grado ? grado.nombreGrado : 'Grado Desconocido';
  }
  


  

  getNombreGradoAsignatura(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      'P': 'Primer Grado',
      'S': 'Segundo Grado',
      'T': 'Tercer Grado',
      'C': 'Cuarto Grado',
      'Q': 'Quinto Grado',
      'X': 'Sexto Grado',
      'M': 'Séptimo Grado',
    };
  
    return nombresGrados[abreviatura] || abreviatura;
  }

  getNombreGradoNuevo(abreviatura: string): string {
    const nombresGrados: { [key: string]: string } = {
      1: 'Primer Grado',
      2: 'Segundo Grado',
      3: 'Tercer Grado',
      4: 'Cuarto Grado',
      5: 'Quinto Grado',
      6: 'Sexto Grado',
      7: 'Séptimo Grado',

    };
  
    return nombresGrados[abreviatura] || abreviatura;
  }
  
  
  
  getNombreCompletoGrado(abreviatura: string): string {
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
  getNombreReal(abreviatura: string): string {
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

  getNombreEdit(abreviatura: string): string {
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
  
  openGradosListaModal() {
    console.log("Total de grados:", this.grados.length);
    // Filtra los docentes que no están asignados a ningún grado
    //const docentesNoAsignados = this.docentes.filter(docente => !this.isDocenteAssignedToGrado(docente.id));

    const gradosNoAsignados = this.grados.filter(grado => !this.isGradoAsignadoToAsignatura(grado.id));
    console.log("Grados no asignados:", gradosNoAsignados.length);

    this.searchResults = gradosNoAsignados;

    // Abre el nuevo modal de la lista de docentes
    const docenteListModal = document.getElementById('gradoListModal');
    if (docenteListModal) {
      docenteListModal.classList.add('show');
      docenteListModal.style.display = 'block';
    }
  }
  closeGradoListModal(): void {

    const docenteListModal = document.getElementById('gradoListModal');
    if (docenteListModal) {
      docenteListModal.classList.remove('show');
      docenteListModal.style.display = 'none';
    }
  }
  updateSelectedEstudianteName(newValue: string) {
    // Actualiza el nombre del docente en el formulario
    this.myForm.patchValue({
      persId: this.selectedGrados?.id, // Asigna el ID del docente
      // Asegúrate de que el siguiente nombre de campo coincida con el campo real en tu formulario
      // Si el nombre del campo es diferente, ajústalo en consecuencia
      nombreGrado: newValue, // Asigna el nombre del docente
    });

    // Actualiza el nombre del docente en el objeto selectedDocentes
    if (this.selectedGrados) {
      this.selectedGrados = { ...this.selectedGrados, nombreGrado: newValue };
    } else {
      this.selectedGrados = { nombreGrado: newValue };
    }
  }

  cargarGrado(grado: any) {
    this.selectedGrados = grado;
    this.updateSelectedEstudianteName(grado.nombreGrado);

    // Cierra el modal de la lista de docentes
    this.closeGradoListModal();
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
    if (form.valid) {
      // Verifica si hay un ID de grado seleccionado
      if (this.selectedGrados && this.selectedGrados.id) {
        console.log('ID de grado seleccionado:', this.selectedGrados.id);

        // Actualización o nuevo registro
        if (form.value.id) {
          // Actualización
          form.value.idGrado = this.selectedGrados.id;
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
            this.irPagina();
          });
        } else {
          // Nuevo registro
          form.value.idGrado = this.selectedGrados.id;
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
            this.irPagina();
          });
        }
      } else {
        // Manejo de error si no hay un ID de grado seleccionado o si su propiedad 'id' es undefined
        console.error('Error: No se ha seleccionado un ID de grado válido.');
      }
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

  updateAsignatura(form: NgForm): void {
    console.log('Intentando actualizar asignatura con el formulario:', form.value);
  
    // Verifica si hay un ID válido para la asignatura
    const asignaturaId = form.value.id;
    if (asignaturaId) {
      console.log('ID de la asignatura válido:', asignaturaId);
  
      // Continúa con el resto del código...
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
        this.irPagina();
      });
  
    } else {
      // Manejo de error si no hay un ID válido para la asignatura
      console.error('Error: ID de la asignatura no válido para la actualización.');
    }
  }
  
  irPagina(){
    window.location.reload();
  }

  closeAddAsignaturaModal(): void {
    const modal = document.getElementById('addAsignaturaModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }
  onImprimir() {
    if (this.data.length > 0) {
      const encabezado = ["Asignatura", "Estado"];
      const cuerpo = this.data.map((grado: Asignatura) => [
        grado.nombreMateria,
        grado.estado === 'A' ? 'Activo' : 'Inactivo'


      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Asignaturas", true);
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
      const encabezado = ["Asignatura", "Estado","GradoID"];
      const cuerpo = this.data.map((grado: Asignatura) => [
        grado.nombreMateria,
        grado.estado === 'A' ? 'Activo' : 'Inactivo',
        grado.idGrado


      ]);

      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Listado de Asignaturas", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }

  editAsignatura(asignatura: Asignatura) {
    // Clonar asignatura para evitar cambios directos
    this.asignaturaService.selectedAsignatura = { ...asignatura };
  
    // Obtener el nombre del grado asociado a la asignatura
    this.asignaturaService.getGradoById(asignatura.idGrado).subscribe((grado: any) => {
      if (grado) {
        // Actualizar el nombre del grado directamente en el formulario
        this.myForm.patchValue({
          nombreGrado: grado.nombreGrado
        });
      }
  
      // Establecer this.selectedGrados con los detalles del grado
      this.selectedGrados = grado || {};
  
      // Abre el modal de edición
      const modal = document.getElementById('editModal');
      if (modal) {
        modal.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
        modal.style.display = 'block'; // Establece el estilo 'display' en 'block'
      }
    });
  }
  
  closeEditAsignaturaModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  isAsigaturaAlreadyExists(nombreMateria: string): boolean {
    return this.asignaturaService.asignaturas.some(grado => grado.nombreMateria === nombreMateria);
  }

}

declare var $: any;