import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    [x: string]: any;
    selectedLogin: Login;
    logins: Login[] = [];
    URL_API = "http://127.0.0.1:3000/api/login/";

    constructor(private http: HttpClient) {
        this.selectedLogin = new Login();
    }

    getLogin() {
        return this.http.get<Login[]>(this.URL_API);
    }

    postLogin(login: Login) {
        return this.http.post(this.URL_API, login);
    }

    putLogin(login: Login): Observable<any> {
        const url = `${this['URL_API']}${login.cedula}`;
        return this.http.put(url, login).pipe(
            catchError((error: any) => {
                console.error('Error al actualizar registro:', error);
                throw error;
            })
        );
    }
}
