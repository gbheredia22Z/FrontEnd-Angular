import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  selectedLogin: Login;
  logins: Login[] = [];
  URL_API = "http://127.0.0.1:3000/api/login/";

  constructor(private http: HttpClient) {
    this.selectedLogin = new Login();
  }

  getLogin() {
    return this.http.get<Login[]>(this.URL_API);
  }

  postLogin(login: Login): Observable<any> {
    return this.http.post<any>(this.URL_API, login);
  }


  putLogin(login: Login): Observable<any> {
    const url = `${this.URL_API}${login.cedula}`;
    return this.http.put(url, login).pipe(
      catchError((error: any) => {
        console.error('Error al actualizar registro:', error);
        throw error;
      })
    );
  }

  private cedulaUsuario: string;

  setCedulaUsuario(cedula: string): void {
    this.cedulaUsuario = cedula;
  }

  getCedulaUsuario(): string {
    return this.cedulaUsuario;
  }

  private apiUrl = 'http://127.0.0.1:3000/api/login/cambiarcontrasena';

  cambiarContrasenaPrimerInicio(cedula: string, nuevaContrasena: string): Observable<any> {
    const body = { cedula, nuevaContrasena };
    return this.http.put<any>(this.apiUrl, body);
  }


  // Método para cambiar la contraseña si se olvidó
  cambiarContrasenaOlvido(cedula: string, nuevaContrasena: string): Observable<any> {
    const url = `${this.URL_API}cambiarcontrasenaolvido`;
    const body = { cedula, nuevaContrasena };

    return this.http.put(url, body).pipe(
      catchError((error: any) => {
        console.error('Error al cambiar la contraseña por olvido:', error);
        throw error;
      })
    );
  }

}
