import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Login } from '../../models/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-contrasenia',
  templateUrl: './cambio-contrasenia.component.html',
  styleUrl: './cambio-contrasenia.component.scss'
})

export class CambioContraseniaComponent implements OnInit{
  cedula: string;
  nuevaContrasena: string;
  cambioContrasenaForm: FormGroup;
 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cambioContrasenaService: LoginService,
    private formBuilder: FormBuilder,
    
  ) {}

  ngOnInit(): void {
    this.cedula = this.route.snapshot.params['cedula'];

    // Inicialización del formulario aquí
    this.cambioContrasenaForm = this.formBuilder.group({
      nuevaContrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&])/),
        ],
      ],
    });

    this.mostrarAlerta();
  }


  onSubmit(): void {
    this.cambioContrasenaService.cambiarContrasenaPrimerInicio(this.cedula, this.nuevaContrasena)
      .subscribe(
        (response) => {
          console.log(response);
          Swal.fire('Contraseña cambiada', 'La contraseña se cambió exitosamente.', 'success');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  mostrarAlerta() {
    Swal.fire({
      title: '¡Atención!',
      text: 'Se recomienda cambiar su contraseña por una más segura para garantizar la seguridad de su cuenta.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#8b5cf6',
      iconColor: '#ceb0ff',
      confirmButtonText: 'Entendido'
    });
  }
}
