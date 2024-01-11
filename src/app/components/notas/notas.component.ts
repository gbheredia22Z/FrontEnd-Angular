import { Component } from '@angular/core';
import { NotasService } from '../../services/notas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Notas } from '../../models/notas';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss']
})
export class NotasComponent {
  formulario: FormGroup;
  dtOptions: DataTables.Settings = {};
  data: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  private subscriptions: Subscription[] = [];
  asignaturas: any[] = [];
  actividadesEducativas: any;
  selectedAsignaturaId: number | null = null;
  selectedActividadId: number | null = null;
  actividades: any[] = [];

  constructor(public notaService: NotasService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.formulario = this.fb.group({
      actividad: [null],  // Utiliza un array para establecer el valor inicial
      asignatura: [null]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const asignaturaId = params.get('asignaturaId');
      console.log('Asignatura ID:', asignaturaId);
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
  }

  getAsignaturas() {
    this.notaService.getAsignaturas().subscribe((res) => {
      this.asignaturas = res;
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
      this.notaService.getPersonasPorActividadYAsignatura(this.selectedAsignaturaId, this.selectedActividadId).subscribe(
        (res: Notas[]) => {
          console.log("ID asignatura:" + this.selectedAsignaturaId);
          console.log("ID actividad:" + this.selectedActividadId);
          console.log('Datos recibidos:', res);
          this.data = res;
        },
        error => {
          console.error('Error al obtener los datos:', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
