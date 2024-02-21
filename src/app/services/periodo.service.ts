import { Injectable } from '@angular/core';
import { Periodo } from '../models/periodo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  [x: string]: any;
  selectedPeriodo: Periodo;
  periodos!: Periodo[];
  
  
  URL_API = "http://54.196.78.164:9000/api/periodo/";

  constructor(private http: HttpClient) {
    this.selectedPeriodo = new Periodo();
    this.selectedPeriodo = new Periodo();
    this.periodos = [];
  }

  getPeriodo() {
    return this.http.get(this.URL_API);
  }
  postPeriodo(periodo: Periodo) {
    return this.http.post(this.URL_API, periodo);
  }
  putPeriodo(periodo: Periodo): Observable<any> {
    const url = `${this['URL_API']}${periodo.id}`;
    return this.http.put(url, periodo).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar periodo:', error);
        throw error;
      })
    );
  }
}
