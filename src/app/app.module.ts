import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EstudianteComponent } from "./components/estudiante/estudiante.component";
import { DocenteComponent } from './components/docente/docente.component';
import { AdminComponent } from './components/admin/admin.component';
import { PeriodoComponent } from './components/periodo/periodo.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { GradoComponent } from './components/grado/grado.component';
import { MatriculaComponent } from './components/matricula/matricula.component';
import { DataTablesModule } from "angular-datatables";
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { PerCalificacionesComponent } from './components/per-calificaciones/per-calificaciones.component';
import { EducativaActividadesComponent } from './components/educativa-actividades/educativa-actividades.component';
import { NotasComponent } from './components/notas/notas.component';
import { VistaEstudianteComponent } from './components/vista-estudiante/vista-estudiante.component';
import { VistaDocenteComponent } from './components/vista-docente/vista-docente.component';
import { ActividadesdocenteComponent } from './components/actividadesdocente/actividadesdocente.component';
import { CambioContraseniaComponent } from './components/cambio-contrasenia/cambio-contrasenia.component';

@NgModule({
    declarations: [
        AppComponent,
        EstudianteComponent,
        DocenteComponent,
        AdminComponent,
        PeriodoComponent,
        AsignaturaComponent,
        GradoComponent,
        MatriculaComponent,
        LoginComponent,
        ActividadesComponent,
        PerCalificacionesComponent,
        EducativaActividadesComponent,
        NotasComponent,
        VistaEstudianteComponent,
        VistaDocenteComponent,
        ActividadesdocenteComponent,
        CambioContraseniaComponent    ],
    imports: [
        BrowserModule, 
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DataTablesModule,
        RouterModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
