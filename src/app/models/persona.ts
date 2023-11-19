export class Persona {
    static cedula: any;
    constructor(id = '', nombre = '', apellido = '', cedula = '', fechaNacimiento = '', direccion = '', correo = '', celular = '',) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.fechaNacimiento = fechaNacimiento;
        this.direccion = direccion;
        this.correo = correo;
        this.celular = celular;
    }
    id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    fechaNacimiento: string;
    direccion: string;
    correo: string;
    celular: string;
}
