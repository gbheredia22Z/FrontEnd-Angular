import { Injectable } from '@angular/core';
import { Notas } from '../models/notas';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Asignatura } from '../models/asignatura';
import { EducativaActividades } from '../models/educativa-actividades';
import { Persona } from '../models/persona';
import { NotasDTO } from '../models/notas-dto';
import { Notasdtoall } from '../models/notasdtoall';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  [x: string]: any;
  selectNotas: Notas;
  notas!: Notas[];
  selectedEstudiante: Persona;
  estudiantes!: Persona[];
  selectDTO: NotasDTO;
  seleccionarDto: Notasdtoall;
  URL_API = "http://127.0.0.1:3000/api"
  URL_ASIGNATURAS = "http://127.0.0.1:3000/api/asignatura/";
  URL_API3 = "http://127.0.0.1:3000/api/actividades/";
  private apiUrl = 'http://localhost:3000/api';
  URL_Student = "http://127.0.0.1:3000/api/estudiante/";
  URL_ESTUDIANTE_BY_ID = "http://127.0.0.1:3000/api/estudiante/traer/";
  URL_APIACT = 'http://localhost:3000/api';


  constructor(private http: HttpClient) {
    this.selectNotas = new Notas();
    this.selectNotas = new Notas();
    this.selectedEstudiante = new Persona();
    this.selectDTO = new NotasDTO();
    this.seleccionarDto = new Notasdtoall();
    this.notas = [];

  }


  getPersonasPorActividadYAsignatura(asignaturaId: number, actividadId: number): Observable<Notas[]> {
    const url = `${this.URL_API}/traerproactividad?actividadId=${actividadId}&asignaturaId=${asignaturaId}`;
    return this.http.get<Notas[]>(url);
  }
  getDatos(asignaturaId: number, actividadId: number): Observable<NotasDTO[]> {
    const url = `${this.URL_API}/traernotas?actividadId=${actividadId}&asignaturaId=${asignaturaId}`;
    return this.http.get<NotasDTO[]>(url);
  }
  getAllNotas(asignaturaId: number, actividadId: number): Observable<Notasdtoall[]> {
    const url = `${this.URL_API}/traernotas?actividadId=${actividadId}&asignaturaId=${asignaturaId}`;
    return this.http.get<Notasdtoall[]>(url);
  }
  //traer las asigaturas
  //obtener las asignaturas
  getAsignaturas() {
    return this.http.get<any[]>(this.URL_ASIGNATURAS);
  }
  getGrados() {
    return this.http.get<any[]>(this.URL_API + "/grado");
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

  getEstudiante() {
    return this.http.get(this.URL_Student);
  }


  getNotas() {
    return this.http.get(this.URL_API + "/notas");
  }
  getEstudianteById(personaId: string) {
    return this.http.get<any>(`${this.URL_ESTUDIANTE_BY_ID}${personaId}`);
  }
  getActividadById(actividadId: number) {
    return this.http.get<any>(`${this.URL_API3}${actividadId}`);
  }

  //actualizr nota:
  //actualizar nota:
  asignarNota(id: string, valor_nota: number): Observable<any> {
    const data = { valor_nota: parseFloat(valor_nota.toString()) }; // Convierte a número antes de enviar al servidor

    return this.http.put<any>(`${this.URL_API}/notas/${id}`, data);
  }

  getAsignaturasPorGrado(gradoId: number): Observable<any[]> {
    const url = `${this.URL_API}/asignatura/grado/${gradoId}`;
    return this.http.get<any[]>(url);
  }
  // En NotasService
  obtenerNotasEstudiante(idEstudiante: number, idAsignatura: number): Observable<any[]> {
    const url = `http://127.0.0.1:3000/api/traeractividades/asignatura/estudiante/?idEstudiante=${idEstudiante}&idAsignatura=${idAsignatura}`;
    return this.http.get<any[]>(url);
  }

  // Método para obtener las notas por actividad y asignatura
  getNotasPorActividadYAsignatura(actividadId: number, asignaturaId: number): Observable<any[]> {
    const url = `http://127.0.0.1:3000/api/actividad/${actividadId}/asignatura/${asignaturaId}`;
    return this.http.get<any[]>(url);
  }

  // Método para obtener las actividades por asignatura y actividad
  getActividadesNotas(actividadId: number, asignaturaId: number): Observable<any[]> {
    const url = `${this.URL_API}/traeractividades/asignatura/actividad/?actividadId=${actividadId}&asignaturaId=${asignaturaId}`;
    return this.http.get<any[]>(url);
  }

}
