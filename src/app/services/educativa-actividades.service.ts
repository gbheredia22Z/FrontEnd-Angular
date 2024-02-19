import { Injectable } from '@angular/core';
import { EducativaActividades } from '../models/educativa-actividades';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Grado } from '../models/grado';
import { Asignatura } from '../models/asignatura';

@Injectable({
  providedIn: 'root'
})
export class EducativaActividadesService {
  [x: string]: any;
  grados!: Grado[];
  selectedActividades: EducativaActividades;
  periodoCalificacion: string = ''; // Define la propiedad 'periodoCalificacion' con un valor inicial


  actividades!: EducativaActividades[];
  URL_API_ACT = "http://127.0.0.1:3000/api/actividades/"
  URL_API = "http://127.0.0.1:3000/api"
  URL_API_AC = "http://127.0.0.1:3000/api"
  URL_ASIGNATURAS = "http://127.0.0.1:3000/api/asignatura/"
  URL_PERACADEMIC = "http://127.0.0.1:3000/api/periodoCalificaciones/"
  URL_TACTIVIDAD = "http://127.0.0.1:3000/api/tipoActividad/"
  URL_NOTAS = "http://127.0.0.1:3000/api"
  URL_GRADO = "http://127.0.0.1:3000/api/grado";
  URL_API2 = "http://127.0.0.1:3000/api"
  URL_API3 = "http://127.0.0.1:3000/api"

  constructor(private http: HttpClient) {
    this.selectedActividades = new EducativaActividades();
    this.selectedActividades = new EducativaActividades();
  }

  getActividadesPorAsignatura(asignaturaId: string): Observable<EducativaActividades[]> {
    const url = `${this.URL_API}/actividades/asignatura/${asignaturaId}`;
    return this.http.get<EducativaActividades[]>(url);
  }

  getGradoById(idGrado: string) {
    return this.http.get<any>(`${this.URL_GRADO}${idGrado}`);
  }

  getGrados() {
    return this.http.get<any[]>(this.URL_GRADO);
  }

  //metodo para traerr las actividades
  getActividadesEducativas() {
    return this.http.get(this.URL_API_ACT);
  }

  //enviar
  postActividadesEducativas(educativas: EducativaActividades) {
    // Asegúrate de incluir el ID de la asignatura en el cuerpo de la solicitud
    const body = {
      titulo: educativas.titulo,
      detalleActividad: educativas.detalleActividad,
      fechaInicio: educativas.fechaInicio,
      tipoActId: educativas.tipoActId,
      perCalId: educativas.perCalId,
      asignaturaId: educativas.asignaturaId, // Asegúrate de incluir el ID de la asignatura aquí
      estado: educativas.estado
    };
  
    // Realiza la solicitud POST con el cuerpo configurado
    return this.http.post(this.URL_API_ACT, body);
  }
  

  //actualizar
  putEducativaActividades(educativas: EducativaActividades): Observable<any> {
    const url = `${this['URL_API_ACT']}${educativas.id}`;
    return this.http.put(url, educativas).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar matricula:', error);
        throw error;
      })
    );
  }

  //obtener las asignaturas
  getAsignaturas() {
    return this.http.get<any[]>(this.URL_ASIGNATURAS);
  }

  //obtener los periodos de calificaciones
  getPCalificaciones() {
    return this.http.get<any[]>(this.URL_PERACADEMIC);
  }

  //obtener el tipo de actividad
  getTipoActividad() {
    return this.http.get<any[]>(this.URL_TACTIVIDAD)
  }

  registrarNotasAsignatura(asignaturaId: number): Observable<any> {
    const url = `${this.URL_NOTAS}/notas/${asignaturaId}`;

    // Define el cuerpo de la solicitud con valor_nota igual a cero
    const body = { valor_nota: 0 };

    // Realiza la solicitud HTTP con el cuerpo configurado
    return this.http.post(url, body);
  }
  getAsignaturasPorGrado(gradoId: number): Observable<any[]> {
    const url = `${this.URL_API2}/asignatura/grado/${gradoId}`;
    return this.http.get<any[]>(url);
  }
}
