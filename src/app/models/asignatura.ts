export class Asignatura {
    id: string;
    nombreMateria: string;
    estado: string;
    idGrado: string;
   
    constructor(
        id: string = '',
        nombreMateria: string = '',
        estado: string = '',
        idGrado = ''
    ) {
        this.id = id;
        this.nombreMateria = nombreMateria;
        this.estado = estado;
        this.idGrado = idGrado;
    }
}

export interface Asignatura {
    id: string;
    nombreMateria: string;
    estado: string;
    idGrado: string;
}
