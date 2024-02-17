import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/persona';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Asignatura } from '../models/asignatura';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  [x: string]: any;
  selectedEstudiante: Persona;
  estudiantes!: Persona[];
  selectedDocente: Persona;
  docentes!: Persona[];
  selectedAdmin: Persona;
  administrador!: Persona[];


  URL_API = "http://127.0.0.1:3000/api/estudiante/";
  URL_API2 = "http://127.0.0.1:3000/api/docente/";
  apiUrl = "http://127.0.0.1:3000/api";
  apiUrl2 = "http://127.0.0.1:3000/api";
  URL_API_A = "http://127.0.0.1:3000/api";
  URL_API_D = "http://127.0.0.1:3000/api";
  URL_API_AC = "http://127.0.0.1:3000/api";
  URL_Docente = "http://127.0.0.1:3000/api";
  URL_Admin = "http://127.0.0.1:3000/api/admin/";

  constructor(private http: HttpClient) {
    this.selectedEstudiante = new Persona();
    this.selectedDocente = new Persona();
    this.selectedAdmin = new Persona();
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
  getEstudianteByCi(cedula: string): Observable<any> {
    const url = `${this.apiUrl2}/estudiante/cedula/${cedula}`;
    return this.http.get(url);
  }
  getEstudianteByCorreo(correo: string): Observable<any> {
    const url = `${this.apiUrl}/estudiante/correo/${correo}`;
    return this.http.get(url);
  }
  getEstudianteByCelular(celular: string): Observable<any> {
    const url = `${this.apiUrl}/estudiante/celular/${celular}`;
    return this.http.get(url);
  }
  /*****PARA PROFSORES */
  getTeacherByCi(cedula: string): Observable<any> {
    const url = `${this.URL_Docente}/docente/cedula/${cedula}`;
    return this.http.get(url);
  }
  getTeacherByCorreo(correo: string): Observable<any> {
    const url = `${this.URL_Docente}/docente/correo/${correo}`;
    return this.http.get(url);
  }
  getTeacherByCelular(celular: string): Observable<any> {
    const url = `${this.URL_Docente}/docente/celular/${celular}`;
    return this.http.get(url);
  }
  asignaturasPorIdEstudiante(idEstudiante: number): Observable<Asignatura[]> {
    const url = `${this.URL_API_A}/persona/asignaturas/${idEstudiante}`;
    return this.http.get<Asignatura[]>(url).pipe(
      catchError((error: any) => {
        console.error('Error al obtener las asignaturas:', error);
        throw error;
      })
    );
  }
  asignaturasPorIdDocente(idDocente: number): Observable<Asignatura[]> {
    const url = `${this.URL_API_D}/persona/asignaturas/${idDocente}`;
    return this.http.get<Asignatura[]>(url).pipe(
      catchError((error: any) => {
        console.error('Error al obtener las asignaturas:', error);
        throw error;
      })
    );
  }
  obtenerActividadesPorAsignatura(asignaturaId: number): Observable<any> {
    const url = `${this.URL_API_AC}/actividades/asignatura/${asignaturaId}`;
    return this.http.get<Asignatura[]>(url).pipe(
      catchError((error: any) => {
        console.error('Error al obtener las actividades:', error);
        throw error;
      })
    );

  }
  //ADMIN
  getAdmin() {
    return this.http.get(this.URL_Admin);
  }
  postAdmin(administrador: Persona) {
    return this.http.post(this.URL_Admin, administrador);
  }
  putAdmin(administrador: Persona): Observable<any> {
    const url = `${this['URL_Admin']}${administrador.id}`;
    return this.http.put(url, administrador).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar administrador:', error);
        throw error;
      })
    );
  }
  getAdminById(id: string): Observable<any> {
    const url = `${this.URL_Admin}/id/${id}`;
    return this.http.get(url);
  }
  getAdminByCi(cedula: string): Observable<any> {
    const url = `${this.URL_Admin}/cedula/${cedula}`;
    return this.http.get(url);
  }
  getAdminByCorreo(correo: string): Observable<any> {
    const url = `${this.URL_Admin}/correo/${correo}`;
    return this.http.get(url);
  }
  getAdminByCelular(celular: string): Observable<any> {
    const url = `${this.URL_Admin}/celular/${celular}`;
    return this.http.get(url);
  }
}


