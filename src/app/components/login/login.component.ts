import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Login } from '../../models/login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  selectedLogin: Login = new Login();
  username: string = '';
  password: string = '';
  mensajeBienvenida: string = '';
  idUsuario: number;
  asignaturaId: number;

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit() {
    this.loginService.postLogin(this.selectedLogin).subscribe(
      (response) => {
        console.log(response);
        if (response.usuario && response.usuario.tipoPersona === 'E') {
          this.mensajeBienvenida = `Bienvenido/a ${response.usuario.nombre}`;
          this.idUsuario = response.usuario.id;
          this.router.navigate(['/vista-estudiante'], {
            state: { mensaje: this.mensajeBienvenida, idUser: this.idUsuario }
          });
        } else if (response.usuario && response.usuario.tipoPersona === 'D') {
          this.mensajeBienvenida = `Bienvenido/a ${response.usuario.nombre}`;
          this.idUsuario = response.usuario.id;
          this.router.navigate(['/vista-docente'], {
            state: { mensaje: this.mensajeBienvenida, idUser: this.idUsuario }
          });
        } else if (response.usuario && response.usuario.tipoPersona === 'A') {
          this.mensajeBienvenida = `Bienvenido/a ${response.usuario.nombre}`;
          this.router.navigate(['/admin'], {
            state: { mensaje: this.mensajeBienvenida, idUser: this.idUsuario }
          });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
