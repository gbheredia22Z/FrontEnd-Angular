import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EstudianteComponent } from "./components/estudiante/estudiante.component";
import { AreaEstudianteComponent } from './components/area-estudiante/area-estudiante.component';
import { AreaEstudianteAsigComponent } from './components/area-estudiante-asig/area-estudiante-asig.component';


@NgModule({
    declarations: [
        AppComponent,
        EstudianteComponent,
        AreaEstudianteComponent,
        AreaEstudianteAsigComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
