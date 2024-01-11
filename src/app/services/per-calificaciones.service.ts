import { Injectable } from '@angular/core';
import { PerCalificaciones } from '../models/per-calificaciones';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerCalificacionesService {

  [x: string]: any;
  selectPerCalificaciones:PerCalificaciones;
  tiposPerCalificaciones !: PerCalificaciones[];

  URL_API = "http://127.0.0.1:3000/api/periodoCalificaciones/";

  constructor(private http:HttpClient) 
  {
    this.selectPerCalificaciones =
    new PerCalificaciones();

    this.selectPerCalificaciones =
    new PerCalificaciones();
   }

   getPeriodoCalificaciones(){
    return this.http.get(this.URL_API);
   }

   postPeriodoCalificacines(perCalificaciones:PerCalificaciones){
    return this.http.post(this.URL_API, perCalificaciones);
   }

   putPerCalificacion(perCalificaciones:PerCalificaciones){
    const url = `${this['URL_API']}${perCalificaciones.id}`;
    return this.http.put(url, perCalificaciones).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar periodos calificaciones:', error);
        throw error;
      })
    );
   }

   getPeriodoCalificacionByNombre(nombrePeriodo: string): Observable<PerCalificaciones> {
    const url = `${this.URL_API}/nombre?nombrePeriodo=${nombrePeriodo}`;
    return this.http.get<PerCalificaciones>(url);
  }
  
  
  
}
