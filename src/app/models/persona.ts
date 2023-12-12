export class Persona {
    id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    fechaNacimiento: string;
    direccion: string;
    correo: string;
    celular: string;
  
    constructor(
      id: string = '',
      nombre: string = '',
      apellido: string = '',
      cedula: string = '',
      fechaNacimiento: string = '',
      direccion: string = '',
      correo: string = '',
      celular: string = ''
    ) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.cedula = cedula;
      this.fechaNacimiento = fechaNacimiento;
      this.direccion = direccion;
      this.correo = correo;
      this.celular = celular;
    }
  }
  
  export interface Persona {
    id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    fechaNacimiento: string;
    direccion: string;
    correo: string;
    celular: string;
  }
  