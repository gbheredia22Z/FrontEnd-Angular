import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import Swal from 'sweetalert2';


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
  cedula2:string='';

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit() {
    this.loginService.postLogin(this.selectedLogin).subscribe(
      (response) => {
        console.log(response);
        console.log(response.token);
        Swal.fire('Inicio de sesión exitoso', '', 'success');
        if (response.primerInicioSesion) {
          // Es el primer inicio de sesión, redirige a cambio de contraseña
          this.cedula2 = this.selectedLogin.cedula;
          //this.router.navigate(['/cambio-contrasenia '], { state: { cedula: this.cedula2 } });
          this.router.navigate(['/cambio-contrasenia', this.cedula2]);
        } else {
          // No es el primer inicio de sesión, realiza la redirección según el tipo de usuario
          if (response.usuario && response.usuario.tipoPersona === 'E') {
            this.mensajeBienvenida = `Bienvenido/a ${response.usuario.nombre}`;
            this.idUsuario = response.usuario.id;
            this.router.navigate(['/vista-estudiante'], { state: { mensaje: this.mensajeBienvenida, idUser: this.idUsuario } });
          } else if (response.usuario && response.usuario.tipoPersona === 'D') {
            this.mensajeBienvenida = `Bienvenido/a ${response.usuario.nombre}`;
            this.idUsuario = response.usuario.id;
            this.router.navigate(['/vista-docente'], { state: { mensaje: this.mensajeBienvenida, idUser: this.idUsuario} });
          } else if (response.usuario && response.usuario.tipoPersona === 'A') {
            this.mensajeBienvenida = `Bienvenido/a admin`;
            this.router.navigate(['/admin'], { state: { mensaje: this.mensajeBienvenida, idUser: this.idUsuario } });
          }
        }
        localStorage.setItem('token', response.token);
      },
      (error) => {
        console.error(error);
        Swal.fire('¡OOPS!', 'Error al iniciar sesión. Por favor, verifique sus credenciales', 'error');

      }
    );
  }
}
