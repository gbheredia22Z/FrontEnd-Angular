export class EducativaActividades {
    id: string;
    gradoId: number;
    titulo: string;
    detalleActividad: string;
    fechaInicio: string;
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
        gradoId: number = 0,
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
     
        this.gradoId = gradoId;
        this.tipoActId = tipoActId;
        this.perCalId = perCalId;
        this.estado = estado;
        this.asignaturaId = asignaturaId;
        this.periodoCalificaciones = periodoCalificaciones;
        this.tipoActividad = tipoActividad;
        this.asignatura = asignatura;
    }
}
