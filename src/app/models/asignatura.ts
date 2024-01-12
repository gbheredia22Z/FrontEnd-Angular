export class Asignatura {
    id: string;
    nombreMateria: string;
    estado: string;
    idGrado: string;
    grado: {
        nombreGrado: string;
    }

    constructor(
        id: string = '',
        nombreMateria: string = '',
        estado: string = '',
        idGrado = '',
        grado: { nombreGrado: string; } = { nombreGrado: '' }
    ) {
        this.id = id;
        this.nombreMateria = nombreMateria;
        this.estado = estado;
        this.idGrado = idGrado;
        this.grado = grado;
    }
}

export interface Asignatura {
    id: string;
    nombreMateria: string;
    estado: string;
    idGrado: string;
}
