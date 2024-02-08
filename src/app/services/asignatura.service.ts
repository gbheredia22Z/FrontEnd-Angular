import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Asignatura } from '../models/asignatura';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Grado } from '../models/grado';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  [x: string]: any;
  selectedAsignatura: Asignatura;
  asignaturas: Asignatura[] = [];
  selectedGrado: any;
  grados!: Grado[];
  URL_API = "http://127.0.0.1:3000/api/asignatura/";
  URL_API2 = "http://127.0.0.1:3000/api/asignaturaWithGrado";
  URL_GRADOS_BY_ID="http://localhost:3000/api/grado/traer/";
  URL_API3 = "http://127.0.0.1:3000/api/asignatura/";

  constructor(private http: HttpClient) {
    this.selectedAsignatura = new Asignatura();
    this.selectedAsignatura = new Asignatura();
    this.selectedGrado = null;
    //this.asignaturas = null;
  }

  getAsignatura() {
    return this.http.get<Asignatura[]>(this.URL_API);
  }
  
  getasignaturaWithGrado(){
    return this.http.get(this.URL_API2)
  }
  
  postAsignatura(asignatura: Asignatura) {
    return this.http.post(this.URL_API, asignatura);
  }
 
  
  putAsignatura(asignatura: Asignatura): Observable<any> {
    const url = `${this['URL_API']}${asignatura.id}`;
    return this.http.put(url, asignatura).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar asignatura:', error);
        throw error;
      })
    );
  }
  
  validarAsignaturaPorGrado(nombreMateria: string, idGrado: number): Observable<void> {
    const url = `${this.URL_API3}validarAsignaturaPorGrado`;

   
    return this.http.post<void>(url, { nombreMateria, idGrado }).pipe(
      catchError((error: any) => {
        console.error('Error al validar asignatura por grado:', error);
        throw error;
      })
    );
  }


  getGrados() {
    return this.http.get<any[]>('http://127.0.0.1:3000/api/grado'); // Ajusta la ruta según tu API
  }

  getAsignaturaById(id: number): Observable<Asignatura> {
    const url = `${this['URL_API']}${id}`;
    return this.http.get<Asignatura>(url).pipe(
      catchError((error: any) => {
        console.error('Error al obtener la asignatura por ID:', error);
        throw error;
      })
    );
  }

  getGradoById(idGrado: string) {
    return this.http.get<any>(`${this.URL_GRADOS_BY_ID}${idGrado}`);
  }
  
  
}
