import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  selectedEstudiante: Persona;
  estudiantes!: Persona[];

  URL_API = "http://127.0.0.1:3000/api/estudiantes/";
  URL_API2 = "http://127.0.0.1:3000/api/estudiante/";

  constructor(private http: HttpClient) {
    this.selectedEstudiante = new Persona();
  }

  getEstudiante() {
    return this.http.get(this.URL_API);
  }
  postEstudiante(estudiante: Persona) {
    return this.http.post(this.URL_API2, estudiante);
  }
  putEstudiante(estudiante: Persona) {
    return this.http.put(this.URL_API2 + `/${Persona.cedula}`, estudiante);
  }

}
