import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  mensajeBienvenida: string;
  constructor(private router: Router, private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.mensajeBienvenida = history.state.mensaje ?? "Bienvenido/a admin";
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
