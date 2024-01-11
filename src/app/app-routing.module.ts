import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Componentes
import { EstudianteComponent } from './components/estudiante/estudiante.component';

import { DocenteComponent } from './components/docente/docente.component';
import { AdminComponent } from './components/admin/admin.component';
import { PeriodoComponent } from './components/periodo/periodo.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { GradoComponent } from './components/grado/grado.component';
import { MatriculaComponent } from './components/matricula/matricula.component';
import { LoginComponent } from './components/login/login.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { PerCalificacionesComponent } from './components/per-calificaciones/per-calificaciones.component';
import { EducativaActividadesComponent } from './components/educativa-actividades/educativa-actividades.component';
import { NotasComponent } from './components/notas/notas.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path:'estudiante',
    component: EstudianteComponent
  },
  {
    path:'admin',
    component: AdminComponent
  },
  {
    path:'docente',
    component: DocenteComponent
  },
  {
    path:'periodo',
    component: PeriodoComponent
  },
  {
    path:'asignatura',
    component: AsignaturaComponent
  },
  {
    path:'grado',
    component: GradoComponent
  },
  {
    path:'matricula',
    component: MatriculaComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'actividades',
    component:ActividadesComponent
  },
  {
    path:'periodo-calificaciones',
    component:PerCalificacionesComponent
  },
  {
    path:'actividades-educativas',
    component:EducativaActividadesComponent
  },
  {
    path:'nota/:asignaturaId',
    component:NotasComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
