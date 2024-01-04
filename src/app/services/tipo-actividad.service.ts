import { Injectable } from '@angular/core';
import { TipoActividad } from '../models/tipo-actividad';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoActividadService {

  [x: string]: any;
  selectedActividad:TipoActividad;
  tiposactividades!:TipoActividad[];

  URL_API = "http://127.0.0.1:3000/api/tipoActividad/";

  constructor(
    private http:HttpClient
  ) {
    this.selectedActividad = new TipoActividad();
    this.selectedActividad = new TipoActividad();
   }

   getTipoActividad(){
    return this.http.get(this.URL_API);
   }

   postTipoActividad(tipoActividad:TipoActividad){
    return this.http.post(this.URL_API, tipoActividad);
   }

   putTipoActividad(tipoActividad:TipoActividad){
    const url = `${this['URL_API']}${tipoActividad.id}`;
    return this.http.put(url, tipoActividad).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar tipoactividad:', error);
        throw error;
      })
    );
   }

}
