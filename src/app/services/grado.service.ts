import { Injectable } from '@angular/core';
import { Grado } from '../models/grado';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class GradoService {

  [x: string]: any;
  selectedGrado: Grado;
  grados!: Grado[];
  selectedDocentes:any;
  
  URL_API = "http://127.0.0.1:3000/api/grado/";

  constructor(private http: HttpClient) {
    this.selectedGrado = new Grado();
    this.selectedGrado = new Grado();
    this.selectedDocentes = null;
  }

  getGrado() {
    return this.http.get(this.URL_API);
  }

  getDocentes() {
    return this.http.get<any[]>('http://127.0.0.1:3000/api/docente'); // Ajusta la ruta según tu API
  }
  postGrado(grado: Grado) {
    return this.http.post(this.URL_API, grado);
  }
  putGrado(grado: Grado): Observable<any> {
    const url = `${this['URL_API']}${grado.id}`;
    return this.http.put(url, grado).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar grado:', error);
        throw error;
      })
    );
  }
}
