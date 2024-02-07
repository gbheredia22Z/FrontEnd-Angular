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

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit() {
    this.loginService.postLogin(this.selectedLogin).subscribe(
      (response) => {
        console.log(response);
        if (response.usuario && response.usuario.tipoPersona === 'E') {
          this.mensajeBienvenida = `Bienvenido/a ${response.usuario.nombre}`;
          this.router.navigate(['/vista-estudiante'], { state: { mensaje: this.mensajeBienvenida } });
        } else if (response.usuario && response.usuario.tipoPersona === 'D') {
          this.router.navigate(['/vista-docente']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
