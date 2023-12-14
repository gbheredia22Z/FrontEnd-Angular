import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  login() {
    // Aquí puedes agregar lógica para autenticar al usuario
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    // Puedes redirigir a la página de inicio de docente o estudiante según la lógica de autenticación
  }

}
