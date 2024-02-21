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
import { VistaEstudianteComponent } from './components/vista-estudiante/vista-estudiante.component';
import { VistaDocenteComponent } from './components/vista-docente/vista-docente.component';
import { ActividadesdocenteComponent } from './components/actividadesdocente/actividadesdocente.component';
import { CambioContraseniaComponent } from './components/cambio-contrasenia/cambio-contrasenia.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { NotasdocenteComponent } from './components/notasdocente/notasdocente.component';
import { CambioContraseniaOlvidoComponent } from './components/cambio-contrasenia-olvido/cambio-contrasenia-olvido.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'estudiante',
    component: EstudianteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  },
  {
    path: 'docente',
    component: DocenteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'periodo',
    component: PeriodoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'asignatura',
    component: AsignaturaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'grado',
    component: GradoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'matricula',
    component: MatriculaComponent,
    canActivate: [authGuard]
  },
  /*{
    path: 'login',
    component: LoginComponent,
  },*/
  {
    path: 'actividades',
    component: ActividadesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'periodo-calificaciones',
    component: PerCalificacionesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'actividades-educativas',
    component: EducativaActividadesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'nota',
    component: NotasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'vista-estudiante',
    component: VistaEstudianteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'vista-docente',
    component: VistaDocenteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'actividad-docente/:asignaturaId',
    component: ActividadesdocenteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cambio-contrasenia/:cedula',
    component: CambioContraseniaComponent
  },
  {
    path: 'administrador',
    component: AdministradorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'notas-docente/:asignaturaId',
    component: NotasdocenteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cambio-contrasenia-olvido',
    component: CambioContraseniaOlvidoComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
