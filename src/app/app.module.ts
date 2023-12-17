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
        LoginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DataTablesModule,
        RouterModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
