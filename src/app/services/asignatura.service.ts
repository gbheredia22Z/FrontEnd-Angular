import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Asignatura } from '../models/asignatura';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  [x: string]: any;
  selectedAsignatura: Asignatura;
  asignaturas!: Asignatura[];
  URL_API = "http://127.0.0.1:3000/api/asignatura/";
  URL_API2 = "http://127.0.0.1:3000/api/asignaturaWithGrado";

  constructor(private http: HttpClient) {
    this.selectedAsignatura = new Asignatura();
    this.selectedAsignatura = new Asignatura();
  }

  getAsignatura() {
    return this.http.get(this.URL_API);
  }

  getasignaturaWithGrado(){
    return this.http.get(this.URL_API2)
  }
  
  postAsignatura(asignatura: Asignatura) {
    return this.http.post(this.URL_API, asignatura);
  }
 
  
  
  
  putAsignatura(asignatura: Asignatura): Observable<any> {
    const url = `${this['URL_API']}${this['asignatura'].id}`;
    return this.http.put(url, asignatura).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar asignatura:', error);
        throw error;
      })
    );
  }


  getGrados() {
    return this.http.get<any[]>('http://127.0.0.1:3000/api/grado'); // Ajusta la ruta según tu API
  }
}
