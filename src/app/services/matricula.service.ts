import { Injectable } from '@angular/core';
import { Matricula } from '../models/matricula';
import { HttpClient } from '@angular/common/http';
import { Asignatura } from '../models/asignatura';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  [x: string]: any;
  selectedMatricula: Matricula;
  matriculas!: Matricula[];
  URL_API = "http://127.0.0.1:3000/api/matricula/";
  selectedEstudiante:any;


  constructor(private http: HttpClient) {
    this.selectedMatricula = new Matricula();
    this.selectedMatricula = new Matricula();
    this.selectedEstudiante = null; // Inicializa selectedEstudiante aquí
   }

   getMatricula(){
    return this.http.get(this.URL_API);
   }

   postMaticula(matricula : Matricula){
    
    return this.http.post(this.URL_API, matricula);
   }

   putMatricula(matricula: Matricula): Observable<any> {
    const url = `${this['URL_API']}${matricula.id}`;
    return this.http.put(url, matricula).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar matricula:', error);
        throw error;
      })
    );
  }
  

   //persona
   getEstudiantes() {
    return this.http.get<any[]>('http://127.0.0.1:3000/api/estudiante'); // Ajusta la ruta según tu API
  }
   //periodo
   getPeriodo() {
    return this.http.get<any[]>('http://127.0.0.1:3000/api/periodo'); // Ajusta la ruta según tu API
  }
   
   //grado
   getGrados() {
    return this.http.get<any[]>('http://127.0.0.1:3000/api/grado'); // Ajusta la ruta según tu API
  }

   

}
