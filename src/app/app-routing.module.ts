import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Componentes
import { EstudianteComponent } from './components/estudiante/estudiante.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path:'estudiante',
    component: EstudianteComponent
  },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
