export class Notasdtoall {
    idPersona: string;
    nombre: string;
    apellido: string;
    idActividad: number;
    tituloActividad: string;
    detalleActividad: string;
    idAsignatura: number;
    nombreAsignatura: string;
    nota: number;
    idNota: string;

    constructor(
        idPersona: string = '',
        nombre: string = '',
        apellido: string = '',
        idActividad: number = 0,
        tituloActividad: string = '',
        detalleActividad: string = '',
        idAsignatura: number = 0,
        nombreAsignatura: string = '',
        nota: number = 0,
        idNota: string = ''
    ) {
        this.idPersona = idPersona;
        this.nombre = nombre;
        this.apellido = apellido;
        this.idActividad = idActividad;
        this.tituloActividad = tituloActividad;
        this.detalleActividad = detalleActividad;
        this.idAsignatura = idAsignatura;
        this.nombreAsignatura = nombreAsignatura;
        this.nota = nota
        this.idNota = idNota;
    }
}
