import { Component } from '@angular/core';
import { NotasService } from '../../services/notas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Notas } from '../../models/notas';
import { Persona } from '../../models/persona';
import { ImpresionService } from '../../services/impresion.service';
import { NotasDTO } from '../../models/notas-dto';
import { Notasdtoall } from '../../models/notasdtoall';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss']
})
export class NotasComponent {
  editarNotasHabilitado: boolean = false;
  formulario: FormGroup;
  dtOptions: DataTables.Settings = {};
  data: any[] = [];
  notasEditadas: { [id: number]: string } = {};

  dtTrigger: Subject<any> = new Subject<any>();
  private subscriptions: Subscription[] = [];
  asignaturas: any[] = [];
  grados: any[] = [];
  actividadesEducativas: any;
  selectedAsignaturaId: number | null = null;
  selectedActividadId: number | null = null;
  actividades: any[] = [];
  notas: any = [];
  selectedNota: Notas = new Notas();
  datos: NotasDTO[] = [];
  selectDTO: NotasDTO = new NotasDTO();
  datosfinales: Notasdtoall[] = [];
  selectNotasDto: Notasdtoall = new Notasdtoall();
  filasModificadas: Set<number> = new Set<number>();
  selectedGradoId: number | null = null;

  constructor(public notaService: NotasService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private srvImpresion: ImpresionService) {
    this.formulario = this.fb.group({
      actividad: [null],  // Utiliza un array para establecer el valor inicial
      asignatura: [null],
      nombre: [''],
      actividadEducativaTitulo: [''],
      idAsignatura: [''],
      nota: [''], // Asegúrate de que este campo esté definido en tu formulario
      direccion: [''],
    });
  }
  estadoAsignacion: { [id: string]: boolean } = {};
  mostrarAlerta: boolean = false;


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const asignaturaId = params.get('asignaturaId');
      console.log('Asignatura ID:', asignaturaId);
    });
    this.formulario.get('grado')?.valueChanges.subscribe((gradoId) => {
      this.selectedGradoId = gradoId;
      this.onGradoSelected();
    });


    this.formulario.get('asignatura')?.valueChanges.subscribe((asignaturaId) => {
      this.selectedAsignaturaId = asignaturaId;
      this.onAsignaturaSelected();
    });

    this.formulario.get('actividad')?.valueChanges.subscribe((actividadId) => {
      this.selectedActividadId = actividadId;
      this.onActividadSelected();
    });

    this.getAsignaturas();
    this.getActividadesEducativas();
    this.getEstudiante();
    this.getNotas();
    this.getGrados();

    this.dtOptions = {
      language: {
        url: "/assets/Spanish.json"
      },
    };
  }

  guardarCambiosNotas() {
    if (!this.editarNotasHabilitado) {
      // Itera sobre los resultados para guardar los cambios en los datos finales
      for (const result of this.datosfinales) {
        // Obtenemos el valor actual de la nota en el contenido editable
        const editable = document.getElementById(result.idNota);
        if (editable) {
          result.nota = +editable.innerText;
        }
      }
    }
  }
  
  


  getAsignaturas() {
    // Verifica que selectedGradoId no sea null antes de llamar a la función
    if (this.selectedGradoId !== null) {
      this.notaService.getAsignaturasPorGrado(this.selectedGradoId).subscribe((res) => {
        this.asignaturas = res;
      });
    } else {
      // Manejar el caso donde selectedGradoId es null
      console.error('Error: selectedGradoId es null');
    }
  }
  getGrados() {
    // Asumiendo que tienes un método en tu servicio para obtener los grados
    this.notaService.getGrados().subscribe((res) => {
      this.grados = res;
      console.log(this.grados);
    });
  }

  getActividadesEducativas() {
    this.notaService.getActividadesEducativas().subscribe((res) => {
      this.actividadesEducativas = res;
    });
  }

  onAsignaturaSelected() {
    if (this.selectedAsignaturaId !== null) {
      this.notaService.getActividadesPorAsignatura(this.selectedAsignaturaId).subscribe((actividades) => {
        this.actividades = actividades;

        // Establece la actividad seleccionada a null cuando cambia la asignatura
        this.selectedActividadId = null;
      });
    }
  }

  onActividadSelected() {
    if (this.selectedAsignaturaId !== null && this.selectedActividadId !== null) {
      this.notaService.getAllNotas(this.selectedAsignaturaId, this.selectedActividadId).subscribe(
        (res: Notasdtoall[]) => {
          console.log("ID asignatura:" + this.selectedAsignaturaId);
          console.log("ID actividad:" + this.selectedActividadId);
          console.log('Datos recibidos:', res);
          this.datosfinales = res;
        },
        error => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }
  onGradoSelected() {
    if (this.selectedGradoId !== null) {
      this.getAsignaturas();
      this.actividades = [];// Actualiza las asignaturas al seleccionar un grado
    }
  }

  //modal para abrir formulario

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  editNotas(datos: NotasDTO) {
    console.log("valor nota: ", datos.nota);
    console.log("valor direccion: ", datos.direccion);
    this.notaService.selectDTO = { ...datos };
    this.formulario.patchValue({
      nombre: `${datos.nombre} ${datos.apellido}`,
      actividadEducativaTitulo: datos.actividadEducativaTitulo,
      idAsignatura: datos.idAsignatura,
      nota: datos.nota, // Asegúrate de usar el nombre correcto del campo
      direccion: datos.direccion
    });

    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  editarNotas(datosfinales: Notasdtoall) {
    console.log("valor nota: ", datosfinales.nota);
    //console.log("valor direccion: ", datosfinales.direccion);
    this.notaService.seleccionarDto = { ...datosfinales };
    this.formulario.patchValue({
      nombre: `${datosfinales.nombre} ${datosfinales.apellido}`,
      actividadEducativaTitulo: datosfinales.tituloActividad,
      idAsignatura: datosfinales.idAsignatura,
      nota: datosfinales.nota, // Asegúrate de usar el nombre correcto del campo

    });

    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }


  editNotas2(estudianteId: string) {
    // Obtener el nombre del estudiante asociado a la nota
    this.notaService.getEstudianteById(estudianteId).subscribe((estudiante: any) => {
      console.log("Estudiante:", estudiante);

      if (estudiante) {
        // Actualizar el nombre del docente directamente en el formulario
        this.formulario.patchValue({
          nombre: `${estudiante.nombre} ${estudiante.apellido}`,

        });
      }

      // Abre el modal de edición
      const modal = document.getElementById('editModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
      }
    });
  }

  closeEditPeriodoModal(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      modal.classList.remove('show'); // Quita la clase 'show' para ocultar el modal
      modal.style.display = 'none'; // Establece el estilo 'display' en 'none'
    }
  }

  getEstudiante() {
    this.notaService.getEstudiante().subscribe((res) => {
      this.notaService.estudiantes = res as Persona[];
      console.log(res);

    });
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

  onImprimir() {
    if (this.datosfinales.length > 0) {
      const encabezado = ["Estudiante", "Actividad", "Asignatura", "Nota"];
      const cuerpo = this.datosfinales.map((nota: Notasdtoall) => [
        nota.nombre + " " + nota.apellido,
        nota.tituloActividad,
        nota.nombreAsignatura,
        nota.nota
      ]);

      this.srvImpresion.imprimir(encabezado, cuerpo, "Listado de Calificaciones", true);
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
    if (this.datosfinales.length > 0) {
      const encabezado = ["Estudiante", "Actividad", "Asignatura", "Nota"];
      const cuerpo = this.datosfinales.map((nota: Notasdtoall) => [
        nota.nombre + " " + nota.apellido,
        nota.tituloActividad,
        nota.nombreAsignatura,
        nota.nota
      ]);

      this.srvImpresion.imprimirExcel(encabezado, cuerpo, "Listado de Calificaciones", true);
    } else {
      // Muestra un mensaje de alerta si no hay datos para imprimir
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay datos para generar el informe PDF.',
      });
    }
  }

  getNotas() {
    this.notaService.getNotas().subscribe((res) => {
      this.notaService.notas = res as Notas[];
      console.log("Notas", res);
    })
  }
  notaEditando: any = null;
  activarEdicion(result: any) {
    this.notaEditando = result;
  }

  desactivarEdicion(result: any) {
    // Llama a tu método de asignarNota aquí
    this.asignarNota(result.id, result.nota);
    this.notaEditando = null;
    alert("nota actualizada")
  }


  // En tu componente
  asignarNota(id: string, event: FocusEvent) {
    const targetElement = event.target as HTMLElement;


    if (targetElement) {
      const nuevaNota = targetElement.innerText;

      // Expresión regular para validar que el valor es un número
      const regexSoloNumeros = /^\d+$/;

      if (!regexSoloNumeros.test(nuevaNota)) {
        // Muestra un mensaje de error indicando que solo se permiten números
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'Ingrese solo números en la nota',
          showConfirmButton: false,
          timer: 1500,
        });
        // Puedes decidir si quieres limpiar el contenido del elemento después de mostrar el mensaje de error
        // targetElement.innerText = '';
        return;
      }

      const valor_nota = +nuevaNota;

      // Validación de que la nota sea mayor a 20
      if (valor_nota > 20) {
        // Muestra un mensaje de error indicando que la nota no puede ser mayor a 20
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'La nota no puede ser mayor a 20',
          showConfirmButton: false,
          timer: 1500,
        });
        // Puedes decidir si quieres limpiar el contenido del elemento después de mostrar el mensaje de error
        // targetElement.innerText = '';
        return;
      }

      console.log('Antes de asignar la nota - ID:', id, 'Nueva Nota:', valor_nota);

      this.notaService.asignarNota(id, valor_nota).subscribe(
        (response) => {
          console.log('Después de asignar la nota - ID:', id, 'Nueva Nota:', valor_nota);
          console.log('Nota asignada exitosamente:', response);
          // Marcar la nota como asignada en el estado después de asignarla
          this.estadoAsignacion[id] = true;
          console.log("estado asignacions", this.estadoAsignacion);
        },
        (error) => {
          console.error('Error al asignar la nota:', error);
        }
      );
    }
  }


  todasFilasAsignadas(): boolean {
    // Verifica si todas las filas modificadas han sido asignadas
    for (const id of this.filasModificadas) {
      if (!this.notaAsignada(id)) {
        return false;
      }
    }
    return true;
  }
  todasLasNotasAsignadas(): boolean {
    const idsNotas = this.datosfinales.map((result) => result.idNota);
    return idsNotas.every((id) => this.estadoAsignacion[id]);
  }


  notaAsignada(id: number): boolean {
    // Verifica si la nota está marcada como asignada en el estado
    return this.estadoAsignacion[id] || false;
  }
  

}
