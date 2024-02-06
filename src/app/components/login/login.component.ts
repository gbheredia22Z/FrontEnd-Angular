import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Login } from '../../models/login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  selectedLogin: Login = new Login();
  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  login() {
    // Aquí puedes agregar lógica para autenticar al usuario
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    // Puedes redirigir a la página de inicio de docente o estudiante según la lógica de autenticación
  }

  onSubmit() {
    this.loginService.postLogin(this.selectedLogin).subscribe(
      (response) => {
        // Maneja la respuesta del servidor
        console.log(response);

        // Redirección según el tipo de persona
        if (response.usuario && response.usuario.tipoPersona === 'E') {
          this.router.navigate(['/vista-estudiante']);
        } else if (response.usuario && response.usuario.tipoPersona === 'D') {
          this.router.navigate(['/vista-docente']);
        }else{
          this.router.navigate(['/admin']);

        }
      },
      (error) => {
        // Maneja el error
        console.error(error);
      }
    );
  }
}
