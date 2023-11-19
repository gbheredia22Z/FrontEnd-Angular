import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  selectedEstudiante: Persona;
  estudiantes!: Persona[];

  readonly URL_API = "http://localhost:3000/estudiante";


  constructor(private http: HttpClient) {
    this.selectedEstudiante = new Persona();
  }

  getEstudiante() {
    return this.http.get(this.URL_API);
  }
  postEstudiante(estudiante: Persona) {
    return this.http.post(this.URL_API, estudiante);
  }
  putEstudiante(estudiante: Persona) {
    return this.http.put(this.URL_API + `/${Persona.cedula}`, estudiante);
  }

}
