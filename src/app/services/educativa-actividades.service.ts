import { Injectable } from '@angular/core';
import { EducativaActividades } from '../models/educativa-actividades';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EducativaActividadesService {
  [x: string]: any;
  selectedActividades:EducativaActividades;
  actividades!:EducativaActividades[];
  URL_API="http://127.0.0.1:3000/api/actividades/"
  URL_ASIGNATURAS = "http://127.0.0.1:3000/api/asignatura/"
  URL_PERACADEMIC = "http://127.0.0.1:3000/api/periodoCalificaciones/"
  URL_TACTIVIDAD = "http://127.0.0.1:3000/api/tipoActividad/"
  URL_NOTAS= "http://127.0.0.1:3000/api"

  constructor(private http:HttpClient) {
    this.selectedActividades = new EducativaActividades();
    this.selectedActividades = new EducativaActividades();
   }

   //metodo para traerr las actividades
   getActividadesEducativas(){
    return this.http.get(this.URL_API);
   }

   //enviarfdd
   postActividadesEducativas(educativas:EducativaActividades){
    return this.http.post(this.URL_API, educativas);
   }

   //actualixr
   putEducativaActividades(educativas: EducativaActividades): Observable<any> {
    const url = `${this['URL_API']}${educativas.id}`;
    return this.http.put(url, educativas).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar matricula:', error);
        throw error;
      })
    );
  }

  //obtener las asignaturas
  getAsignaturas(){

    return  this.http.get<any[]>(this.URL_ASIGNATURAS);

  }

  //obtener los periodos de calificaciones
  getPCalificaciones(){
    return  this.http.get<any[]>(this.URL_PERACADEMIC);
  }

  //obtener el tipo de actividad
  getTipoActividad(){
    return  this.http.get<any[]>(this.URL_TACTIVIDAD)
  }

  registrarNotasAsignatura(asignaturaId: number): Observable<any> {
    const url = `${this.URL_NOTAS}/notas/${asignaturaId}`;
    
    // Define el cuerpo de la solicitud con valor_nota igual a cero
    const body = { valor_nota: 0 };

    // Realiza la solicitud HTTP con el cuerpo configurado
    return this.http.post(url, body);
  }
}
