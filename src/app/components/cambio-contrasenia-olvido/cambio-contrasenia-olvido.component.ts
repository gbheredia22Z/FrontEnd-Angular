import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-contrasenia-olvido',
  templateUrl: './cambio-contrasenia-olvido.component.html',
  styleUrl: './cambio-contrasenia-olvido.component.scss'
})
export class CambioContraseniaOlvidoComponent implements OnInit {
  cedula: string;
  nuevaContrasena: string;
  cambioContrasenaForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit(): void {
        //Inicialización del formulario aquí
        this.cambioContrasenaForm = this.formBuilder.group({
          nuevaContrasena: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.pattern(/^(?=.[A-Z])(?=.[@$!%*?&])/),
            ],
          ],
        });
    
  }

  onSubmit(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se cambiará la contraseña por olvido. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar contraseña',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llama al servicio para cambiar la contraseña por olvido
        this.loginService.cambiarContrasenaOlvido(this.cedula, this.nuevaContrasena)
          .subscribe(
            () => {
              // Maneja el éxito (puedes redirigir al usuario a la página de inicio de sesión)
              Swal.fire('Contraseña cambiada', 'La contraseña se cambió exitosamente.', 'success');
              this.router.navigate(['/login']);
            },
            (error) => {
              // Maneja el error (puedes mostrar un mensaje de error al usuario)
              console.error('Error al cambiar la contraseña por olvido:', error);
            }
          );
      }
    });

  }
}