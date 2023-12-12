import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/persona';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  [x: string]: any;
  selectedEstudiante: Persona;
  estudiantes!: Persona[];
  selectedDocente: Persona;
  docentes!: Persona[];

  URL_API = "http://127.0.0.1:3000/api/estudiante/";
  URL_API2 = "http://127.0.0.1:3000/api/docente/";

// En tu componente, puedes utilizar el DatePipe para formatear la fecha


  constructor(private http: HttpClient) {
    this.selectedEstudiante = new Persona();
    this.selectedDocente = new Persona();
  }

  
  getEstudiante() {
    return this.http.get(this.URL_API);
  }
  postEstudiante(estudiante: Persona) {
    return this.http.post(this.URL_API, estudiante);
  }
  putEstudiante(estudiante: Persona): Observable<any> {
    const url = `${this['URL_API']}${estudiante.id}`;
    return this.http.put(url, estudiante).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar estudiante:', error);
        throw error;
      })
    );
  }

  getDocente() {
    return this.http.get(this.URL_API2);
  }
  postDocente(docente: Persona) {
    return this.http.post(this.URL_API2, docente);
  }
  putDocente(docente: Persona): Observable<any> {
    const url = `${this['URL_API']}${docente.id}`;
    return this.http.put(url, docente).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar docente:', error);
        throw error;
      })
    );
  }

    
}


