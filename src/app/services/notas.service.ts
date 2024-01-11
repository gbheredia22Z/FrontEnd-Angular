import { Injectable } from '@angular/core';
import { Notas } from '../models/notas';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Asignatura } from '../models/asignatura';
import { EducativaActividades } from '../models/educativa-actividades';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  [x: string]: any;
  selectNotas: Notas;
  notas!: Notas[];
  URL_API = "http://127.0.0.1:3000/api"
  URL_ASIGNATURAS = "http://127.0.0.1:3000/api/asignatura/";
  URL_API3 = "http://127.0.0.1:3000/api/actividades/";
  private apiUrl = 'http://localhost:3000/api'; 
  constructor(private http: HttpClient) {
    this.selectNotas = new Notas();
    this.selectNotas = new Notas();

  }


  getPersonasPorActividadYAsignatura(asignaturaId: number, actividadId: number): Observable<Notas[]> {
    const url = `${this.URL_API}/traerproactividad?actividadId=${actividadId}&asignaturaId=${asignaturaId}`;
    return this.http.get<Notas[]>(url);
  }
  //traer las asigaturas
  //obtener las asignaturas
  getAsignaturas() {
    return this.http.get<any[]>(this.URL_ASIGNATURAS);
  }
  //traer actividades
  //metodo para traerr las actividades
  getActividadesEducativas() {
    return this.http.get<any[]>(this.URL_API3);
  }

  getActividadesPorAsignatura(asignaturaId: number): Observable<any[]> {
    const url = `${this.apiUrl}/actividades/porAsignatura/${asignaturaId}`;
    return this.http.get<any[]>(url);
  }



}
