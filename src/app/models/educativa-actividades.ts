export class EducativaActividades {
    id: string;
    titulo: string;
    detalleActividad: string;
    fechaInicio: string;
    fechaFin: string;
    tipoActId: number; // Cambiado a tipo number
    perCalId: number; // Cambiado a tipo number
    estado: string;
    asignaturaId: number; // Cambiado a tipo number
    periodoCalificaciones: {
        nombrePeriodo: string;
    };
    tipoActividad: {
        nombreActividad: string;
    };
    asignatura: {
        nombreMateria: string;
    }

    constructor(
        id: string = '',
        titulo: string = '',
        detalleActividad: string = '',
        fechaInicio: string = '',
        fechaFin: string = '',
        tipoActId: number = 0, // Inicializado a 0
        perCalId: number = 0, // Inicializado a 0
        estado: string = '',
        asignaturaId: number = 0, // Inicializado a 0
        periodoCalificaciones: { nombrePeriodo: string } = { nombrePeriodo: '' },
        tipoActividad: { nombreActividad: string } = { nombreActividad: '' },
        asignatura: { nombreMateria: string } = { nombreMateria: '' }
    ) {
        this.id = id;
        this.titulo = titulo;
        this.detalleActividad = detalleActividad;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.tipoActId = tipoActId;
        this.perCalId = perCalId;
        this.estado = estado;
        this.asignaturaId = asignaturaId;
        this.periodoCalificaciones = periodoCalificaciones;
        this.tipoActividad = tipoActividad;
        this.asignatura = asignatura;
    }
}
