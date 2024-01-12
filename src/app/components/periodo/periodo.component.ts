import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, NgModel, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PeriodoService } from '../../services/periodo.service';
import { Periodo } from '../../models/periodo';
import { data } from 'jquery';
import { ImpresionService } from '../../services/impresion.service';


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
  data:any=[]; //aqui se alamcena
  dtOptions:DataTables.Settings={};
  dtTrigger:Subject<any> = new Subject<any>();



  getPeriodo() {
    this.periodoService.getPeriodo().subscribe((res) => {
      this.periodoService.periodos = res as Periodo[];
      console.log(res);

    });
  }

  getPeriodo2(){
    this.periodoService.getPeriodo().
      subscribe((data) => {
        this.data = data;
        console.log(data);
        this.dtTrigger.next(this.dtOptions);
      });
  }
  constructor(public periodoService: PeriodoService, private fb: FormBuilder, private srvImpresion:ImpresionService) 
  {
    this.myForm = this.fb.group({
      id: new FormControl('', Validators.required),
      anioLectivo: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //this.getPeriodo();
    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
    this.getPeriodo2();
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
  isGradoAlreadyExists(anioLectivo: string): boolean {
    return this.periodoService.periodos.some(grado => grado.anioLectivo === anioLectivo);
  }
  
  createPeriodo(form: NgForm): void {
    const anioLectivo = form.value.anioLectivo;
    console.log('Año Lectivo:', anioLectivo);
  
    // Verifica si el año lectivo ya existe en la lista de períodos
    console.log('Períodos en this.periodoService.periodos:', this.periodoService.periodos);
    const periodoExistente = this.periodoService.periodos.find(periodo => periodo.anioLectivo === anioLectivo);
    console.log('Período Existente:', periodoExistente);
    
    
    if (periodoExistente) {
      // Muestra un mensaje de error indicando que el período ya existe
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'El período ya existe',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Continúa con la lógica original para agregar o actualizar el período
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
            this.irPagina();
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
    const anioLectivo = form.value.anioLectivo;
  
    // Verifica si el año lectivo ya existe en la lista de períodos, excluyendo el período que se está editando
    const periodoExistente = this.periodoService.periodos.find(periodo => periodo.anioLectivo === anioLectivo && periodo.id !== this.periodoService.selectedPeriodo.id);
  
    if (periodoExistente) {
      // Muestra un mensaje de error indicando que el período ya existe
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'El año lectivo ya existe para otro período',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      // Continúa con la lógica original para la actualización del período
      this.periodoService.putPeriodo(this.periodoService.selectedPeriodo).subscribe((res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Registro actualizado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.getPeriodo();
        this.irPagina();
  
        // Cierra el modal de edición utilizando $
        $('#editModal').modal('hide');
      });
    }
  }
  

  closeEditPeriodoModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }
  onImprimir(){
    if (this.data.length > 0){
      const encabezado = ["Año Electivo", "Estado"];
      const cuerpo = this.data.map((periodo: Periodo) => [
        periodo.anioLectivo,
        periodo.estado,
      ]);
      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Periodos", true);
    }else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }

  imprimirExcel(){
    if (this.data.length > 0){
      const encabezado = ["Año Electivo", "Estado"];
      const cuerpo = this.data.map((periodo: Periodo) => [
        periodo.anioLectivo,
        periodo.estado,
      ]);
      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Listado de Periodos", true);
    }else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }

  irPagina(){
    window.location.reload();
  }

}




declare var $: any;


