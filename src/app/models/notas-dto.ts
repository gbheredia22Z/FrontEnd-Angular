export class NotasDTO {
    id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    fechaNacimiento: string;
    direccion: string;
    correo: string;
    celular: string;
    tipoPersona: string;
    IdActividad: number;
    idAsignatura: number;
    actividadEducativaTitulo: string;
    id_nota:string;
    nota: number;
    constructor(
        id: string = '',
        nombre: string = '',
        apellido: string = '',
        cedula: string = '',
        fechaNacimiento: string = '',
        direccion: string = '',
        correo: string = '',
        celular: string = '',
        tipoPersona: string = '',
        IdActividad: number = 0,
        idAsignatura: number = 0,
        actividadEducativaTitulo: string = '',
        id_nota:string= '',
        nota: number = 0
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.fechaNacimiento = fechaNacimiento;
        this.direccion = direccion;
        this.correo = correo;
        this.celular = celular;
        this.tipoPersona = tipoPersona;
        this.IdActividad = IdActividad;
        this.idAsignatura = idAsignatura;
        this.actividadEducativaTitulo = actividadEducativaTitulo;
        this.id_nota = id_nota;
        this.nota = nota;
    }
}

