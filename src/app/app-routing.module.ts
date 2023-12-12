import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Componentes
import { EstudianteComponent } from './components/estudiante/estudiante.component';

import { DocenteComponent } from './components/docente/docente.component';
import { AdminComponent } from './components/admin/admin.component';
import { PeriodoComponent } from './components/periodo/periodo.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';

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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
